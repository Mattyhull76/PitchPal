'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Target,
  Lightbulb,
  DollarSign,
  Users,
} from 'lucide-react';

const startupIdeaSchema = z.object({
  startupName: z.string().min(1, 'Startup name is required'),
  problemStatement: z
    .string()
    .min(10, 'Problem statement must be at least 10 characters'),
  targetAudience: z
    .string()
    .min(5, 'Target audience must be at least 5 characters'),
  solution: z.string().min(10, 'Solution must be at least 10 characters'),
  monetizationPlan: z
    .string()
    .min(10, 'Monetization plan must be at least 10 characters'),
  competitors: z
    .string()
    .min(5, 'Competitors field must be at least 5 characters'),
  marketSize: z.string().optional(),
  teamOverview: z.string().optional(),
  industry: z.enum([
    'B2B',
    'B2C',
    'SaaS',
    'E-commerce',
    'FinTech',
    'HealthTech',
    'EdTech',
    'Other',
  ]),
});

type StartupIdeaForm = z.infer<typeof startupIdeaSchema>;

interface PitchCreationWizardProps {
  onSubmit: (data: StartupIdeaForm) => void;
  isLoading?: boolean;
}

const steps = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Tell us about your startup',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'Problem & Solution',
    description: 'Define the problem and your solution',
    icon: Lightbulb,
  },
  {
    id: 3,
    title: 'Market & Competition',
    description: 'Analyze your market and competitors',
    icon: Target,
  },
  {
    id: 4,
    title: 'Business Model',
    description: 'How will you make money?',
    icon: DollarSign,
  },
  {
    id: 5,
    title: 'Team & Growth',
    description: 'Your team and growth strategy',
    icon: Users,
  },
];

export function PitchCreationWizard({
  onSubmit,
  isLoading = false,
}: PitchCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<StartupIdeaForm>({
    resolver: zodResolver(startupIdeaSchema),
    mode: 'onChange',
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof StartupIdeaForm)[] => {
    switch (step) {
      case 1:
        return ['startupName', 'industry'];
      case 2:
        return ['problemStatement', 'solution'];
      case 3:
        return ['targetAudience', 'competitors'];
      case 4:
        return ['monetizationPlan'];
      case 5:
        return ['teamOverview', 'marketSize'];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='startupName'>Startup Name *</Label>
              <Input
                id='startupName'
                placeholder='e.g., TechFlow, DataViz Pro, EcoSmart'
                {...register('startupName')}
                className={errors.startupName ? 'border-red-500' : ''}
              />
              {errors.startupName && (
                <p className='text-sm text-red-500'>
                  {errors.startupName.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='industry'>Industry *</Label>
              <Select
                onValueChange={value =>
                  setValue(
                    'industry',
                    value as
                      | 'B2B'
                      | 'B2C'
                      | 'SaaS'
                      | 'E-commerce'
                      | 'FinTech'
                      | 'HealthTech'
                      | 'EdTech'
                      | 'Other'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select your industry' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='B2B'>B2B</SelectItem>
                  <SelectItem value='B2C'>B2C</SelectItem>
                  <SelectItem value='SaaS'>SaaS</SelectItem>
                  <SelectItem value='E-commerce'>E-commerce</SelectItem>
                  <SelectItem value='FinTech'>FinTech</SelectItem>
                  <SelectItem value='HealthTech'>HealthTech</SelectItem>
                  <SelectItem value='EdTech'>EdTech</SelectItem>
                  <SelectItem value='Other'>Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className='text-sm text-red-500'>
                  {errors.industry.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='problemStatement'>Problem Statement *</Label>
              <Textarea
                id='problemStatement'
                placeholder='What problem does your startup solve? Be specific about the pain points your target audience faces.'
                rows={4}
                {...register('problemStatement')}
                className={errors.problemStatement ? 'border-red-500' : ''}
              />
              {errors.problemStatement && (
                <p className='text-sm text-red-500'>
                  {errors.problemStatement.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='solution'>Your Solution *</Label>
              <Textarea
                id='solution'
                placeholder='How does your product/service solve this problem? What makes it unique?'
                rows={4}
                {...register('solution')}
                className={errors.solution ? 'border-red-500' : ''}
              />
              {errors.solution && (
                <p className='text-sm text-red-500'>
                  {errors.solution.message}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='targetAudience'>Target Audience *</Label>
              <Textarea
                id='targetAudience'
                placeholder='Who are your ideal customers? Include demographics, behaviors, and characteristics.'
                rows={3}
                {...register('targetAudience')}
                className={errors.targetAudience ? 'border-red-500' : ''}
              />
              {errors.targetAudience && (
                <p className='text-sm text-red-500'>
                  {errors.targetAudience.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='competitors'>
                Competitors & Competitive Advantage *
              </Label>
              <Textarea
                id='competitors'
                placeholder='Who are your main competitors? What gives you a competitive advantage?'
                rows={3}
                {...register('competitors')}
                className={errors.competitors ? 'border-red-500' : ''}
              />
              {errors.competitors && (
                <p className='text-sm text-red-500'>
                  {errors.competitors.message}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='monetizationPlan'>Monetization Plan *</Label>
              <Textarea
                id='monetizationPlan'
                placeholder='How will you make money? Include pricing strategy, revenue streams, and business model.'
                rows={4}
                {...register('monetizationPlan')}
                className={errors.monetizationPlan ? 'border-red-500' : ''}
              />
              {errors.monetizationPlan && (
                <p className='text-sm text-red-500'>
                  {errors.monetizationPlan.message}
                </p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='teamOverview'>Team Overview</Label>
              <Textarea
                id='teamOverview'
                placeholder='Tell us about your team. Who are the key members and what are their roles?'
                rows={3}
                {...register('teamOverview')}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='marketSize'>Market Size & Opportunity</Label>
              <Textarea
                id='marketSize'
                placeholder="What's the size of your market? Include TAM, SAM, and SOM if available."
                rows={3}
                {...register('marketSize')}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      {/* Progress Header */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Create Your Pitch
          </h2>
          <span className='text-sm text-gray-500'>
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      {/* Step Indicator */}
      <div className='flex justify-between mb-8'>
        {steps.map(step => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                isActive
                  ? 'text-blue-600'
                  : isCompleted
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isActive
                    ? 'bg-blue-100 border-2 border-blue-600'
                    : isCompleted
                    ? 'bg-green-100 border-2 border-green-600'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                <Icon className='w-5 h-5' />
              </div>
              <span className='text-xs text-center hidden sm:block'>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            {React.createElement(steps[currentStep - 1].icon, {
              className: 'w-5 h-5',
            })}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className='flex justify-between'>
        <Button
          type='button'
          variant='outline'
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className='min-w-[120px]'
          >
            {isLoading ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className='w-4 h-4 mr-2' />
                Generate Pitch
              </>
            )}
          </Button>
        ) : (
          <Button type='button' onClick={nextStep}>
            Next
            <ArrowRight className='w-4 h-4 ml-2' />
          </Button>
        )}
      </div>
    </div>
  );
}
