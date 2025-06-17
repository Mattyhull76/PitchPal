'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'signin',
}: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const [resetEmail, setResetEmail] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(signInData.email, signInData.password);
      toast.success('Welcome back!');
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(
        signUpData.email,
        signUpData.password,
        signUpData.displayName
      );
      toast.success('Account created successfully!');
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create account';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome to PitchPal!');
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to sign in with Google';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(resetEmail);
      toast.success('Password reset email sent!');
      setShowResetPassword(false);
      setResetEmail('');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (showResetPassword) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Sparkles className='h-5 w-5 text-blue-600' />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className='space-y-4'>
            <div>
              <Label htmlFor='reset-email'>Email</Label>
              <Input
                id='reset-email'
                type='email'
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                placeholder='Enter your email'
                required
              />
            </div>

            <div className='flex gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowResetPassword(false)}
                className='flex-1'
              >
                Back
              </Button>
              <Button type='submit' disabled={loading} className='flex-1'>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-blue-600' />
            Welcome to PitchPal
          </DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to get started.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='signin'>Sign In</TabsTrigger>
            <TabsTrigger value='signup'>Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value='signin' className='space-y-4'>
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant='outline'
              className='w-full'
            >
              <Globe className='mr-2 h-4 w-4' />
              Continue with Google
            </Button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or
                </span>
              </div>
            </div>

            <form onSubmit={handleSignIn} className='space-y-4'>
              <div>
                <Label htmlFor='signin-email'>Email</Label>
                <Input
                  id='signin-email'
                  type='email'
                  value={signInData.email}
                  onChange={e =>
                    setSignInData({ ...signInData, email: e.target.value })
                  }
                  placeholder='Enter your email'
                  required
                />
              </div>

              <div>
                <Label htmlFor='signin-password'>Password</Label>
                <Input
                  id='signin-password'
                  type='password'
                  value={signInData.password}
                  onChange={e =>
                    setSignInData({ ...signInData, password: e.target.value })
                  }
                  placeholder='Enter your password'
                  required
                />
              </div>

              <Button type='submit' disabled={loading} className='w-full'>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Button
                type='button'
                variant='link'
                onClick={() => setShowResetPassword(true)}
                className='w-full text-sm'
              >
                Forgot your password?
              </Button>
            </form>
          </TabsContent>

          <TabsContent value='signup' className='space-y-4'>
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant='outline'
              className='w-full'
            >
              <Globe className='mr-2 h-4 w-4' />
              Continue with Google
            </Button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or
                </span>
              </div>
            </div>

            <form onSubmit={handleSignUp} className='space-y-4'>
              <div>
                <Label htmlFor='signup-name'>Full Name</Label>
                <Input
                  id='signup-name'
                  type='text'
                  value={signUpData.displayName}
                  onChange={e =>
                    setSignUpData({
                      ...signUpData,
                      displayName: e.target.value,
                    })
                  }
                  placeholder='Enter your full name'
                  required
                />
              </div>

              <div>
                <Label htmlFor='signup-email'>Email</Label>
                <Input
                  id='signup-email'
                  type='email'
                  value={signUpData.email}
                  onChange={e =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                  placeholder='Enter your email'
                  required
                />
              </div>

              <div>
                <Label htmlFor='signup-password'>Password</Label>
                <Input
                  id='signup-password'
                  type='password'
                  value={signUpData.password}
                  onChange={e =>
                    setSignUpData({ ...signUpData, password: e.target.value })
                  }
                  placeholder='Create a password'
                  required
                />
              </div>

              <div>
                <Label htmlFor='signup-confirm'>Confirm Password</Label>
                <Input
                  id='signup-confirm'
                  type='password'
                  value={signUpData.confirmPassword}
                  onChange={e =>
                    setSignUpData({
                      ...signUpData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder='Confirm your password'
                  required
                />
              </div>

              <Button type='submit' disabled={loading} className='w-full'>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
