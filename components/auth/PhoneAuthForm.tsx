'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const phoneFormSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  verificationCode: z.string().optional(),
});

export function PhoneAuthForm() {
  const [verificationId, setVerificationId] = useState<string>('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [showVerification, setShowVerification] = useState(false);

  const form = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phoneNumber: '',
      verificationCode: '',
    },
  });

  async function onSubmit(values: z.infer<typeof phoneFormSchema>) {
    try {
      if (!showVerification) {
        // Initialize reCAPTCHA verifier
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });

        // Send verification code
        const result = await signInWithPhoneNumber(
          auth,
          values.phoneNumber,
          recaptchaVerifier
        );
        setConfirmationResult(result);
        setVerificationId(result.verificationId);
        setShowVerification(true);
        toast.success('Verification code sent!');
      } else if (values.verificationCode) {
        // Verify code
        const credential = await confirmationResult.confirm(values.verificationCode);
        toast.success('Phone number verified successfully!');
      }
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="+1234567890"
                  {...field}
                  disabled={showVerification}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showVerification && (
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div id="recaptcha-container" />

        <Button type="submit" className="w-full">
          {showVerification ? 'Verify Code' : 'Send Code'}
        </Button>
      </form>
    </Form>
  );
}