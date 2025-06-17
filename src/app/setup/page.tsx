'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';

interface SetupCheck {
  status: 'success' | 'warning' | 'error' | 'unknown';
  message: string;
  details: Record<string, unknown>;
}

interface SetupStatus {
  status: string;
  message: string;
  timestamp: string;
  checks: {
    environment: SetupCheck;
    firebase: SetupCheck;
    openai: SetupCheck;
  };
  recommendations: {
    firebase: string[];
    openai: string[];
  };
}

export default function SetupPage() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSetup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/setup-check');
      const data = await response.json();
      setSetupStatus(data);
    } catch (error) {
      console.error('Error checking setup:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSetup();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className='h-5 w-5 text-green-600' />;
      case 'warning':
        return <AlertTriangle className='h-5 w-5 text-yellow-600' />;
      case 'error':
        return <XCircle className='h-5 w-5 text-red-600' />;
      default:
        return <RefreshCw className='h-5 w-5 text-gray-400' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Header */}
      <header className='border-b bg-white/80 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Link href='/' className='flex items-center space-x-2'>
              <Sparkles className='h-8 w-8 text-blue-600' />
              <span className='text-2xl font-bold text-slate-900'>
                PitchPal
              </span>
            </Link>
            <div className='h-6 w-px bg-slate-300' />
            <span className='text-slate-600'>Setup & Configuration</span>
          </div>
          <Link href='/'>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        {/* Title */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>
            Setup & Configuration
          </h1>
          <p className='text-slate-600'>
            Verify your PitchPal configuration and get setup recommendations
          </p>
        </div>

        {/* Overall Status */}
        {setupStatus && (
          <Card className='mb-8'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  {getStatusIcon(setupStatus.status)}
                  <div>
                    <CardTitle>Overall Status</CardTitle>
                    <CardDescription>{setupStatus.message}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(setupStatus.status)}>
                  {setupStatus.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Detailed Checks */}
        {loading ? (
          <Card>
            <CardContent className='flex items-center justify-center py-12'>
              <RefreshCw className='h-8 w-8 animate-spin text-blue-600 mr-3' />
              <span className='text-slate-600'>Checking configuration...</span>
            </CardContent>
          </Card>
        ) : setupStatus ? (
          <div className='space-y-6'>
            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    {getStatusIcon(setupStatus.checks.environment.status)}
                    <div>
                      <CardTitle>Environment Variables</CardTitle>
                      <CardDescription>
                        {setupStatus.checks.environment.message}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    className={getStatusColor(
                      setupStatus.checks.environment.status
                    )}
                  >
                    {setupStatus.checks.environment.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              {setupStatus.checks.environment.details.missingVars && (
                <CardContent>
                  <div className='text-sm text-slate-600'>
                    <p className='font-medium mb-2'>Missing variables:</p>
                    <ul className='list-disc list-inside space-y-1'>
                      {setupStatus.checks.environment.details.missingVars.map(
                        (varName: string) => (
                          <li key={varName} className='font-mono text-red-600'>
                            {varName}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Firebase */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    {getStatusIcon(setupStatus.checks.firebase.status)}
                    <div>
                      <CardTitle>Firebase Configuration</CardTitle>
                      <CardDescription>
                        {setupStatus.checks.firebase.message}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    className={getStatusColor(
                      setupStatus.checks.firebase.status
                    )}
                  >
                    {setupStatus.checks.firebase.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              {setupStatus.checks.firebase.details.projectId && (
                <CardContent>
                  <div className='text-sm text-slate-600'>
                    <p>
                      <span className='font-medium'>Project ID:</span>{' '}
                      {setupStatus.checks.firebase.details.projectId}
                    </p>
                    <p>
                      <span className='font-medium'>Auth Domain:</span>{' '}
                      {setupStatus.checks.firebase.details.authDomain}
                    </p>
                  </div>
                </CardContent>
              )}
              {setupStatus.recommendations.firebase.length > 0 && (
                <CardContent>
                  <div className='text-sm text-slate-600'>
                    <p className='font-medium mb-2'>Setup Steps:</p>
                    <ol className='list-decimal list-inside space-y-1'>
                      {setupStatus.recommendations.firebase.map(
                        (step, index) => (
                          <li key={index}>{step}</li>
                        )
                      )}
                    </ol>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* OpenAI */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    {getStatusIcon(setupStatus.checks.openai.status)}
                    <div>
                      <CardTitle>OpenAI Configuration</CardTitle>
                      <CardDescription>
                        {setupStatus.checks.openai.message}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    className={getStatusColor(setupStatus.checks.openai.status)}
                  >
                    {setupStatus.checks.openai.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-slate-600'>
                  {setupStatus.checks.openai.details.demoMode ? (
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                      <p className='font-medium text-yellow-800 mb-1'>
                        Demo Mode Active
                      </p>
                      <p className='text-yellow-700'>
                        PitchPal will use sample content for testing. Configure
                        OpenAI API key for AI-generated content.
                      </p>
                    </div>
                  ) : (
                    <p>
                      <span className='font-medium'>API Key:</span>{' '}
                      {setupStatus.checks.openai.details.keyPrefix}
                    </p>
                  )}
                </div>
              </CardContent>
              {setupStatus.recommendations.openai.length > 0 && (
                <CardContent>
                  <div className='text-sm text-slate-600'>
                    <p className='font-medium mb-2'>Setup Steps:</p>
                    <ol className='list-decimal list-inside space-y-1'>
                      {setupStatus.recommendations.openai.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className='text-center py-12'>
              <XCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-slate-900 mb-2'>
                Setup Check Failed
              </h3>
              <p className='text-slate-600 mb-4'>
                Unable to verify configuration
              </p>
              <Button onClick={checkSetup}>
                <RefreshCw className='h-4 w-4 mr-2' />
                Retry Check
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className='flex justify-center space-x-4 mt-8'>
          <Button onClick={checkSetup} variant='outline'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh Status
          </Button>
          {setupStatus?.status === 'success' && (
            <Link href='/dashboard'>
              <Button>
                Go to Dashboard
                <ArrowLeft className='h-4 w-4 ml-2 rotate-180' />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
