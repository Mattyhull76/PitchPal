'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PitchDeck } from '@/types/pitch';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PresentationModeProps {
  pitchDeck: PitchDeck;
  isOpen: boolean;
  onClose: () => void;
  startSlide?: number;
}

export function PresentationMode({
  pitchDeck,
  isOpen,
  onClose,
  startSlide = 0,
}: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(startSlide);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setCurrentSlide(0);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentSlide, nextSlide, prevSlide, onClose]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay && isOpen) {
      interval = setInterval(() => {
        setCurrentSlide(prev =>
          prev < pitchDeck.slides.length - 1 ? prev + 1 : 0
        );
      }, 5000); // 5 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, isOpen, pitchDeck.slides.length]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isOpen, currentSlide, nextSlide, prevSlide, onClose]);

  const nextSlide = () => {
    if (currentSlide < pitchDeck.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetPresentation = () => {
    setCurrentSlide(0);
    setIsAutoPlay(false);
  };

  if (!isOpen) return null;

  const slide = pitchDeck.slides[currentSlide];

  return (
    <div
      className='presentation-mode'
      onMouseMove={() => setShowControls(true)}
    >
      {/* Slide Content */}
      <div className='presentation-slide'>
        <div className='max-w-6xl mx-auto'>
          <div className='bg-white rounded-lg shadow-2xl p-12 min-h-[600px] flex flex-col justify-center'>
            <div className='text-center space-y-8'>
              <h1 className='text-5xl font-bold text-gray-900 mb-6'>
                {slide.title}
              </h1>
              <div className='text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto'>
                {slide.content.split('\n').map((paragraph, index) => (
                  <p key={index} className='mb-4'>
                    {paragraph}
                  </p>
                ))}
              </div>
              {slide.notes && (
                <div className='mt-8 p-4 bg-blue-50 rounded-lg'>
                  <p className='text-sm text-blue-800 italic'>
                    Speaker Notes: {slide.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Overlay */}
      <div
        className={cn(
          'fixed inset-0 pointer-events-none transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Top Bar */}
        <div className='absolute top-0 left-0 right-0 p-6 pointer-events-auto'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-4'>
              <h2 className='text-white text-lg font-semibold'>
                {pitchDeck.title}
              </h2>
              <span className='text-white/80 text-sm'>
                Slide {currentSlide + 1} of {pitchDeck.slides.length}
              </span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={onClose}
              className='text-white hover:bg-white/20'
            >
              <X className='h-5 w-5' />
            </Button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className='absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto'>
          <Button
            variant='ghost'
            size='lg'
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className='text-white hover:bg-white/20 disabled:opacity-30'
          >
            <ChevronLeft className='h-8 w-8' />
          </Button>
        </div>

        <div className='absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto'>
          <Button
            variant='ghost'
            size='lg'
            onClick={nextSlide}
            disabled={currentSlide === pitchDeck.slides.length - 1}
            className='text-white hover:bg-white/20 disabled:opacity-30'
          >
            <ChevronRight className='h-8 w-8' />
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className='absolute bottom-0 left-0 right-0 p-6 pointer-events-auto'>
          <div className='flex justify-center items-center space-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={resetPresentation}
              className='text-white hover:bg-white/20'
            >
              <RotateCcw className='h-4 w-4 mr-2' />
              Reset
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={toggleAutoPlay}
              className='text-white hover:bg-white/20'
            >
              {isAutoPlay ? (
                <>
                  <Pause className='h-4 w-4 mr-2' />
                  Pause
                </>
              ) : (
                <>
                  <Play className='h-4 w-4 mr-2' />
                  Auto Play
                </>
              )}
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={toggleFullscreen}
              className='text-white hover:bg-white/20'
            >
              {isFullscreen ? (
                <>
                  <Minimize className='h-4 w-4 mr-2' />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize className='h-4 w-4 mr-2' />
                  Fullscreen
                </>
              )}
            </Button>
          </div>

          {/* Progress Bar */}
          <div className='mt-4 w-full bg-white/20 rounded-full h-1'>
            <div
              className='bg-white rounded-full h-1 transition-all duration-300'
              style={{
                width: `${
                  ((currentSlide + 1) / pitchDeck.slides.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Slide Thumbnails */}
        <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-auto'>
          <div className='flex space-x-2'>
            {pitchDeck.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-200',
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className='absolute bottom-6 left-6 text-white/60 text-xs pointer-events-none'>
        <div>← → Navigate • Space Next • Esc Exit • F Fullscreen • R Reset</div>
      </div>
    </div>
  );
}
