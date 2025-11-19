import { Card, GenerateRequest } from '@/types';

const GENERATE_ENDPOINT = '/api/generate';

export async function requestDeckGeneration(payload: GenerateRequest): Promise<Card[]> {
  const response = await fetch(GENERATE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Generation failed. Try again later.');
  }

  const data = (await response.json()) as { cards?: Card[] };
  return data.cards ?? [];
}
