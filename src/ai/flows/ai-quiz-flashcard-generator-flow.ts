'use server';
/**
 * @fileOverview An AI agent for generating quiz questions or flashcards from study material.
 *
 * - aiQuizFlashcardGenerator - A function that handles the generation of study aids.
 * - AiQuizFlashcardGeneratorInput - The input type for the aiQuizFlashcardGenerator function.
 * - AiQuizFlashcardGeneratorOutput - The return type for the aiQuizFlashcardGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).min(3).max(5).describe('An array of 3 to 5 possible answers for the quiz question.'),
  correctAnswer: z.string().describe('The correct answer to the quiz question.'),
});

const QuizQuestionsOutputSchema = z.object({
  quizQuestions: z.array(QuizQuestionSchema).min(1).describe('An array of generated quiz questions.'),
});
type QuizQuestionsOutput = z.infer<typeof QuizQuestionsOutputSchema>;

const FlashcardSchema = z.object({
  front: z.string().describe('The front side of the flashcard (e.g., term or question).'),
  back: z.string().describe('The back side of the flashcard (e.g., definition or answer).'),
});

const FlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).min(1).describe('An array of generated flashcards.'),
});
type FlashcardsOutput = z.infer<typeof FlashcardsOutputSchema>;

const AiQuizFlashcardGeneratorInputSchema = z.object({
  studyMaterial: z.string().describe('The study material (notes, textbook chapters) in text format.'),
  outputFormat: z.enum(['quiz_questions', 'flashcards']).describe('The desired output format: "quiz_questions" for quizzes or "flashcards" for flashcards.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The desired difficulty level for the generated content.'),
});
export type AiQuizFlashcardGeneratorInput = z.infer<typeof AiQuizFlashcardGeneratorInputSchema>;

const AiQuizFlashcardGeneratorOutputSchema = z.object({
  quizQuestions: z.array(QuizQuestionSchema).optional().describe('An array of generated quiz questions, present if outputFormat was "quiz_questions".'),
  flashcards: z.array(FlashcardSchema).optional().describe('An array of generated flashcards, present if outputFormat was "flashcards".'),
});
export type AiQuizFlashcardGeneratorOutput = z.infer<typeof AiQuizFlashcardGeneratorOutputSchema>;

const generateQuizQuestionsPrompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: AiQuizFlashcardGeneratorInputSchema},
  output: {schema: QuizQuestionsOutputSchema},
  prompt: `You are an expert tutor that creates multiple-choice quiz questions.
  
  Based on the following study material, generate a set of {{difficulty}} difficulty multiple-choice quiz questions. Each question must have between 3 and 5 options, and exactly one correct answer. Ensure the questions and options are clear, concise, and directly relevant to the study material.
  
  Study Material:
  {{{studyMaterial}}}
  
  Difficulty Level: {{difficulty}}
  
  Provide the output in JSON format, strictly adhering to the following schema for an array of quiz questions. Do not include any other text or formatting outside the JSON.`,
});

const generateFlashcardsPrompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: AiQuizFlashcardGeneratorInputSchema},
  output: {schema: FlashcardsOutputSchema},
  prompt: `You are an expert tutor that creates flashcards.
  
  Based on the following study material, generate a set of {{difficulty}} difficulty flashcards. Each flashcard should have a 'front' (term or question) and a 'back' (definition or answer). Ensure the content is concise and helps in memorization.
  
  Study Material:
  {{{studyMaterial}}}
  
  Difficulty Level: {{difficulty}}
  
  Provide the output in JSON format, strictly adhering to the following schema for an array of flashcards. Do not include any other text or formatting outside the JSON.`,
});

const aiQuizFlashcardGeneratorFlow = ai.defineFlow(
  {
    name: 'aiQuizFlashcardGeneratorFlow',
    inputSchema: AiQuizFlashcardGeneratorInputSchema,
    outputSchema: AiQuizFlashcardGeneratorOutputSchema,
  },
  async input => {
    let result: AiQuizFlashcardGeneratorOutput = {};

    if (input.outputFormat === 'quiz_questions') {
      const {output} = await generateQuizQuestionsPrompt(input);
      if (!output) {
        throw new Error('Failed to generate quiz questions.');
      }
      result.quizQuestions = output.quizQuestions;
    } else if (input.outputFormat === 'flashcards') {
      const {output} = await generateFlashcardsPrompt(input);
      if (!output) {
        throw new Error('Failed to generate flashcards.');
      }
      result.flashcards = output.flashcards;
    }

    return result;
  }
);

export async function aiQuizFlashcardGenerator(input: AiQuizFlashcardGeneratorInput): Promise<AiQuizFlashcardGeneratorOutput> {
  return aiQuizFlashcardGeneratorFlow(input);
}
