'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Deck } from '@/types';

interface DeckListProps {
  decks: Deck[];
  onCreateDeck?: () => void;
  onSelectDeck?: (deck: Deck) => void;
}

export default function DeckList({ decks, onCreateDeck, onSelectDeck }: DeckListProps) {
  const router = useRouter();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Твои колоды</h2>
          <p className="text-sm text-slate-500">Переходи к редактированию или сразу запускай Study Mode.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
            onClick={onCreateDeck}
          >
            + Новая колода
          </button>
          <Link
            href="/landing"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Landing
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {decks.map((deck) => (
          <div key={deck.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="text-base font-semibold text-slate-800">{deck.name}</h3>
            <p className="text-sm text-slate-500">{deck.description ?? 'Карточки, готовые к редактированию.'}</p>
            <p className="mt-2 text-xs text-slate-400">{deck.cards.length} карточек</p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
                onClick={() => {
                  onSelectDeck?.(deck);
                  router.push(`/deck/${deck.id}`);
                }}
              >
                Редактировать
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white"
                onClick={() => router.push(`/deck/${deck.id}/study`)}
              >
                Study
              </button>
            </div>
          </div>
        ))}

        {decks.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-400">
            Список пуст. Сгенерируй свою первую колоду!
          </p>
        )}
      </div>
    </section>
  );
}
