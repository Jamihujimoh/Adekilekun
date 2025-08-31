import type { Player } from '@/types';

export const PLAYERS: Player[] = [
  // Premier League
  { id: 641, name: 'Mohamed Salah', teamId: 40, stats: { matchesPlayed: 32, goals: 18, assists: 10, yellowCards: 2, redCards: 0 } },
  { id: 1101, name: 'Erling Haaland', teamId: 50, stats: { matchesPlayed: 31, goals: 27, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: 1465, name: 'Bukayo Saka', teamId: 42, stats: { matchesPlayed: 35, goals: 16, assists: 9, yellowCards: 3, redCards: 0 } },
  { id: 1485, name: 'Son Heung-min', teamId: 47, stats: { matchesPlayed: 35, goals: 17, assists: 10, yellowCards: 1, redCards: 0 } },
  { id: 184, name: 'Bruno Fernandes', teamId: 33, stats: { matchesPlayed: 35, goals: 10, assists: 8, yellowCards: 9, redCards: 0 } },
  { id: 284, name: 'Kevin De Bruyne', teamId: 50, stats: { matchesPlayed: 18, goals: 4, assists: 10, yellowCards: 1, redCards: 0 } },
  { id: 909, name: 'Cole Palmer', teamId: 49, stats: { matchesPlayed: 33, goals: 22, assists: 11, yellowCards: 7, redCards: 0 } },
  { id: 293, name: 'Phil Foden', teamId: 50, stats: { matchesPlayed: 35, goals: 19, assists: 8, yellowCards: 2, redCards: 0 } },
  // La Liga
  { id: 101, name: 'Jude Bellingham', teamId: 541, stats: { matchesPlayed: 28, goals: 19, assists: 6, yellowCards: 5, redCards: 1 } },
  { id: 202, name: 'Lamine Yamal', teamId: 529, stats: { matchesPlayed: 37, goals: 5, assists: 8, yellowCards: 2, redCards: 0 } },
  { id: 153, name: 'Robert Lewandowski', teamId: 529, stats: { matchesPlayed: 35, goals: 19, assists: 8, yellowCards: 4, redCards: 0 } },
  // Bundesliga
  { id: 501, name: 'Harry Kane', teamId: 157, stats: { matchesPlayed: 32, goals: 36, assists: 8, yellowCards: 2, redCards: 0 } },
  // Ligue 1
  { id: 601, name: 'Kylian Mbappé', teamId: 85, stats: { matchesPlayed: 29, goals: 27, assists: 7, yellowCards: 4, redCards: 0 } },
  // Saudi Pro League
  { id: 2001, name: 'Cristiano Ronaldo', teamId: 624, stats: { matchesPlayed: 31, goals: 35, assists: 11, yellowCards: 2, redCards: 0 } },
];
