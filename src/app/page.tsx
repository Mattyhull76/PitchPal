'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  Zap,
  FileText,
  Share2,
  Target,
  Sparkles,
  CheckCircle,
  Play,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

export default function Home() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>(
    'signin'
  );
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Header */}
      <header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Sparkles className='h-8 w-8 text-blue-600' />
            <span className='text-2xl font-bold text-slate-900'>PitchPal</span>
          </div>
          <nav className='hidden md:flex items-center space-x-6'>
            <Link
              href='#features'
              className='text-slate-600 hover:text-slate-900'
            >
              Features
            </Link>
            <Link
              href='#pricing'
              className='text-slate-600 hover:text-slate-900'
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link href='/dashboard'>
                  <Button variant='outline' size='sm'>
                    Dashboard
                  </Button>
                </Link>
                <Button variant='outline' size='sm' onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setAuthModalTab('signin');
                    setShowAuthModal(true);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  size='sm'
                  onClick={() => {
                    setAuthModalTab('signup');
                    setShowAuthModal(true);
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className='py-20 px-4 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50' />
        <div className='container mx-auto text-center max-w-4xl relative z-10'>
          <div className='animate-slide-in-up'>
            <h1 className='text-5xl md:text-6xl font-bold text-slate-900 mb-6'>
              From napkin sketch to{' '}
              <span className='text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                investor-ready pitch
              </span>{' '}
              in minutes
            </h1>
            <p className='text-xl text-slate-600 mb-8 max-w-2xl mx-auto'>
              PitchPal uses AI to transform your startup idea into a compelling
              pitch deck, executive summary, and investor materials that get
              results.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              {user ? (
                <Link href='/create'>
                  <Button
                    size='lg'
                    className='text-lg px-8 py-6 animate-pulse-glow'
                  >
                    Create Your Pitch <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
              ) : (
                <Button
                  size='lg'
                  className='text-lg px-8 py-6 animate-pulse-glow'
                  onClick={() => {
                    setAuthModalTab('signup');
                    setShowAuthModal(true);
                  }}
                >
                  Get Started Free <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              )}
              <Button variant='outline' size='lg' className='text-lg px-8 py-6'>
                <Play className='mr-2 h-5 w-5' />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div
            className='mt-16 animate-fade-in'
            style={{ animationDelay: '0.5s' }}
          >
            <div className='bg-white rounded-lg shadow-2xl p-8 max-w-3xl mx-auto'>
              <div className='aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center'>
                <div className='text-center'>
                  <Sparkles className='h-16 w-16 text-blue-600 mx-auto mb-4' />
                  <p className='text-slate-600'>Interactive Demo Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 px-4 bg-white'>
        <div className='container mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-slate-900 mb-4'>
              Everything you need to pitch with confidence
            </h2>
            <p className='text-xl text-slate-600 max-w-2xl mx-auto'>
              Our AI-powered platform creates professional pitch materials
              tailored to your audience
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <Card className='border-2 hover:border-blue-200 transition-colors'>
              <CardHeader>
                <Zap className='h-12 w-12 text-blue-600 mb-4' />
                <CardTitle>AI Pitch Generator</CardTitle>
                <CardDescription>
                  Transform your idea into a complete pitch deck with
                  AI-generated content tailored to your industry and audience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-2 hover:border-blue-200 transition-colors'>
              <CardHeader>
                <FileText className='h-12 w-12 text-blue-600 mb-4' />
                <CardTitle>Executive Summaries</CardTitle>
                <CardDescription>
                  Generate professional one-page summaries perfect for
                  investors, incubators, and grant applications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-2 hover:border-blue-200 transition-colors'>
              <CardHeader>
                <Share2 className='h-12 w-12 text-blue-600 mb-4' />
                <CardTitle>Smart Sharing</CardTitle>
                <CardDescription>
                  Share your pitch with trackable links, analytics, and
                  investor-friendly viewing modes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-2 hover:border-blue-200 transition-colors'>
              <CardHeader>
                <Target className='h-12 w-12 text-blue-600 mb-4' />
                <CardTitle>Investor Targeting</CardTitle>
                <CardDescription>
                  Customize your pitch for different investor types and regions
                  with AI-powered personalization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-2 hover:border-blue-200 transition-colors'>
              <CardHeader>
                <CheckCircle className='h-12 w-12 text-blue-600 mb-4' />
                <CardTitle>Export Options</CardTitle>
                <CardDescription>
                  Download your pitch as PDF, PPTX, or share interactive web
                  versions with professional branding
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-2 hover:border-blue-200 transition-colors'>
              <CardHeader>
                <Sparkles className='h-12 w-12 text-blue-600 mb-4' />
                <CardTitle>Smart Templates</CardTitle>
                <CardDescription>
                  Industry-specific templates that adapt to B2B, B2C, SaaS, and
                  other business models automatically
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 bg-blue-600'>
        <div className='container mx-auto text-center'>
          <h2 className='text-4xl font-bold text-white mb-6'>
            Ready to create your winning pitch?
          </h2>
          <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
            Join thousands of entrepreneurs who have successfully raised funding
            with PitchPal
          </p>
          {user ? (
            <Link href='/create'>
              <Button
                size='lg'
                variant='secondary'
                className='text-lg px-8 py-6'
              >
                Start Building Your Pitch{' '}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          ) : (
            <Button
              size='lg'
              variant='secondary'
              className='text-lg px-8 py-6'
              onClick={() => {
                setAuthModalTab('signup');
                setShowAuthModal(true);
              }}
            >
              Start Building Your Pitch <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-slate-900 text-white py-12 px-4'>
        <div className='container mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <Sparkles className='h-6 w-6 text-blue-400' />
              <span className='text-xl font-bold'>PitchPal</span>
            </div>
            <div className='flex space-x-6'>
              <Link href='/privacy' className='text-slate-400 hover:text-white'>
                Privacy
              </Link>
              <Link href='/terms' className='text-slate-400 hover:text-white'>
                Terms
              </Link>
              <Link href='/contact' className='text-slate-400 hover:text-white'>
                Contact
              </Link>
            </div>
          </div>
          <div className='border-t border-slate-800 mt-8 pt-8 text-center text-slate-400'>
            <p>&copy; 2025 PitchPal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
}
