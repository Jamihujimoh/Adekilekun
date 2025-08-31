import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import type { Fixture } from '@/types';

interface RecentMatchesProps {
  liveMatches: Fixture[];
  upcomingMatches: Fixture[];
  completedMatches: Fixture[];
}

export function RecentMatches({
  liveMatches,
  upcomingMatches,
  completedMatches,
}: RecentMatchesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Matches</CardTitle>
        <CardDescription>
          Check live scores, results, and upcoming fixtures.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="live">
          <TabsList>
            <TabsTrigger value="live">
              Live{' '}
              <Badge
                variant="destructive"
                className="ml-2 rounded-full h-5 w-5 flex items-center justify-center p-0"
              >
                {liveMatches.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="live" className="mt-4">
            <MatchList matches={liveMatches} />
          </TabsContent>
          <TabsContent value="upcoming" className="mt-4">
            <MatchList matches={upcomingMatches} />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <MatchList matches={completedMatches} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MatchList({ matches }: { matches: Fixture[] }) {
  if (matches.length === 0) {
    return <p className="text-muted-foreground text-sm">No matches found.</p>;
  }
  return (
    <div className="space-y-4">
      {matches.map((match) => {
        const { teams, goals, fixture } = match;
        const team1 = teams.home;
        const team2 = teams.away;
        return (
          <div
            key={fixture.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-4 w-1/3">
              <Avatar className="h-8 w-8">
                {team1?.logo && (
                  <AvatarImage src={team1.logo} alt={team1.name} />
                )}
                <AvatarFallback>
                  {team1.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-right flex-1 hidden sm:block">
                {team1.name}
              </span>
            </div>
            <div className="text-center w-1/3">
              {fixture.status.short === 'FT' ||
              fixture.status.short === 'LIVE' ? (
                <div className="text-2xl font-bold">
                  <span>{goals.home}</span> - <span>{goals.away}</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {format(new Date(fixture.date), 'HH:mm')}
                </div>
              )}
              {fixture.status.short === 'LIVE' && (
                <Badge variant="destructive" className="animate-pulse mt-1">
                  {fixture.status.elapsed}'
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 w-1/3 justify-end">
              <span className="font-medium text-left flex-1 hidden sm:block">
                {team2.name}
              </span>
              <Avatar className="h-8 w-8">
                {team2?.logo && (
                  <AvatarImage src={team2.logo} alt={team2.name} />
                )}
                <AvatarFallback>
                  {team2.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        );
      })}
    </div>
  );
}
