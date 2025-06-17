'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PitchDeck } from '@/types/pitch';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Edit,
  Presentation,
} from 'lucide-react';
import { exportToPDF, generateShareableLink } from '@/lib/export';
import { toast } from 'sonner';

interface PitchViewerProps {
  pitchDeck: PitchDeck;
  isEditable?: boolean;
}

export function PitchViewer({
  pitchDeck,
  isEditable = false,
}: PitchViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = pitchDeck.slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / pitchDeck.slides.length) * 100;

  const nextSlide = () => {
    if (currentSlideIndex < pitchDeck.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const getSlideTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      title: 'Title',
      problem: 'Problem',
      solution: 'Solution',
      market: 'Market',
      'business-model': 'Business Model',
      'go-to-market': 'Go-to-Market',
      'competitive-advantage': 'Competitive Advantage',
      team: 'Team',
      financials: 'Financials',
      ask: 'The Ask',
    };
    return labels[type] || type;
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(pitchDeck);
      toast.success('PDF exported successfully!');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  const handleShare = async () => {
    if (pitchDeck.id) {
      const shareLink = generateShareableLink(pitchDeck.id);
      try {
        await navigator.clipboard.writeText(shareLink);
        toast.success('Share link copied to clipboard!');
      } catch {
        toast.error('Failed to copy share link');
      }
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-4'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>
            {pitchDeck.title}
          </h1>
          <div className='flex items-center gap-2 mt-2'>
            <Badge variant='secondary'>{pitchDeck.slides.length} slides</Badge>
            <Badge
              className={
                pitchDeck.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : pitchDeck.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }
            >
              {pitchDeck.status}
            </Badge>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {isEditable && (
            <Button variant='outline' size='sm'>
              <Edit className='h-4 w-4 mr-2' />
              Edit
            </Button>
          )}
          <Button variant='outline' size='sm' onClick={handleShare}>
            <Share2 className='h-4 w-4 mr-2' />
            Share
          </Button>
          <Button variant='outline' size='sm' onClick={handleExportPDF}>
            <Download className='h-4 w-4 mr-2' />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className='mb-6'>
        <div className='flex justify-between text-sm text-slate-600 mb-2'>
          <span>
            Slide {currentSlideIndex + 1} of {pitchDeck.slides.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      <div className='grid lg:grid-cols-4 gap-6'>
        {/* Slide Navigation */}
        <div className='lg:col-span-1'>
          <h3 className='font-semibold text-slate-900 mb-3'>Slides</h3>
          <div className='space-y-2'>
            {pitchDeck.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  index === currentSlideIndex
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className='text-sm font-medium'>
                  {index + 1}. {getSlideTypeLabel(slide.type)}
                </div>
                <div className='text-xs text-slate-500 mt-1 truncate'>
                  {slide.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Slide View */}
        <div className='lg:col-span-3'>
          <Card className='min-h-[500px]'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-xl'>
                    {currentSlide.title}
                  </CardTitle>
                  <Badge variant='outline' className='mt-2'>
                    {getSlideTypeLabel(currentSlide.type)}
                  </Badge>
                </div>
                <div className='text-sm text-slate-500'>
                  {currentSlideIndex + 1} / {pitchDeck.slides.length}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='prose max-w-none'>
                <div className='whitespace-pre-wrap text-slate-700 leading-relaxed'>
                  {currentSlide.content}
                </div>
              </div>

              {currentSlide.notes && (
                <div className='mt-6 p-4 bg-slate-50 rounded-lg'>
                  <h4 className='font-medium text-slate-900 mb-2'>
                    Speaker Notes
                  </h4>
                  <p className='text-sm text-slate-600'>{currentSlide.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className='flex items-center justify-between mt-6'>
            <Button
              variant='outline'
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className='flex items-center'
            >
              <ChevronLeft className='h-4 w-4 mr-2' />
              Previous
            </Button>

            <div className='flex items-center gap-2'>
              {pitchDeck.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlideIndex
                      ? 'bg-blue-600'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant='outline'
              onClick={nextSlide}
              disabled={currentSlideIndex === pitchDeck.slides.length - 1}
              className='flex items-center'
            >
              Next
              <ChevronRight className='h-4 w-4 ml-2' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
