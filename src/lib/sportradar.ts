//'use server';

import { PLAYERS } from './data';

// Note: This is a placeholder for Sportradar API integration.
// The actual endpoints and data structures will need to be implemented
// based on the specific Sportradar API documentation for football stats.

const API_URL = 'https://api.sportradar.com'; // Example base URL
const API_KEY = process.env.SPORTRADAR_API_KEY;

if (!API_KEY) {
  throw new Error('SPORTRADAR_API_KEY is not defined in .env file');
}

async function fetchFromApi(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${API_URL}/${endpoint}`);
    // Sportradar API key is often sent as a query parameter `api_key`
    url.searchParams.append('api_key', API_KEY);
    Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, value)
    );

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            console.error(`Sportradar API request failed: ${response.statusText}`);
            const errorBody = await response.text();
            console.error(`Error body: ${errorBody}`);
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('Failed to fetch from Sportradar API', error);
        return null;
    }
}

/**
 * Fetches player statistics from the Sportradar API.
 * NOTE: This is a placeholder implementation. It uses static data.
 * @param playerId - The static ID for the player from `src/lib/data.ts`.
 * @returns Player statistics or null if not found.
 */
export async function getPlayerStats(playerId: string) {
  // This is a hypothetical endpoint. You will need to replace this with the correct one
  // from the Sportradar documentation. This function currently uses static sample data.
  // const data = await fetchFromApi(`soccer/trial/v4/en/players/sr:player:{sportradar_id}/profile.json`);

  console.log(`Fetching stats for player ${playerId} (using placeholder data)`);

  const selectedPlayer = PLAYERS.find(p => p.id === parseInt(playerId));

  if (!selectedPlayer) {
    console.error(`Player with ID ${playerId} not found in static data.`);
    return null;
  }
  
  // This is sample data that mirrors a likely structure from the API.
  // In a real implementation, `data` from `fetchFromApi` would be used here.
  return {
    player: {
        id: `sr:player:${playerId}`,
        name: selectedPlayer.name,
        type: "forward", // Placeholder
        date_of_birth: "1993-05-13", // Placeholder
        nationality: "England", // Placeholder
        height: 188, // Placeholder
        weight: 85, // Placeholder
    },
    team: {
        id: `sr:competitor:${selectedPlayer.teamId}`, // Placeholder
        name: "A Team Name" // Placeholder - would need to look up team name from teamId
    },
    statistics: {
        season: {
            year: 2023,
            name: "Premier League 2023/2024",
            statistics: {
                matches_played: selectedPlayer.stats.matchesPlayed,
                minutes_played: selectedPlayer.stats.matchesPlayed * 85, // Approximate
                goals: selectedPlayer.stats.goals,
                assists: selectedPlayer.stats.assists,
                yellow_cards: selectedPlayer.stats.yellowCards,
                red_cards: selectedPlayer.stats.redCards,
                shots_total: selectedPlayer.stats.goals * 2.5, // Approximate
                shots_on_target: selectedPlayer.stats.goals * 1.5, // Approximate
                passes_total: selectedPlayer.stats.matchesPlayed * 30, // Approximate
                pass_completion_rate: 85.5, // Placeholder
                tackles_won: selectedPlayer.stats.matchesPlayed * 1.2, // Approximate
                dribbles_completed: selectedPlayer.stats.matchesPlayed * 1.8, // Approximate
            }
        }
    }
  };
}
