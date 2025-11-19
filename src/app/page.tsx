'use client';

import { useMemo, useState } from 'react';
import CardsEditor from '@/components/CardsEditor';
import DeckList from '@/components/DeckList';
import ExportImport from '@/components/ExportImport';
import FeedbackForm from '@/components/FeedbackForm';
import GenerateForm from '@/components/GenerateForm';
import { mockDecks } from '@/data/mockDecks';
import { Card, Deck } from '@/types';

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `deck-${Date.now()}`;
};

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>(mockDecks);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(mockDecks[0] ?? null);

  const cards = useMemo(() => selectedDeck?.cards ?? [], [selectedDeck]);

  const createCardsFromText = (text: string, count: number): Card[] => {
    if (!text.trim()) {
      return cards.slice(0, count);
    }

    const sentences = text
      .split(/[.!?]+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);

    return sentences.slice(0, count).map((sentence, index) => ({
      id: `${Date.now()}-${index}`,
      question: `Что важно помнить про: "${sentence.slice(0, 40)}${sentence.length > 40 ? '…' : ''}"?`,
      answer: sentence,
    }));
  };

  const handleGenerate = (text: string, count: number) => {
    const newDeck: Deck = {
      id: generateId(),
      name: `Новая колода #${decks.length + 1}`,
      description: `Сгенерировано из ${text.slice(0, 30)}${text.length > 30 ? '...' : ''}`,
      createdAt: new Date().toISOString(),
      cards: createCardsFromText(text, count),
    };

    setDecks((prev) => [...prev, newDeck]);
    setSelectedDeck(newDeck);
  };

  const handleCreateDeck = () => {
    const newDeck: Deck = {
      id: generateId(),
      name: `Черновик #${decks.length + 1}`,
      createdAt: new Date().toISOString(),
      cards: [],
    };
    setDecks((prev) => [...prev, newDeck]);
    setSelectedDeck(newDeck);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row">
        <div className="flex-1 space-y-6">
          <GenerateForm onGenerate={handleGenerate} />
          <CardsEditor cards={cards} />
          <FeedbackForm />
        </div>
        <div className="flex w-full flex-col gap-6 lg:w-2/5">
          <DeckList decks={decks} onCreateDeck={handleCreateDeck} onSelectDeck={setSelectedDeck} />
          <ExportImport />
        </div>
      </div>
    </main>
  );
}
