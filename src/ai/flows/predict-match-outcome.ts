'use server';

/**
 * @fileOverview AI-powered prediction of match outcomes based on historical data and real-time statistics.
 *
 * - predictMatchOutcome - A function that predicts match outcomes.
 * - PredictMatchOutcomeInput - The input type for the predictMatchOutcome function.
 * - PredictMatchOutcomeOutput - The return type for the predictMatchOutcome function.
 */

import {ai} from '@/ai/genkit';
import {getOdds} from '@/lib/the-odds-api';
import {z} from 'genkit';

const PredictMatchOutcomeInputSchema = z.object({
  team1: z.string().describe('Name of the first team.'),
  team2: z.string().describe('Name of the second team.'),
});
export type PredictMatchOutcomeInput = z.infer<typeof PredictMatchOutcomeInputSchema>;

const PredictMatchOutcomeOutputSchema = z.object({
  predictedOutcome: z
    .string()
    .describe(
      'Predicted outcome of the match (e.g., Team 1 win, Team 2 win, Draw).'
    ),
  confidenceLevel: z
    .number()
    .describe('Confidence level of the prediction (0-1).'),
  rationale: z.string().describe('Rationale behind the prediction.'),
  team1WinOdds: z.number().describe('Decimal odds for Team 1 to win.'),
  team2WinOdds: z.number().describe('Decimal odds for Team 2 to win.'),
  drawOdds: z.number().describe('Decimal odds for a draw.'),
});
export type PredictMatchOutcomeOutput = z.infer<
  typeof PredictMatchOutcomeOutputSchema
>;

export async function predictMatchOutcome(
  input: PredictMatchOutcomeInput
): Promise<PredictMatchOutcomeOutput> {
  return predictMatchOutcomeFlow(input);
}

const getOddsTool = ai.defineTool(
  {
    name: 'getMatchOdds',
    description:
      'Get the betting odds for a match between two teams. Returns decimal odds for each team winning and for a draw.',
    inputSchema: z.object({
      team1: z.string().describe('The name of the home team.'),
      team2: z.string().describe('The name of the away team.'),
    }),
    outputSchema: z.object({
      team1Win: z.number(),
      team2Win: z.number(),
      draw: z.number(),
    }),
  },
  async ({team1, team2}) => {
    return await getOdds(team1, team2);
  }
);

const predictMatchOutcomePrompt = ai.definePrompt({
  name: 'predictMatchOutcomePrompt',
  input: {schema: PredictMatchOutcomeInputSchema},
  output: {schema: PredictMatchOutcomeOutputSchema},
  tools: [getOddsTool],
  prompt: `You are an expert football (soccer) analyst. Your task is to predict the outcome of a football match between {{team1}} and {{team2}}.

  Your primary source of information will be the real-time betting odds.
  
  1. Use the getMatchOdds tool to get the latest betting odds for the match.
  2. Determine the most likely outcome by identifying which of the three possibilities ({{team1}} win, {{team2}} win, or Draw) has the lowest decimal odd.
  3. Set the 'predictedOutcome' field to this result.
  4. Calculate the 'confidenceLevel' based on the implied probability from the odds. The lower the odd, the higher the confidence. A simple conversion is (1 / odd).
  5. Populate the 'team1WinOdds', 'team2WinOdds', and 'drawOdds' with the exact values returned by the tool.
  6. For the 'rationale', explain that the prediction is based on the betting markets, which reflect a consensus of expert opinion and statistical analysis. Mention which team is the favorite according to the odds and why.
  
  Ensure the output is formatted precisely according to the PredictMatchOutcomeOutputSchema.
  `,
});

const predictMatchOutcomeFlow = ai.defineFlow(
  {
    name: 'predictMatchOutcomeFlow',
    inputSchema: PredictMatchOutcomeInputSchema,
    outputSchema: PredictMatchOutcomeOutputSchema,
  },
  async input => {
    const {output} = await predictMatchOutcomePrompt(input);
    return output!;
  }
);
