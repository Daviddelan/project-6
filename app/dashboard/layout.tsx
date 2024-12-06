'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/providers/auth-provider';
import { setupInactivityCheck } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const cleanup = setupInactivityCheck(async () => {
      await signOut(auth);
      router.push('/');
    });

    return cleanup;
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      {children}
    </div>
  );
}