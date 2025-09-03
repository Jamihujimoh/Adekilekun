//'use server';

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALLDATA_API_KEY;

if (!API_KEY) {
  throw new Error('FOOTBALLDATA_API_KEY is not defined in .env');
}

const headers = {
  'X-Auth-Token': API_KEY,
};

// ✅ Calculate default season (August start)
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const defaultSeason = currentMonth >= 8 ? currentYear : currentYear - 1;

type Params = Record<string, string | undefined>;

async function fetchFromFD(endpoint: string, params: Params = {}): Promise<any> {
  if (!params.season) {
    params.season = defaultSeason.toString();
  }

  let url = `${API_URL}/${endpoint}`;

  // Matches endpoint uses date range
  if (endpoint === 'matches') {
    const dateFrom = params.date || today.toISOString().slice(0, 10);
    const dateTo = params.date || dateFrom;
    url += `?dateFrom=${dateFrom}&dateTo=${dateTo}`;
  }

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`Football-Data API request failed: ${res.status}`);
      const text = await res.text();
      console.error(`Error body: ${text}`);
      return [];
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch from Football-Data API', err);
    return [];
  }
}

// --- Exported functions matching API-Football style ---
export async function getCurrentStandings(league = 'PL', season?: string): Promise<any[]> {
  const params = { season };
  const data = await fetchFromFD(`competitions/${league}/standings`, params);
  return data.standings?.[0]?.table || [];
}

export async function getTodayFixtures(date?: string): Promise<any[]> {
  const params = { date };
  const data = await fetchFromFD('matches', params);
  return data.matches || [];
}

export async function getTeams(league = 'PL', season?: string): Promise<any[]> {
  const params = { season };
  const data = await fetchFromFD(`competitions/${league}/teams`, params);
  return data.teams || [];
}
