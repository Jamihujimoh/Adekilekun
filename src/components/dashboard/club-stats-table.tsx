import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { Standing } from '@/types';

export function ClubStatsTable({ standings }: { standings: Standing[] }) {
  if (!standings || standings.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No standings data available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Pos</TableHead>
            <TableHead>Club</TableHead>
            <TableHead className="text-center">Played</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((club) => {
            return (
              <TableRow key={club.team.id}>
                <TableCell className="font-bold">{club.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {club.team.logo && (
                        <AvatarImage
                          src={club.team.logo}
                          alt={club.team.name}
                          data-ai-hint={club.team.name
                            .toLowerCase()
                            .replace(' ', '')}
                        />
                      )}
                      <AvatarFallback>
                        {club.team.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{club.team.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{club.all.played}</TableCell>
                <TableCell className="text-center">{club.all.win}</TableCell>
                <TableCell className="text-center">{club.all.draw}</TableCell>
                <TableCell className="text-center">{club.all.lose}</TableCell>
                <TableCell className="text-center font-bold">
                  {club.points}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
