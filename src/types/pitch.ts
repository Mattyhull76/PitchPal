export interface StartupIdea {
  id?: string;
  userId: string;
  startupName: string;
  problemStatement: string;
  targetAudience: string;
  solution: string;
  monetizationPlan: string;
  competitors: string;
  marketSize?: string;
  teamOverview?: string;
  industry: 'B2B' | 'B2C' | 'SaaS' | 'E-commerce' | 'FinTech' | 'HealthTech' | 'EdTech' | 'Other';
  createdAt: Date;
  updatedAt: Date;
}

export interface PitchDeck {
  id?: string;
  ideaId: string;
  userId: string;
  title: string;
  slides: PitchSlide[];
  investorPersona?: InvestorPersona;
  status: 'draft' | 'completed' | 'shared';
  shareableLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PitchSlide {
  id: string;
  type: SlideType;
  title: string;
  content: string;
  order: number;
  notes?: string;
}

export type SlideType = 
  | 'title'
  | 'problem'
  | 'solution'
  | 'market'
  | 'business-model'
  | 'go-to-market'
  | 'competitive-advantage'
  | 'team'
  | 'financials'
  | 'ask';

export interface InvestorPersona {
  type: 'Angel' | 'VC' | 'Corporate' | 'Government';
  region: 'AU' | 'US' | 'EU' | 'Asia';
  focusAreas?: string[];
  investmentRange?: string;
}

export interface ExecutiveSummary {
  id?: string;
  ideaId: string;
  userId: string;
  content: string;
  format: 'DOCX' | 'PDF' | 'Notion';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  subscription: 'free' | 'pro' | 'startup';
  pitchCount: number;
  createdAt: Date;
}

export interface PitchAnalytics {
  pitchId: string;
  views: number;
  uniqueViews: number;
  averageReadTime: number;
  linkClicks: number;
  lastViewed: Date;
}
