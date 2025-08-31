'use server';

/**
 * @fileOverview Generates a summary of a match using AI.
 *
 * - summarizeMatch - A function that generates a match summary.
 * - SummarizeMatchInput - The input type for the summarizeMatch function.
 * - SummarizeMatchOutput - The return type for the summarizeMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMatchInputSchema = z.object({
  matchData: z
    .string()
    .describe(
      'Detailed data from a football (soccer) match including teams, scores, key events, and statistics.'
    ),
});
export type SummarizeMatchInput = z.infer<typeof SummarizeMatchInputSchema>;

const SummarizeMatchOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the match highlights.'),
});
export type SummarizeMatchOutput = z.infer<typeof SummarizeMatchOutputSchema>;

export async function summarizeMatch(input: SummarizeMatchInput): Promise<SummarizeMatchOutput> {
  return summarizeMatchFlow(input);
}

const summarizeMatchPrompt = ai.definePrompt({
  name: 'summarizeMatchPrompt',
  input: {schema: SummarizeMatchInputSchema},
  output: {schema: SummarizeMatchOutputSchema},
  prompt: `You are an expert football (soccer) journalist. Generate a concise summary of the match provided in the following data. Focus on key events, turning points, and overall performance of the teams and players. Be as objective as possible.

Match Data: {{{matchData}}}`,
});

const summarizeMatchFlow = ai.defineFlow(
  {
    name: 'summarizeMatchFlow',
    inputSchema: SummarizeMatchInputSchema,
    outputSchema: SummarizeMatchOutputSchema,
  },
  async input => {
    const {output} = await summarizeMatchPrompt(input);
    return output!;
  }
);
