'use server';

import { predictMatchOutcome } from '@/ai/flows/predict-match-outcome';
import { summarizeMatch } from '@/ai/flows/summarize-match';
import { generatePlayerReport } from '@/ai/flows/generate-player-report';
import { z } from 'zod';
import { PLAYERS } from '@/lib/data';
import { getFixtures } from '@/lib/api-football';
import { getPlayerStats } from '@/lib/sportradar';

const predictionSchema = z.object({
  team1Name: z.string(),
  team2Name: z.string(),
});

const summarySchema = z.object({
  matchId: z.string(),
});

const reportSchema = z.object({
  playerName: z.string(),
});

type ActionResponse<T> = {
  data?: T;
  error?: string;
};

export async function handlePrediction(
  formData: z.infer<typeof predictionSchema>
): Promise<ActionResponse<any>> {
  try {
    const { team1Name, team2Name } = predictionSchema.parse(formData);

    if (!team1Name || !team2Name) {
      return { error: 'Please select both teams.' };
    }
    if (team1Name === team2Name) {
      return { error: 'Please select two different teams.' };
    }

    const result = await predictMatchOutcome({
      team1: team1Name,
      team2: team2Name,
    });

    return { data: result };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to generate prediction.' };
  }
}

export async function handleSummary(
  formData: z.infer<typeof summarySchema>
): Promise<ActionResponse<any>> {
  try {
    const { matchId } = summarySchema.parse(formData);
    // Fetch all fixtures for today to find the match. This is not ideal,
    // a better approach might be to fetch fixtures for a wider range or have a dedicated endpoint for a match by ID.
    const today = new Date().toISOString().split('T')[0];
    const allFixtures = await getFixtures({ date: today });
    const match = allFixtures.find((m: any) => m.fixture.id === parseInt(matchId));

    if (!match) {
      return { error: 'Could not find match details. It might be from a past date.' };
    }

    const team1Name = match.teams.home.name;
    const team2Name = match.teams.away.name;
    const team1Score = match.goals.home;
    const team2Score = match.goals.away;

    const result = await summarizeMatch({
      matchData: `Match between ${team1Name} and ${team2Name}. Final score: ${team1Score}-${team2Score}.`,
    });

    return { data: result };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to generate summary.' };
  }
}

export async function handleReport(
  formData: z.infer<typeof reportSchema>
): Promise<ActionResponse<any>> {
  try {
    const { playerName } = reportSchema.parse(formData);
    const playerInfo = PLAYERS.find((p) => p.name.toLowerCase() === playerName.toLowerCase());

    if (!playerInfo) {
      return { error: `Player "${playerName}" not found. Please check the spelling or try another player.` };
    }
    
    // Fetch live player stats from Sportradar using the player's Sportradar ID
    // Note: The player ID from our static data needs to correspond to a real Sportradar ID.
    const livePlayerStats = await getPlayerStats(String(playerInfo.id));
    
    if (!livePlayerStats || !livePlayerStats.player) {
        return { error: 'Could not fetch player statistics from Sportradar.' };
    }

    const result = await generatePlayerReport({
      playerName: livePlayerStats.player.name,
      teamName: livePlayerStats.team.name,
      playerStats: JSON.stringify(livePlayerStats.statistics, null, 2),
      matchDetails: 'Recent performance data from live and historical matches.', // This could be enhanced further
    });

    return { data: result };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to generate report.' };
  }
}
