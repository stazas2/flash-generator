'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';
import StudyView from '@/components/StudyView';
import { findMockDeck } from '@/data/mockDecks';
import { Deck } from '@/types';
import { loadDecks } from '@/utils/storage';

export default function StudyPage() {
  const params = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const deckId = params?.id;
    if (!deckId) {
      return;
    }

    const storedDecks = loadDecks();
    const match = storedDecks.find((item) => item.id === deckId) ?? findMockDeck(deckId) ?? null;
    startTransition(() => {
      setDeck(match);
      setIsLoading(false);
    });
  }, [params]);

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500">Загружаем режим учёбы…</div>;
  }

  if (!deck) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-lg text-slate-600">Колода не найдена. Вернись на главную страницу.</p>
          <Link href="/" className="mt-4 inline-flex rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white">
            ← На главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Study Mode</p>
            <h1 className="text-3xl font-semibold text-slate-900">{deck.name}</h1>
          </div>
          <Link href={`/deck/${deck.id}`} className="text-sm text-slate-600">
            ← К редактору
          </Link>
        </div>
        <StudyView deckName={deck.name} cards={deck.cards} />
      </div>
    </main>
  );
}
