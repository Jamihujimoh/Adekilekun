import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-match.ts';
import '@/ai/flows/predict-match-outcome.ts';
import '@/ai/flows/generate-player-report.ts';
