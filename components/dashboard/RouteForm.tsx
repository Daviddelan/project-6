'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LocationInput } from './LocationInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { Location, Route, RoutePreferences } from '@/lib/types';

const formSchema = z.object({
  origin: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
    placeId: z.string().optional(),
  }),
  destination: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
    placeId: z.string().optional(),
  }),
  transportMode: z.enum(['driving', 'transit', 'walking', 'bicycling']),
  carpoolPreference: z.boolean(),
  maxDetour: z.number().min(0).max(60),
});

export function RouteForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transportMode: 'driving',
      carpoolPreference: true,
      maxDetour: 15,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth.currentUser) {
      toast.error('Please log in to create a route');
      return;
    }

    setLoading(true);
    try {
      const route: Partial<Route> = {
        userId: auth.currentUser.uid,
        origin: values.origin,
        destination: values.destination,
        departureTime: Date.now(),
        status: 'active',
        preferences: {
          maxDetour: values.maxDetour,
          transportMode: values.transportMode,
          carpoolPreference: values.carpoolPreference,
        },
        environmentalImpact: {
          carbonEmissions: 0,
          fuelSavings: 0,
          carbonOffset: 0,
          trafficReduction: 0,
        },
      };

      await addDoc(collection(db, 'routes'), route);
      toast.success('Route created successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to create route');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Route</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Point</FormLabel>
                  <FormControl>
                    <LocationInput
                      value={field.value?.address || ''}
                      onChangeLocationAction={field.onChange}
                      placeholder="Enter starting point"
                      onError={(error) => toast.error(error)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <LocationInput
                      value={field.value?.address || ''}
                      onChangeLocationAction={field.onChange}
                      placeholder="Enter destination"
                      onError={(error) => toast.error(error)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transportMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Mode</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="driving">Driving</SelectItem>
                      <SelectItem value="transit">Public Transit</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="bicycling">Bicycling</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carpoolPreference"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Carpool Preference</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Allow matching with other users
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Route'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}