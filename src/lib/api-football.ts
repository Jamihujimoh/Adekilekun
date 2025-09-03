//'use server';

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALLDATA_API_KEY;

if (!API_KEY) {
  throw new Error('FOOTBALLDATA_API_KEY is not defined in .env');
}

const headers = {
  'X-Auth-Token': API_KEY,
};

// ✅ Calculate correct season year
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
// Football season starts in August (8)
const defaultSeason = currentMonth >= 8 ? currentYear : currentYear - 1;

type Params = Record<string, string | undefined>;

async function fetchFromApi(endpoint: string, params: Params = {}) {
  // ✅ If no season passed, use defaultSeason
  if (!params.season) {
    params.season = defaultSeason.toString();
  }

  // football-data.org uses different endpoints and query params
  let url = `${API_URL}/${endpoint}`;

  if (endpoint === 'matches') {
    // Example for fixtures: use dateFrom/dateTo
    const dateFrom = params.date || new Date().toISOString().slice(0, 10);
    const dateTo = params.date || dateFrom;
    url += `?dateFrom=${dateFrom}&dateTo=${dateTo}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error(`API request failed: ${response.status}`);
      const errorBody = await response.text();
      console.error(`Error body: ${errorBody}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch from Football-Data API', err);
    return [];
  }
}

export async function getFixtures(params: {
  live?: string;
  date?: string;
  league?: string;
  season?: string;
}) {
  const data = await fetchFromApi('matches', params);
  return data?.matches || [];
}

export async function getStandings(params: {
  league: string;
  season?: string; // ✅ Made optional
}) {
  const data = await fetchFromApi(`competitions/${params.league}/standings`, params);
  return data?.standings?.[0]?.table || [];
}

export async function getTeams(params: {
  league: string;
  season?: string; // ✅ Made optional
}) {
  const data = await fetchFromApi(`competitions/${params.league}/teams`, params);
  return data?.teams || [];
}
