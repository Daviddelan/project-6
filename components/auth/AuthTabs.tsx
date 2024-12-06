'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailAuthForm } from './EmailAuthForm';
import { PhoneAuthForm } from './PhoneAuthForm';

export function AuthTabs() {
  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="phone">Phone</TabsTrigger>
      </TabsList>
      <TabsContent value="email">
        <EmailAuthForm />
      </TabsContent>
      <TabsContent value="phone">
        <PhoneAuthForm />
      </TabsContent>
    </Tabs>
  );
}