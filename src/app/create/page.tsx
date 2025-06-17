'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { PitchCreationWizard } from '@/components/pitch/PitchCreationWizard';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface StartupIdeaForm {
  startupName: string;
  problemStatement: string;
  targetAudience: string;
  solution: string;
  monetizationPlan: string;
  competitors: string;
  marketSize?: string;
  teamOverview?: string;
  industry:
    | 'B2B'
    | 'B2C'
    | 'SaaS'
    | 'E-commerce'
    | 'FinTech'
    | 'HealthTech'
    | 'EdTech'
    | 'Other';
}

export default function CreatePitch() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: StartupIdeaForm) => {
    if (!user) {
      toast.error('Please sign in to create a pitch');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startupIdea: {
            ...formData,
            userId: user.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate pitch');
      }

      const result = await response.json();

      if (result.success) {
        // Store the generated pitch data in localStorage for now
        localStorage.setItem('currentPitch', JSON.stringify(result.data));
        toast.success('Pitch generated successfully!');
        router.push('/pitch/view');
      } else {
        throw new Error(result.error || 'Failed to generate pitch');
      }
    } catch (error) {
      console.error('Error generating pitch:', error);
      toast.error('Failed to generate pitch. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
        {/* Header */}
        <header className='border-b bg-white/80 backdrop-blur-sm'>
          <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
            <Link href='/' className='flex items-center space-x-2'>
              <Sparkles className='h-8 w-8 text-blue-600' />
              <span className='text-2xl font-bold text-slate-900'>
                PitchPal
              </span>
            </Link>
            <Button variant='outline' size='sm' asChild>
              <Link href='/dashboard'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </header>

        <div className='container mx-auto px-4 py-12'>
          <PitchCreationWizard onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
