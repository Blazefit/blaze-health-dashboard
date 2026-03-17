import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateWithClaude(params: {
  model?: string;
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens?: number;
}) {
  const response = await anthropic.messages.create({
    model: params.model || 'claude-sonnet-4-20250514',
    max_tokens: params.maxTokens || 4096,
    system: params.system,
    messages: params.messages,
  });
  return response;
}

export async function streamWithClaude(params: {
  model?: string;
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens?: number;
}) {
  const stream = anthropic.messages.stream({
    model: params.model || 'claude-sonnet-4-20250514',
    max_tokens: params.maxTokens || 4096,
    system: params.system,
    messages: params.messages,
  });
  return stream;
}

export { anthropic };
