'use client';

import Link from 'next/link';
import { startTransition, useEffect, useMemo, useState } from 'react';
import CardsEditor from '@/components/CardsEditor';
import { findMockDeck } from '@/data/mockDecks';
import { Card, Deck } from '@/types';
import { loadDecks, saveDeck } from '@/utils/storage';

interface DeckPageProps {
  params: { id: string };
}

export default function DeckPage({ params }: DeckPageProps) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedDecks = loadDecks();
    const match = storedDecks.find((item) => item.id === params.id) ?? findMockDeck(params.id) ?? null;
    startTransition(() => {
      setDeck(match);
      setIsLoading(false);
    });
  }, [params.id]);

  const cards = useMemo(() => deck?.cards ?? [], [deck]);

  const syncDeck = (updated: Deck) => {
    saveDeck(updated);
    setDeck(updated);
  };

  const handleUpdateCard = (id: string, field: keyof Card, value: string) => {
    if (!deck) {
      return;
    }

    const updatedDeck: Deck = {
      ...deck,
      cards: deck.cards.map((card) => (card.id === id ? { ...card, [field]: value } : card)),
    };

    syncDeck(updatedDeck);
  };

  const handleDeleteCard = (id: string) => {
    if (!deck) {
      return;
    }

    const updatedDeck: Deck = {
      ...deck,
      cards: deck.cards.filter((card) => card.id !== id),
    };

    syncDeck(updatedDeck);
  };

  const handleAddCard = () => {
    if (!deck) {
      return;
    }

    const newCard: Card = {
      id: `${deck.id}-${Date.now()}`,
      question: 'Новый вопрос',
      answer: 'Ответ...',
    };

    syncDeck({ ...deck, cards: [...deck.cards, newCard] });
  };

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500">Загружаем колоду…</div>;
  }

  if (!deck) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-lg text-slate-600">Колода не найдена. Вернись на главную и создай новую.</p>
          <Link href="/" className="mt-4 inline-flex rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white">
            ← На главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Редактирование колоды</p>
            <h1 className="text-3xl font-semibold text-slate-900">{deck.name}</h1>
          </div>
          <div className="flex gap-3 text-sm text-slate-600">
            <Link href={`/deck/${deck.id}/study`}>Запустить Study</Link>
            <Link href="/">← Вернуться</Link>
          </div>
        </div>
        <CardsEditor cards={cards} onUpdateCard={handleUpdateCard} onDeleteCard={handleDeleteCard} onAddCard={handleAddCard} />
      </div>
    </main>
  );
}
