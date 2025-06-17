import OpenAI from 'openai';
import { StartupIdea, PitchSlide, SlideType, InvestorPersona } from '@/types/pitch';
import { generateDemoPitchDeck, generateDemoExecutiveSummary, isDemoMode } from './demo';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePitchDeck(
  idea: StartupIdea,
  investorPersona?: InvestorPersona
): Promise<PitchSlide[]> {
  // Use demo mode if API key is not configured
  if (isDemoMode()) {
    console.log('Using demo mode for pitch generation');
    return generateDemoPitchDeck(idea);
  }

  const slides: PitchSlide[] = [];
  const slideTypes: SlideType[] = [
    'title',
    'problem',
    'solution',
    'market',
    'business-model',
    'go-to-market',
    'competitive-advantage',
    'team',
    'financials',
    'ask'
  ];

  for (let i = 0; i < slideTypes.length; i++) {
    const slideType = slideTypes[i];
    const slide = await generateSlide(idea, slideType, investorPersona);
    slides.push({
      id: `slide-${i + 1}`,
      type: slideType,
      title: slide.title,
      content: slide.content,
      order: i + 1,
    });
  }

  return slides;
}

async function generateSlide(
  idea: StartupIdea,
  slideType: SlideType,
  investorPersona?: InvestorPersona
): Promise<{ title: string; content: string }> {
  const prompt = createSlidePrompt(idea, slideType, investorPersona);
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert startup pitch consultant. Create compelling, investor-ready slide content that is concise, impactful, and tailored to the specific audience.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    const lines = content.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^#+\s*/, '') || getDefaultSlideTitle(slideType);
    const slideContent = lines.slice(1).join('\n').trim();

    return {
      title,
      content: slideContent
    };
  } catch (error: any) {
    console.error('Error generating slide:', error);

    // If quota exceeded or other API error, fall back to demo mode
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      console.log('OpenAI quota exceeded, falling back to demo mode');
      const demoSlides = generateDemoPitchDeck(idea);
      const demoSlide = demoSlides.find(slide => slide.type === slideType);
      if (demoSlide) {
        return {
          title: demoSlide.title,
          content: demoSlide.content,
        };
      }
    }

    return {
      title: getDefaultSlideTitle(slideType),
      content: 'Content generation failed. Please try again.'
    };
  }
}

function createSlidePrompt(
  idea: StartupIdea,
  slideType: SlideType,
  investorPersona?: InvestorPersona
): string {
  const baseContext = `
Startup: ${idea.startupName}
Industry: ${idea.industry}
Problem: ${idea.problemStatement}
Solution: ${idea.solution}
Target Audience: ${idea.targetAudience}
Business Model: ${idea.monetizationPlan}
Competitors: ${idea.competitors}
${idea.marketSize ? `Market Size: ${idea.marketSize}` : ''}
${idea.teamOverview ? `Team: ${idea.teamOverview}` : ''}
`;

  const investorContext = investorPersona ? `
Investor Type: ${investorPersona.type}
Region: ${investorPersona.region}
${investorPersona.focusAreas ? `Focus Areas: ${investorPersona.focusAreas.join(', ')}` : ''}
` : '';

  const slidePrompts = {
    title: `Create a compelling title slide with:
- Company name and tagline
- Brief value proposition (1 sentence)
- Key metrics or traction if applicable`,

    problem: `Create a problem slide that:
- Clearly defines the pain point
- Shows market validation
- Demonstrates urgency and scale
- Uses specific examples or statistics`,

    solution: `Create a solution slide that:
- Clearly explains how you solve the problem
- Highlights unique value proposition
- Shows product/service benefits
- Includes key features or differentiators`,

    market: `Create a market opportunity slide that:
- Defines Total Addressable Market (TAM)
- Shows market growth trends
- Identifies target segments
- Demonstrates market timing`,

    'business-model': `Create a business model slide that:
- Explains revenue streams
- Shows pricing strategy
- Demonstrates unit economics
- Highlights scalability`,

    'go-to-market': `Create a go-to-market slide that:
- Outlines customer acquisition strategy
- Shows sales and marketing channels
- Demonstrates traction or early results
- Includes partnership opportunities`,

    'competitive-advantage': `Create a competitive advantage slide that:
- Maps competitive landscape
- Highlights unique differentiators
- Shows barriers to entry
- Demonstrates sustainable advantages`,

    team: `Create a team slide that:
- Introduces key team members
- Highlights relevant experience
- Shows complementary skills
- Demonstrates execution capability`,

    financials: `Create a financials slide that:
- Shows revenue projections (3-5 years)
- Highlights key metrics and KPIs
- Demonstrates path to profitability
- Includes funding history if applicable`,

    ask: `Create an ask slide that:
- States funding amount needed
- Explains use of funds breakdown
- Shows expected milestones
- Highlights investor benefits and returns`
  };

  return `${baseContext}${investorContext}

${slidePrompts[slideType]}

Format the response as:
# Slide Title
Slide content here (use bullet points, short paragraphs, and compelling language)`;
}

function getDefaultSlideTitle(slideType: SlideType): string {
  const titles = {
    title: 'Company Overview',
    problem: 'The Problem',
    solution: 'Our Solution',
    market: 'Market Opportunity',
    'business-model': 'Business Model',
    'go-to-market': 'Go-to-Market Strategy',
    'competitive-advantage': 'Competitive Advantage',
    team: 'Our Team',
    financials: 'Financial Projections',
    ask: 'The Ask'
  };
  return titles[slideType];
}

export async function generateExecutiveSummary(idea: StartupIdea): Promise<string> {
  // Use demo mode if API key is not configured
  if (isDemoMode()) {
    console.log('Using demo mode for executive summary generation');
    return generateDemoExecutiveSummary(idea);
  }

  const prompt = `
Create a comprehensive executive summary for the following startup:

Startup: ${idea.startupName}
Industry: ${idea.industry}
Problem: ${idea.problemStatement}
Solution: ${idea.solution}
Target Audience: ${idea.targetAudience}
Business Model: ${idea.monetizationPlan}
Competitors: ${idea.competitors}
${idea.marketSize ? `Market Size: ${idea.marketSize}` : ''}
${idea.teamOverview ? `Team: ${idea.teamOverview}` : ''}

Create a 1-page executive summary that includes:
1. Company overview and mission
2. Problem and solution
3. Market opportunity
4. Business model and revenue streams
5. Competitive advantage
6. Team highlights
7. Financial projections summary
8. Funding requirements and use of funds

Format it professionally for investors, incubators, and grant applications.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business consultant specializing in executive summaries for startups. Create professional, compelling summaries that capture investor attention.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Executive summary generation failed. Please try again.';
  } catch (error: any) {
    console.error('Error generating executive summary:', error);

    // If quota exceeded or other API error, fall back to demo mode
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      console.log('OpenAI quota exceeded, falling back to demo mode for executive summary');
      return generateDemoExecutiveSummary(idea);
    }

    return 'Executive summary generation failed. Please try again.';
  }
}
