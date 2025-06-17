'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PitchViewer } from '@/components/pitch/PitchViewer';
import { PresentationMode } from '@/components/pitch/PresentationMode';
import { Loading } from '@/components/ui/spinner';
import { exportExecutiveSummaryToPDF, copyToClipboard } from '@/lib/export';
import { toast } from 'sonner';
import { PitchDeck, StartupIdea } from '@/types/pitch';

interface PitchData {
  pitchDeck: PitchDeck;
  idea: StartupIdea;
  executiveSummary: string;
}

export default function PitchViewPage() {
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const router = useRouter();

  const handleExportSummaryPDF = async () => {
    if (pitchData?.executiveSummary && pitchData?.idea?.startupName) {
      try {
        await exportExecutiveSummaryToPDF(
          pitchData.executiveSummary,
          pitchData.idea.startupName
        );
        toast.success('Executive summary exported as PDF!');
      } catch (error) {
        toast.error('Failed to export PDF');
      }
    }
  };

  const handleCopyToClipboard = async () => {
    if (pitchData?.executiveSummary) {
      const content = pitchData.executiveSummary;
      const success = await copyToClipboard(content);
      if (success) {
        toast.success('Executive summary copied to clipboard!');
      } else {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  const handleStartPresentation = () => {
    setIsPresentationMode(true);
  };

  const handleClosePresentation = () => {
    setIsPresentationMode(false);
  };

  useEffect(() => {
    // Get pitch data from localStorage (in a real app, this would come from a database)
    const storedPitch = localStorage.getItem('currentPitch');
    if (storedPitch) {
      try {
        const data = JSON.parse(storedPitch);
        setPitchData(data);
      } catch (error) {
        console.error('Error parsing pitch data:', error);
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center'>
        <Loading text='Loading your pitch deck...' size='lg' />
      </div>
    );
  }

  if (!pitchData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-slate-900 mb-4'>
            Pitch not found
          </h1>
          <p className='text-slate-600 mb-6'>
            The pitch you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href='/dashboard'>
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <Link
              href='/dashboard'
              className='flex items-center text-slate-600 hover:text-slate-900'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Dashboard
            </Link>
          </div>
          <nav className='flex items-center space-x-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleStartPresentation}
              className='animate-pulse-glow'
            >
              <Presentation className='h-4 w-4 mr-2' />
              Present
            </Button>
            <Button variant='outline' size='sm'>
              Save Changes
            </Button>
            <Button size='sm'>Share Pitch</Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className='py-8'>
        <PitchViewer pitchDeck={pitchData.pitchDeck} isEditable={true} />
      </main>

      {/* Executive Summary Section */}
      {pitchData.executiveSummary && (
        <section className='py-8 border-t bg-white'>
          <div className='max-w-4xl mx-auto px-4'>
            <h2 className='text-2xl font-bold text-slate-900 mb-6'>
              Executive Summary
            </h2>
            <div className='prose max-w-none'>
              <div className='bg-slate-50 rounded-lg p-6'>
                <div className='whitespace-pre-wrap text-slate-700 leading-relaxed'>
                  {pitchData.executiveSummary}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-4 mt-6'>
              <Button variant='outline' onClick={handleExportSummaryPDF}>
                Download as PDF
              </Button>
              <Button
                variant='outline'
                onClick={() => toast.info('DOCX export coming soon!')}
              >
                Download as DOCX
              </Button>
              <Button variant='outline' onClick={handleCopyToClipboard}>
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className='bg-slate-900 text-white py-8'>
        <div className='container mx-auto px-4 text-center'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <Sparkles className='h-6 w-6 text-blue-400' />
            <span className='text-xl font-bold'>PitchPal</span>
          </div>
          <p className='text-slate-400'>Your AI-powered pitch deck generator</p>
        </div>
      </footer>

      {/* Presentation Mode */}
      {pitchData?.pitchDeck && (
        <PresentationMode
          pitchDeck={pitchData.pitchDeck}
          isOpen={isPresentationMode}
          onClose={handleClosePresentation}
        />
      )}
    </div>
  );
}
