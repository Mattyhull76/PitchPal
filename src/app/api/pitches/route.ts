import { NextRequest, NextResponse } from 'next/server';
import { getUserPitchDecks } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const pitchDecks = await getUserPitchDecks(userId);

    return NextResponse.json({
      success: true,
      data: pitchDecks,
    });
  } catch (error) {
    console.error('Error fetching pitch decks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pitch decks' },
      { status: 500 }
    );
  }
}
