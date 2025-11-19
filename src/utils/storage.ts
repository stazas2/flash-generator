import { Deck } from '@/types';

const STORAGE_KEY = 'flash-generator:decks';

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage;

const readRaw = () => {
  if (!canUseStorage()) {
    return '[]';
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? '[]';
  } catch (error) {
    console.warn('[storage] Failed to read decks', error);
    return '[]';
  }
};

const writeRaw = (value: string) => {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch (error) {
    console.warn('[storage] Failed to persist decks', error);
  }
};

export function loadDecks(fallback: Deck[] = []): Deck[] {
  try {
    const parsed = JSON.parse(readRaw());
    return Array.isArray(parsed) ? (parsed as Deck[]) : fallback;
  } catch {
    return fallback;
  }
}

export function persistDecks(decks: Deck[]): void {
  writeRaw(JSON.stringify(decks));
}

export function saveDeck(deck: Deck): Deck[] {
  const decks = loadDecks();
  const index = decks.findIndex((existing) => existing.id === deck.id);

  if (index >= 0) {
    decks[index] = deck;
  } else {
    decks.push(deck);
  }

  persistDecks(decks);
  return decks;
}

export function deleteDeck(id: string): Deck[] {
  const decks = loadDecks().filter((deck) => deck.id !== id);
  persistDecks(decks);
  return decks;
}

export function resetDecks(): void {
  writeRaw('[]');
}
