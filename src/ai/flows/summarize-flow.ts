'use server';
/**
 * @fileOverview An AI flow to summarize opportunity descriptions.
 *
 * - summarizeDescription - A function that takes a description and returns a one-sentence summary.
 * - SummarizeDescriptionInput - The input type for the summarizeDescription function.
 * - SummarizeDescriptionOutput - The return type for the summarizeDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeDescriptionInputSchema = z.object({
  description: z.string().describe('The full description of the opportunity.'),
});
export type SummarizeDescriptionInput = z.infer<typeof SummarizeDescriptionInputSchema>;

const SummarizeDescriptionOutputSchema = z.string().describe('A one-sentence summary of the description.');
export type SummarizeDescriptionOutput = z.infer<typeof SummarizeDescriptionOutputSchema>;

export async function summarizeDescription(input: SummarizeDescriptionInput): Promise<SummarizeDescriptionOutput> {
  return summarizeDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDescriptionPrompt',
  input: {schema: SummarizeDescriptionInputSchema},
  output: {schema: SummarizeDescriptionOutputSchema},
  prompt: `Summarize the following opportunity description into a single, compelling sentence that would fit on a small card.

Description:
{{{description}}}`,
});

const summarizeDescriptionFlow = ai.defineFlow(
  {
    name: 'summarizeDescriptionFlow',
    inputSchema: SummarizeDescriptionInputSchema,
    outputSchema: SummarizeDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
