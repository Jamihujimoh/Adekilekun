import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverviewCard } from '@/components/dashboard/overview-card';
import { GenAIPanel } from '@/components/dashboard/gen-ai-panel';
import { FileText, Signal, Users, BrainCircuit } from 'lucide-react';
import { PLAYERS } from '@/lib/data';
import { RecentMatches } from '@/components/dashboard/recent-matches';
import { ClubStatsTable } from '@/components/dashboard/club-stats-table';
import { getFixtures, getStandings, getTeams } from '@/lib/api-football';
import type { Team } from '@/types';

export default async function DashboardPage() {
  // Calculate current football season
  const now = new Date();
  const currentSeason = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const today = now.toISOString().slice(0, 10);

  // --- Fetch standings with fallback ---
  let standings = await getStandings({ league: '39', season: currentSeason });
  let fallbackSeasonUsed = false;
  if (!standings || standings.length === 0) {
    standings = await getStandings({ league: '39', season: currentSeason - 1 });
    fallbackSeasonUsed = true;
  }

  // --- Fetch fixtures with fallback ---
  let liveFixtures = await getFixtures({ live: 'all', season: currentSeason });
  if (!liveFixtures || liveFixtures.length === 0) {
    liveFixtures = await getFixtures({ live: 'all', season: currentSeason - 1 });
  }

  let allFixtures = await getFixtures({ date: today, season: currentSeason });
  if (!allFixtures || allFixtures.length === 0) {
    allFixtures = await getFixtures({ date: today, season: currentSeason - 1 });
  }

  // --- Fetch teams with fallback ---
  let teamsData = await getTeams({ league: '39', season: currentSeason });
  if (!teamsData || teamsData.length === 0) {
    teamsData = await getTeams({ league: '39', season: currentSeason - 1 });
  }
  const teams: Team[] = teamsData.map((t: any) => t.team);

  // Separate matches
  const upcomingMatches = allFixtures.filter((m) => m.fixture.status.short === 'NS');
  const completedMatches = allFixtures
    .filter((m) => m.fixture.status.short === 'FT')
    .slice(0, 10);

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8">
      <div className="flex items-center justify-between space-x-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Live Matches"
          value={liveFixtures.length.toString()}
          icon={<Signal className="h-4 w-4 text-muted-foreground" />}
          description="Matches currently in progress"
        />
        <OverviewCard
          title="Total Players"
          value={PLAYERS.length.toString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Tracked players across all teams"
        />
        <OverviewCard
          title="Reports Generated"
          value="142"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          description="AI-powered reports generated this month"
        />
        <OverviewCard
          title="Predictions Made"
          value="78"
          icon={<BrainCircuit className="h-4 w-4 text-muted-foreground" />}
          description="Match outcome predictions this week"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Premier League Standings</CardTitle>
            <CardDescription>
              Current club standings for the {fallbackSeasonUsed ? currentSeason - 1 : currentSeason} season.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClubStatsTable standings={standings} />
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <GenAIPanel teams={teams} completedMatches={completedMatches} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <RecentMatches
          liveMatches={liveFixtures}
          upcomingMatches={upcomingMatches}
          completedMatches={completedMatches}
        />
      </div>
    </div>
  );
}
