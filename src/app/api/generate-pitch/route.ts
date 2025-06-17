import { NextRequest, NextResponse } from 'next/server';
import { generatePitchDeck, generateExecutiveSummary } from '@/lib/ai';
import {
  createIdea,
  createPitchDeck,
  createExecutiveSummary,
} from '@/lib/database';
import { StartupIdea } from '@/types/pitch';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startupIdea, investorPersona, userId } = body;

    // Validate required fields
    if (
      !startupIdea ||
      !startupIdea.startupName ||
      !startupIdea.problemStatement
    ) {
      return NextResponse.json(
        { error: 'Missing required startup information' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      );
    }

    // Create startup idea object
    const idea: Omit<StartupIdea, 'id'> = {
      userId,
      startupName: startupIdea.startupName,
      problemStatement: startupIdea.problemStatement,
      targetAudience: startupIdea.targetAudience,
      solution: startupIdea.solution,
      monetizationPlan: startupIdea.monetizationPlan,
      competitors: startupIdea.competitors,
      marketSize: startupIdea.marketSize || null,
      teamOverview: startupIdea.teamOverview || null,
      industry: startupIdea.industry,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save idea to database
    const ideaId = await createIdea(idea);

    // Generate pitch deck and executive summary
    const [pitchSlides, executiveSummaryContent] = await Promise.all([
      generatePitchDeck({ ...idea, id: ideaId }, investorPersona),
      generateExecutiveSummary({ ...idea, id: ideaId }),
    ]);

    // Save pitch deck to database
    const pitchDeckData = {
      ideaId,
      userId,
      title: `${idea.startupName} Pitch Deck`,
      slides: pitchSlides,
      investorPersona: investorPersona || null,
      status: 'completed' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pitchDeckId = await createPitchDeck(pitchDeckData);

    // Save executive summary to database
    const executiveSummaryData = {
      ideaId,
      userId,
      content: executiveSummaryContent,
      format: 'PDF' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const executiveSummaryId = await createExecutiveSummary(
      executiveSummaryData
    );

    return NextResponse.json({
      success: true,
      data: {
        pitchDeck: { ...pitchDeckData, id: pitchDeckId },
        executiveSummary: { ...executiveSummaryData, id: executiveSummaryId },
        idea: { ...idea, id: ideaId },
      },
    });
  } catch (error) {
    console.error('Error generating pitch:', error);
    return NextResponse.json(
      { error: 'Failed to generate pitch. Please try again.' },
      { status: 500 }
    );
  }
}
