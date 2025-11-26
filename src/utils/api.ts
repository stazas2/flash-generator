import { Card, GenerateRequest, GenerateResponse } from '@/types';

const GENERATE_ENDPOINT = '/api/generate';

export async function requestDeckGeneration(payload: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch(GENERATE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = 'Generation failed. Try again later.';
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) {
        errorMessage = data.error;
      }
    } catch {
      // ignore parsing errors
    }
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as { cards?: Card[]; rateLimitRemaining?: number };
  return {
    cards: data.cards ?? [],
    rateLimitRemaining: data.rateLimitRemaining,
  };
}
