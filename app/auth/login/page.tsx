"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/providers/auth-provider';
import { ShoppingBag } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      await login(values.email, values.password);
      // Redirect is handled in the auth provider based on user role
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
      // Redirect is handled in the auth provider based on user role
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: 'Google login failed',
        description: 'An error occurred while trying to login with Google.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    
    try {
      await loginWithFacebook();
      // Redirect is handled in the auth provider based on user role
    } catch (error) {
      console.error('Facebook login error:', error);
      toast({
        title: 'Facebook login failed',
        description: 'An error occurred while trying to login with Facebook.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo account login functions
  const loginAsCustomer = () => {
    form.setValue('email', 'customer@example.com');
    form.setValue('password', 'password123');
  };

  const loginAsRestaurant = () => {
    form.setValue('email', 'restaurant@example.com');
    form.setValue('password', 'password123');
  };

  const loginAsDriver = () => {
    form.setValue('email', 'driver@example.com');
    form.setValue('password', 'password123');
  };

  const loginAsAdmin = () => {
    form.setValue('email', 'admin@example.com');
    form.setValue('password', 'password123');
  };

  return (
    <div className="flex min-h-screen bg-[#F7FDF9] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <ShoppingBag className="h-10 w-10 text-[#7ED957]" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#7ED957] hover:bg-[#6bc548]" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          
          <div className="flex items-center justify-between">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          
          <div className="space-y-2">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              Continue with Google
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
              Continue with Facebook
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm">
            <p className="text-gray-500">Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-[#7ED957] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col text-center border-t pt-6">
          <p className="text-sm text-gray-500 mb-2">Demo Accounts:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="ghost" size="sm" onClick={loginAsCustomer}>Customer</Button>
            <Button variant="ghost" size="sm" onClick={loginAsRestaurant}>Restaurant</Button>
            <Button variant="ghost" size="sm" onClick={loginAsDriver}>Driver</Button>
            <Button variant="ghost" size="sm" onClick={loginAsAdmin}>Admin</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}