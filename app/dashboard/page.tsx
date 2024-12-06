'use client';

import { RouteMap } from '@/components/dashboard/RouteMap';
import { RouteForm } from '@/components/dashboard/RouteForm';
import { MatchList } from '@/components/dashboard/MatchList';
import { EnvironmentalImpact } from '@/components/dashboard/EnvironmentalImpact';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { Route } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  useEffect(() => {
    async function fetchCurrentRoute() {
      if (!user) return;

      const routeRef = doc(db, 'routes', user.uid);
      const routeSnap = await getDoc(routeRef);

      if (routeSnap.exists()) {
        setCurrentRoute({ id: routeSnap.id, ...routeSnap.data() } as Route);
      }
    }

    fetchCurrentRoute();
  }, [user]);

  const defaultImpact = {
    carbonEmissions: 0,
    fuelSavings: 0,
    carbonOffset: 0,
    trafficReduction: 0,
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RouteMap />
          <EnvironmentalImpact 
            impact={currentRoute?.environmentalImpact || defaultImpact}
            onChangeAction={async (impact) => {
              if (currentRoute && user) {
                const routeRef = doc(db, 'routes', currentRoute.id);
                await updateDoc(routeRef, { environmentalImpact: impact });
              }
            }}
          />
        </div>
        <div className="space-y-8">
          <RouteForm />
          <MatchList />
          <UserProfile />
        </div>
      </div>
    </main>
  );
}