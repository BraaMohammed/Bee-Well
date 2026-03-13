import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOllama } from 'ai-sdk-ollama';
import { createGroq } from '@ai-sdk/groq';

/**
 * Creates an AI model provider initialized for Client-Side usage.
 * Bypasses the need for server-side Environment Variables by accepting keys directly.
 */
export function getClientModel(provider: 'google' | 'ollama' | 'groq', modelId: string, options: { googleApiKey?: string; ollamaUrl?: string; groqApiKey?: string }) {
    if (provider === 'google') {
        if (!options.googleApiKey) {
            throw new Error('Google API Key is required for Gemini models');
        }

        console.log(`🤖 [AI Provider] Google Gemini | Model: ${modelId}`);

        const google = createGoogleGenerativeAI({
            apiKey: options.googleApiKey,
        });

        return google(modelId);
    }

    if (provider === 'ollama') {
        // ai-sdk-ollama appends its own /api paths internally, so we pass just the base URL
        const baseUrl = (options.ollamaUrl || 'http://localhost:11434').replace(/\/api$/, '').replace(/\/$/, '');

        console.log(`🦙 [AI Provider] Ollama | Model: ${modelId} | URL: ${baseUrl}`);

        const ollama = createOllama({
            baseURL: baseUrl,
        });

        return ollama(modelId);
    }

    if (provider === 'groq') {
        if (!options.groqApiKey) {
            throw new Error('Groq API Key is required for Groq models');
        }

        console.log(`⚡ [AI Provider] Groq | Model: ${modelId}`);

        const groq = createGroq({
            apiKey: options.groqApiKey,
        });

        return groq(modelId);
    }

    throw new Error(`Unsupported provider: ${provider}`);
}
