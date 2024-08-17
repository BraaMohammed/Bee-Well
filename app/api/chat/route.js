import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req) {


    const { messages } = await req.json();

    const result = await streamText({
        model: anthropic('claude-3-haiku-20240307'),
        messages,
    });



   return result.toAIStreamResponse();

}