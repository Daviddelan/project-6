'use client';

import { useAuth } from '@/providers/auth-provider';
import { getGreeting } from '@/lib/session';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { UserCircle } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">RideMatch</h1>
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserCircle className="h-6 w-6" />
                <span className="text-sm font-medium">{getGreeting(user)}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}