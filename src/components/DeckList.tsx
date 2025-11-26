'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Deck } from '@/types';
import { Layers, Plus, Edit, GraduationCap, Package, ExternalLink } from 'lucide-react';

interface DeckListProps {
  decks: Deck[];
  onCreateDeck?: () => void;
  onSelectDeck?: (deck: Deck) => void;
}

export default function DeckList({ decks, onCreateDeck, onSelectDeck }: DeckListProps) {
  const router = useRouter();

  return (
    <section className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/50 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-violet-200/50">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-gradient-to-br from-violet-400/10 to-fuchsia-400/10 blur-3xl transition-all group-hover:scale-110" />

      <div className="relative">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-2.5 shadow-lg">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Твои колоды</h2>
              <p className="mt-1 text-sm text-slate-600">Редактируй или запускай Study Mode</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="group/new flex items-center gap-2 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm transition-all hover:scale-105 hover:border-violet-300 hover:shadow-md active:scale-95"
              onClick={onCreateDeck}
            >
              <Plus className="h-4 w-4 transition-transform group-hover/new:rotate-90" />
              Новая колода
            </button>
            <Link
              href="/landing"
              className="flex items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Landing
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {decks.map((deck, index) => (
            <div
              key={deck.id}
              className="group/deck animate-slide-in overflow-hidden rounded-xl border-2 border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-5 shadow-sm transition-all hover:scale-[1.02] hover:border-violet-200 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 transition-colors group-hover/deck:text-violet-700">
                    {deck.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {deck.description ?? 'Карточки, готовые к редактированию'}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700 transition-colors group-hover/deck:bg-violet-200">
                  {index + 1}
                </div>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">
                  {deck.cards.length} карточек
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="group/edit flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95"
                  onClick={() => {
                    onSelectDeck?.(deck);
                    router.push(`/deck/${deck.id}`);
                  }}
                >
                  <Edit className="h-4 w-4 transition-transform group-hover/edit:scale-110" />
                  Редактировать
                </button>
                <button
                  type="button"
                  className="group/study relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/40 active:scale-95"
                  onClick={() => router.push(`/deck/${deck.id}/study`)}
                >
                  <GraduationCap className="relative z-10 h-4 w-4 transition-transform group-hover/study:scale-110" />
                  <span className="relative z-10">Study</span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 opacity-0 transition-opacity group-hover/study:opacity-100" />
                </button>
              </div>
            </div>
          ))}

          {decks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center backdrop-blur-sm">
              <div className="rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 p-4">
                <Layers className="h-8 w-8 text-violet-500" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-600">Список колод пуст</p>
              <p className="mt-1 text-xs text-slate-400">Сгенерируй свою первую колоду!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
