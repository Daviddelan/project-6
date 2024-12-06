'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { findRouteMatches } from '@/lib/routes/matching';
import type { Route, RouteMatch, UserProfile } from '@/lib/types';

export function MatchList() {
  const [matches, setMatches] = useState<RouteMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const routesQuery = query(
      collection(db, 'routes'),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(routesQuery, async (snapshot) => {
      const routes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Route[];

      // Get current user's route
      const userRoute = routes.find(route => route.userId === auth.currentUser!.uid);
      if (!userRoute) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // Get all users for the routes
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const users: Record<string, UserProfile> = {};
      usersSnapshot.forEach((doc: QueryDocumentSnapshot) => {
        users[doc.id] = doc.data() as UserProfile;
      });

      // Find matches
      const potentialMatches = routes.filter(route => 
        route.userId !== auth.currentUser!.uid && 
        route.preferences.carpoolPreference
      );

      const matches = findRouteMatches(userRoute, potentialMatches, users);
      setMatches(matches);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleContact = (method: 'email' | 'phone', contact: string) => {
    if (method === 'email') {
      window.location.href = `mailto:${contact}`;
    } else {
      window.location.href = `tel:${contact}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Potential Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading matches...</p>
          ) : matches.length === 0 ? (
            <p className="text-center text-muted-foreground">No matches found</p>
          ) : (
            matches.map((match) => (
              <div
                key={match.matchedRoute.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {match.matchedUser.displayName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Match Score: {Math.round(match.matchScore)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {match.matchedUser.preferences?.shareEmail && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContact('email', match.matchedUser.email)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    )}
                    {match.matchedUser.preferences?.sharePhone && match.matchedUser.phoneNumber && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContact('phone', match.matchedUser.phoneNumber!)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p>From: {match.matchedRoute.origin.address}</p>
                  <p>To: {match.matchedRoute.destination.address}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <h4 className="font-medium mb-2">Environmental Benefits</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Carbon Offset</p>
                      <p className="font-medium">
                        {match.environmentalBenefits.carbonOffset.toFixed(2)} kg CO₂
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fuel Savings</p>
                      <p className="font-medium">
                        {match.environmentalBenefits.fuelSavings.toFixed(1)} L
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}