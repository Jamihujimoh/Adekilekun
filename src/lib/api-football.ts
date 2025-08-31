//'use server';

const API_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;

if (!API_KEY) {
  throw new Error('API_FOOTBALL_KEY is not defined in .env file');
}

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'v3.football.api-sports.io',
};

async function fetchFromApi(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${API_URL}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  );

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error(`API request failed: ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`Error body: ${errorBody}`);
      return [];
    }

    const data = await response.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
        console.error('API returned errors:', data.errors);
        return [];
    }

    return data.response;
  } catch (error) {
    console.error('Failed to fetch from API-Football', error);
    return [];
  }
}

export async function getFixtures(params: {
  live?: string;
  date?: string;
  league?: string;
  season?: string;
}) {
  return fetchFromApi('fixtures', params);
}

export async function getStandings(params: {
  league: string;
  season: string;
}) {
    const response = await fetchFromApi('standings', params);
    // The standings are nested inside the response
    return response[0]?.league?.standings[0] || [];
}

export async function getTeams(params: {
    league: string;
    season: string;
}) {
    return fetchFromApi('teams', params);
}
