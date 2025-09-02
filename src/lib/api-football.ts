//'use server';

const API_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;

if (!API_KEY) {
  throw new Error('API_FOOTBALL_KEY is not defined in .env');
}

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'v3.football.api-sports.io',
};

// ✅ Calculate correct season year
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
// Football season starts in August (8)
const defaultSeason = currentMonth >= 8 ? currentYear : currentYear - 1;

async function fetchFromApi(endpoint: string, params: Record<string, string>) {
  // ✅ Force dynamic season for all API calls
  params.season = defaultSeason.toString();

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
      console.error(`API request failed: ${response.status}`);
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
