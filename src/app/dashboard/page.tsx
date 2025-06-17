'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
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
  Plus,
  FileText,
  Share2,
  Download,
  Eye,
  MoreHorizontal,
  TrendingUp,
} from 'lucide-react';
import { PitchCardSkeleton } from '@/components/ui/spinner';
import { toast } from 'sonner';

// Mock data for demonstration
const mockPitches = [
  {
    id: '1',
    title: 'EcoTech Solutions Pitch Deck',
    industry: 'CleanTech',
    status: 'completed',
    createdAt: new Date('2025-01-15'),
    views: 24,
    slides: 10,
  },
  {
    id: '2',
    title: 'HealthAI Platform Pitch',
    industry: 'HealthTech',
    status: 'draft',
    createdAt: new Date('2025-01-10'),
    views: 8,
    slides: 8,
  },
];

export default function Dashboard() {
  const { user, appUser, logout } = useAuth();
  const [pitches, setPitches] = useState(mockPitches);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPitches = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/pitches?userId=${user.uid}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setPitches(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching pitches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'shared':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <nav className='flex items-center space-x-4'>
              <span className='text-sm text-slate-600'>
                Welcome, {appUser?.displayName || user?.email}
              </span>
              <Button variant='outline' size='sm'>
                Profile
              </Button>
              <Button variant='outline' size='sm' onClick={logout}>
                Sign Out
              </Button>
            </nav>
          </div>
        </header>

        <div className='container mx-auto px-4 py-8'>
          {/* Welcome Section */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>
              Welcome back!
            </h1>
            <p className='text-slate-600'>
              Manage your pitch decks and track their performance
            </p>
          </div>

          {/* Stats Cards */}
          <div className='grid md:grid-cols-4 gap-6 mb-8'>
            <Card className='animate-fade-in'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
                  <FileText className='h-4 w-4 mr-2' />
                  Total Pitches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className='skeleton h-8 w-16' />
                ) : (
                  <div className='text-2xl font-bold text-slate-900'>
                    {pitches.length}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card
              className='animate-fade-in'
              style={{ animationDelay: '0.1s' }}
            >
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
                  <Eye className='h-4 w-4 mr-2' />
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className='skeleton h-8 w-16' />
                ) : (
                  <div className='text-2xl font-bold text-slate-900'>
                    {pitches.reduce((sum, pitch) => sum + pitch.views, 0)}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card
              className='animate-fade-in'
              style={{ animationDelay: '0.2s' }}
            >
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
                  <TrendingUp className='h-4 w-4 mr-2' />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className='skeleton h-8 w-16' />
                ) : (
                  <div className='text-2xl font-bold text-slate-900'>
                    {pitches.filter(p => p.status === 'completed').length}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card
              className='animate-fade-in'
              style={{ animationDelay: '0.3s' }}
            >
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-slate-600 flex items-center'>
                  <Share2 className='h-4 w-4 mr-2' />
                  Shared
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className='skeleton h-8 w-16' />
                ) : (
                  <div className='text-2xl font-bold text-slate-900'>
                    {pitches.filter(p => p.status === 'shared').length}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-4 mb-8'>
            <Link href='/create'>
              <Button size='lg' className='flex items-center'>
                <Plus className='mr-2 h-5 w-5' />
                Create New Pitch
              </Button>
            </Link>
            <Button variant='outline' size='lg' className='flex items-center'>
              <FileText className='mr-2 h-5 w-5' />
              Import Existing Deck
            </Button>
          </div>

          {/* Pitches List */}
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-slate-900'>
              Your Pitch Decks
            </h2>

            {loading ? (
              <div className='grid gap-4'>
                {[...Array(3)].map((_, i) => (
                  <PitchCardSkeleton key={i} />
                ))}
              </div>
            ) : pitches.length === 0 ? (
              <Card className='text-center py-12 animate-fade-in'>
                <CardContent>
                  <FileText className='h-12 w-12 text-slate-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-slate-900 mb-2'>
                    No pitch decks yet
                  </h3>
                  <p className='text-slate-600 mb-4'>
                    Create your first pitch deck to get started
                  </p>
                  <Link href='/create'>
                    <Button className='animate-pulse-glow'>
                      <Plus className='mr-2 h-4 w-4' />
                      Create Your First Pitch
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className='grid gap-4'>
                {pitches.map((pitch, index) => (
                  <Card
                    key={pitch.id}
                    className='hover:shadow-lg transition-all duration-200 animate-slide-in-up'
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className='flex items-start justify-between'>
                        <div>
                          <CardTitle className='text-lg hover:text-blue-600 transition-colors'>
                            <Link href={`/pitch/view/${pitch.id}`}>
                              {pitch.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className='flex items-center gap-2 mt-1'>
                            <Badge variant='secondary'>{pitch.industry}</Badge>
                            <Badge className={getStatusColor(pitch.status)}>
                              {pitch.status}
                            </Badge>
                          </CardDescription>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              toast.success('Opening pitch viewer...')
                            }
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              toast.success('Share link copied to clipboard!')
                            }
                          >
                            <Share2 className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => toast.success('Downloading PDF...')}
                          >
                            <Download className='h-4 w-4' />
                          </Button>
                          <Button variant='ghost' size='sm'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className='flex items-center justify-between text-sm text-slate-600'>
                        <div className='flex items-center space-x-4'>
                          <span className='flex items-center'>
                            <FileText className='h-3 w-3 mr-1' />
                            {pitch.slides} slides
                          </span>
                          <span className='flex items-center'>
                            <Eye className='h-3 w-3 mr-1' />
                            {pitch.views} views
                          </span>
                        </div>
                        <span>
                          Created {pitch.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
