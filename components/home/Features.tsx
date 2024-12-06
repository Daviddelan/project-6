import { MapPin, Users } from 'lucide-react';

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
      <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <MapPin className="w-12 h-12 text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Smart Route Matching</h2>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Find the perfect match for your journey with our intelligent route matching system
        </p>
      </div>
      <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <Users className="w-12 h-12 text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Connect with Others</h2>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Join a community of travelers and make your journey more sustainable
        </p>
      </div>
    </div>
  );
}