import { AuthTabs } from '@/components/auth/AuthTabs';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-12">
          <Hero />
          <Features />
          <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <AuthTabs />
          </div>
        </div>
      </div>
    </main>
  );
}