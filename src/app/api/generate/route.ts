import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { Card } from '@/types';

const MIN_COUNT = 5;
const MAX_COUNT = 50;
const MIN_TEXT_LENGTH = 50;
const MAX_TEXT_LENGTH = 15_000;
const MAX_PROMPT_LENGTH = 8_000;
const DEFAULT_DAILY_LIMIT = 3;

const openai =
  process.env.OPENAI_API_KEY != null
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL })
    : null;

class ValidationError extends Error {}

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const sanitizeText = (text: string) => text.replace(/"""/g, '"').trim();

type RateLimitRecord = { count: number; resetAt: number };
const rateLimits = new Map<string, RateLimitRecord>();

const checkRateLimit = (
  identifier: string,
  limit: number = DEFAULT_DAILY_LIMIT,
  windowMs: number = 24 * 60 * 60 * 1000
): { allowed: boolean; remaining: number; resetAt: number } => {
  const now = Date.now();
  const record = rateLimits.get(identifier);

  if (!record || now > record.resetAt) {
    const next = { count: 1, resetAt: now + windowMs };
    rateLimits.set(identifier, next);
    return { allowed: true, remaining: limit - 1, resetAt: next.resetAt };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
};

const validateGenerateRequest = (rawText: unknown, rawCount: unknown) => {
  if (!rawText || typeof rawText !== 'string') {
    throw new ValidationError('Передайте текст для генерации карточек.');
  }

  const sanitizedText = sanitizeText(rawText);

  if (sanitizedText.length < MIN_TEXT_LENGTH) {
    throw new ValidationError(`Текст слишком короткий. Минимум ${MIN_TEXT_LENGTH} символов.`);
  }

  if (sanitizedText.length > MAX_TEXT_LENGTH) {
    throw new ValidationError(`Текст слишком длинный. Максимум ${MAX_TEXT_LENGTH} символов.`);
  }

  const parsedCount = typeof rawCount === 'number' ? rawCount : Number(rawCount);
  const normalizedCount = Math.max(MIN_COUNT, Math.min(Number.isFinite(parsedCount) ? parsedCount : 20, MAX_COUNT));

  return { sanitizedText, normalizedCount };
};

const buildPrompt = (text: string, count: number) => `Ты — преподаватель, который готовит лаконичные флэшкарты.
Вот учебный материал:
"""
${text.slice(0, MAX_PROMPT_LENGTH)}
"""

Сгенерируй ${count} карточек в формате JSON.

Требования:
- Покрой ключевые понятия, термины, даты, определения
- Не выдумывай факты, используй только текст выше
- Вопросы делай конкретными, избегай тривиальных "Что такое X?"
- Ответы держи короткими (1-2 предложения), без лишней воды

Ответ строго в JSON:
{
  "cards": [
    { "question": "...", "answer": "..." }
  ]
}`;

const extractCards = (raw: string, count: number): Card[] => {
  let parsed: { cards?: { question?: string; answer?: string }[] };

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Не удалось разобрать ответ модели.');
  }

  const cards = (parsed.cards ?? [])
    .slice(0, count)
    .map((card, index) => {
      const question = (card.question ?? '').trim();
      const answer = (card.answer ?? '').trim();

      return {
        id: generateId(),
        question: question || `Вопрос ${index + 1}`,
        answer: answer || 'Ответ не получен — проверьте текст вручную.',
      };
    })
    .filter((card) => card.question.length > 0 || card.answer.length > 0);

  if (!cards.length) {
    throw new Error('Модель не вернула карточки. Попробуйте другой текст или уменьшите количество.');
  }

  return cards;
};

const generateWithOpenAI = async (text: string, count: number): Promise<Card[]> => {
  if (!openai) {
    throw new Error('OpenAI API key не настроен на сервере.');
  }

  const prompt = buildPrompt(text, count);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.6,
    max_tokens: Math.min(220 * count, 4000),
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Пустой ответ от модели. Попробуйте ещё раз.');
  }

  return extractCards(content, count);
};

const mapErrorToStatus = (error: unknown) => {
  if (error instanceof ValidationError) {
    return { status: 400, message: error.message };
  }

  if (typeof error === 'object' && error && 'status' in error && (error as { status?: number }).status === 429) {
    return { status: 429, message: 'Превышен лимит запросов. Попробуйте через минуту.' };
  }

  const defaultMessage =
    error instanceof Error ? error.message : 'AI сервис временно недоступен. Попробуйте позже или сократите текст.';

  return { status: 500, message: defaultMessage };
};

export async function POST(request: Request) {
  let payload: { text?: unknown; count?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON в запросе.' }, { status: 400 });
  }

  try {
    const { sanitizedText, normalizedCount } = validateGenerateRequest(payload.text, payload.count);
    const identifier = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    const { allowed, remaining, resetAt } = checkRateLimit(identifier);

    if (!allowed) {
      return NextResponse.json(
        {
          error: `Достигнут дневной лимит генераций (${DEFAULT_DAILY_LIMIT}). Попробуйте позже.`,
          rateLimitRemaining: 0,
          resetAt,
        },
        { status: 429 }
      );
    }

    const cards = await generateWithOpenAI(sanitizedText, normalizedCount);
    return NextResponse.json({ cards, rateLimitRemaining: remaining });
  } catch (error) {
    if (!(error instanceof ValidationError)) {
      console.error('[api/generate] AI generation failed', error);
    }

    const { status, message } = mapErrorToStatus(error);
    return NextResponse.json({ error: message }, { status });
  }
}
