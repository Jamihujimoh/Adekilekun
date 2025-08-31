const API_URL = 'https://api.the-odds-api.com/v4';
const API_KEY = process.env.ODDS_API_KEY;

if (!API_KEY) {
  throw new Error('ODDS_API_KEY is not defined in .env file');
}

interface Odd {
  bookmaker: string;
  markets: {
    key: string;
    outcomes: {
      name: string;
      price: number;
    }[];
  }[];
}

interface OddsResponse {
    id: string;
    sport_key: string;
    sport_title: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: Odd[];
}


async function fetchFromApi(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${API_URL}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  );

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `The Odds API request failed: ${response.statusText}`,
        errorBody
      );
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch from The Odds API', error);
    return [];
  }
}

function getAverageOdds(odds: OddsResponse[]) {
  if (!odds || odds.length === 0) {
    return { team1Win: 2.5, team2Win: 3.0, draw: 3.2 }; // Return default if no odds found
  }
  
  const match = odds[0];
  const homeTeam = match.home_team;
  const awayTeam = match.away_team;
  
  let totalHomeWin = 0;
  let totalAwayWin = 0;
  let totalDraw = 0;
  let count = 0;

  for (const bookmaker of match.bookmakers) {
    const h2hMarket = bookmaker.markets.find((m) => m.key === 'h2h');
    if (h2hMarket) {
        const homeOutcome = h2hMarket.outcomes.find(o => o.name === homeTeam);
        const awayOutcome = h2hMarket.outcomes.find(o => o.name === awayTeam);
        const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'Draw');

        if (homeOutcome && awayOutcome && drawOutcome) {
            totalHomeWin += homeOutcome.price;
            totalAwayWin += awayOutcome.price;
            totalDraw += drawOutcome.price;
            count++;
        }
    }
  }

  if (count === 0) {
    return { team1Win: 2.5, team2Win: 3.0, draw: 3.2 }; // Default if no h2h market found
  }

  return {
    team1Win: totalHomeWin / count,
    team2Win: totalAwayWin / count,
    draw: totalDraw / count,
  };
}


export async function getOdds(team1: string, team2: string) {
  // The API uses a general query for teams, so we find the match with both teams.
  // This is not perfect and might fail for obscure teams or multiple matches.
  // A better approach would be to use a specific match ID if we had one.
  const allOdds = await fetchFromApi('sports/soccer_epl/odds', {
    apiKey: API_KEY,
    regions: 'uk',
    markets: 'h2h',
    oddsFormat: 'decimal',
  });
  
  const relevantOdds = allOdds.filter((o: OddsResponse) => 
    (o.home_team.includes(team1) && o.away_team.includes(team2)) ||
    (o.home_team.includes(team2) && o.away_team.includes(team1))
  );

  return getAverageOdds(relevantOdds);
}
