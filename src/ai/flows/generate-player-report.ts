'use server';

/**
 * @fileOverview A player performance report generator AI agent.
 *
 * - generatePlayerReport - A function that handles the player report generation process.
 * - GeneratePlayerReportInput - The input type for the generatePlayerReport function.
 * - GeneratePlayerReportOutput - The return type for the generatePlayerReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlayerReportInputSchema = z.object({
  playerName: z.string().describe('The name of the player to generate a report for.'),
  playerStats: z.string().describe('A JSON string of real-time statistics of the player from the Sportradar API.'),
  teamName: z.string().describe('The name of the team the player belongs to.'),
  matchDetails: z.string().describe('Details about recent matches the player participated in.'),
});
export type GeneratePlayerReportInput = z.infer<typeof GeneratePlayerReportInputSchema>;

const GeneratePlayerReportOutputSchema = z.object({
  report: z.string().describe('The generated player performance report in Markdown format.'),
});
export type GeneratePlayerReportOutput = z.infer<typeof GeneratePlayerReportOutputSchema>;

export async function generatePlayerReport(input: GeneratePlayerReportInput): Promise<GeneratePlayerReportOutput> {
  return generatePlayerReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlayerReportPrompt',
  input: {schema: GeneratePlayerReportInputSchema},
  output: {schema: GeneratePlayerReportOutputSchema},
  prompt: `You are an expert football (soccer) analyst specializing in generating player performance reports using live data.

  Your task is to analyze the provided real-time JSON data from Sportradar to create a comprehensive, well-structured report on the player.
  The report should be insightful, data-driven, and written in Markdown format.

  **Player Details:**
  - **Name:** {{{playerName}}}
  - **Team:** {{{teamName}}}
  - **Match Context:** {{{matchDetails}}}

  **Live Player Statistics (from Sportradar):**
  \`\`\`json
  {{{playerStats}}}
  \`\`\`

  **Instructions:**
  1.  **Overall Summary:** Start with a brief paragraph summarizing the player's current form and key contributions based on the stats.
  2.  **Strengths:** Create a bulleted list of 2-3 key strengths. For each strength, cite specific stats from the JSON data to support your analysis (e.g., "Excellent goal scorer (19 goals in 28 matches)").
  3.  **Areas for Improvement:** Create a bulleted list of 1-2 areas where the player could improve. Again, back up your points with data (e.g., "Disciplinary issues (5 yellow cards, 1 red card)").
  4.  **Data-Driven Insights:** Provide one or two deeper insights by combining stats. For example, you could analyze their shot conversion rate (shots_on_target / shots_total) or their defensive contribution (tackles_won).
  5.  **Final Verdict:** Conclude with a final sentence on the player's importance to their team.

  Generate the report in clear, concise language suitable for a coach or scout. Ensure the output is a single Markdown string.
  `,
});

const generatePlayerReportFlow = ai.defineFlow(
  {
    name: 'generatePlayerReportFlow',
    inputSchema: GeneratePlayerReportInputSchema,
    outputSchema: GeneratePlayerReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
