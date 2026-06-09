'use server';
/**
 * @fileOverview An AI academic assistant that helps students summarize notes, explain topics, and answer queries from academic documents.
 *
 * - aiStudyAssistant - A function that handles academic queries based on a provided document.
 * - AiStudyAssistantInput - The input type for the aiStudyAssistant function.
 * - AiStudyAssistantOutput - The return type for the aiStudyAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiStudyAssistantInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The academic document (e.g., lecture notes, PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  query: z.string().describe('The student\'s specific request (e.g., "Summarize this document", "Explain concept X", "What is Y?").'),
});
export type AiStudyAssistantInput = z.infer<typeof AiStudyAssistantInputSchema>;

const AiStudyAssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response, summarizing, explaining, or answering questions based solely on the provided document.'),
});
export type AiStudyAssistantOutput = z.infer<typeof AiStudyAssistantOutputSchema>;

export async function aiStudyAssistant(input: AiStudyAssistantInput): Promise<AiStudyAssistantOutput> {
  return aiStudyAssistantFlow(input);
}

const aiStudyAssistantPrompt = ai.definePrompt({
  name: 'aiStudyAssistantPrompt',
  input: {schema: AiStudyAssistantInputSchema},
  output: {schema: AiStudyAssistantOutputSchema},
  prompt: `You are an AI academic assistant designed to help students understand and review their course material.
Your primary goal is to provide accurate, concise, and helpful information based *only* on the provided academic document.
Do not invent information or use external knowledge. If you cannot find the answer in the provided material, politely state that the information is not present in the document.

Here is the academic document:
{{media url=documentDataUri}}

The student's request is: "{{{query}}}"

Please provide your response in a clear and well-structured manner, directly addressing the student's request based on the content of the document.`,
});

const aiStudyAssistantFlow = ai.defineFlow(
  {
    name: 'aiStudyAssistantFlow',
    inputSchema: AiStudyAssistantInputSchema,
    outputSchema: AiStudyAssistantOutputSchema,
  },
  async input => {
    const {output} = await aiStudyAssistantPrompt(input);
    if (!output) {
      throw new Error('AI assistant failed to generate a response.');
    }
    return output;
  }
);
