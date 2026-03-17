import OpenAI from 'openai';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Blaze Health Dashboard',
  },
});

// Map our model names to OpenRouter model IDs
function resolveModel(model?: string): string {
  switch (model) {
    case 'claude-opus-4-6':
    case 'opus':
      return 'anthropic/claude-opus-4';
    case 'claude-sonnet-4-20250514':
    case 'sonnet':
    default:
      return 'anthropic/claude-sonnet-4';
  }
}

export async function generateWithClaude(params: {
  model?: string;
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens?: number;
}) {
  const response = await openrouter.chat.completions.create({
    model: resolveModel(params.model),
    max_tokens: params.maxTokens || 4096,
    messages: [
      { role: 'system', content: params.system },
      ...params.messages,
    ],
  });

  // Return in a shape compatible with what the API routes expect
  return {
    content: [
      {
        type: 'text' as const,
        text: response.choices[0]?.message?.content || '',
      },
    ],
    model: response.model,
    usage: response.usage,
  };
}

export async function streamWithClaude(params: {
  model?: string;
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens?: number;
}) {
  const stream = await openrouter.chat.completions.create({
    model: resolveModel(params.model),
    max_tokens: params.maxTokens || 4096,
    stream: true,
    messages: [
      { role: 'system', content: params.system },
      ...params.messages,
    ],
  });

  return stream;
}

export { openrouter };
