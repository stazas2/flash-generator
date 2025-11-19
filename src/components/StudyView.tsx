'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/types';

interface StudyViewProps {
  cards: Card[];
  deckName: string;
}

export default function StudyView({ cards, deckName }: StudyViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const progressLabel = useMemo(() => {
    return `${Math.min(currentIndex + 1, cards.length)} / ${cards.length}`;
  }, [currentIndex, cards.length]);

  const isComplete = currentIndex >= cards.length;

  const handleNext = (didKnow: boolean) => {
    if (isComplete) {
      return;
    }

    setResults((prev) => [...prev, didKnow]);
    setCurrentIndex((prev) => prev + 1);
    setShowAnswer(false);
  };

  const restart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setResults([]);
  };

  if (cards.length === 0) {
    return <p className="rounded-lg bg-slate-50 p-4 text-center text-slate-500">Нет карточек для изучения.</p>;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Режим учёбы</p>
          <h3 className="text-xl font-semibold">{deckName}</h3>
        </div>
        <span className="text-sm font-medium text-slate-700">Карточка {progressLabel}</span>
      </div>

      {!isComplete ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm uppercase tracking-wide text-slate-400">Вопрос</p>
            <p className="mt-3 text-lg font-medium text-slate-800">{cards[currentIndex]?.question}</p>

            {showAnswer ? (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-white p-4 text-left">
                <p className="text-xs uppercase tracking-wide text-emerald-500">Ответ</p>
                <p className="mt-2 text-base text-slate-800">{cards[currentIndex]?.answer}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAnswer(true)}
                className="mt-6 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Показать ответ
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700"
              onClick={() => handleNext(true)}
            >
              Знаю ✓
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg border border-rose-500 px-4 py-2 text-sm font-semibold text-rose-600"
              onClick={() => handleNext(false)}
            >
              Не знаю ✗
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <div>
            <h4 className="text-xl font-semibold">Сессия завершена</h4>
            <p className="text-slate-500">{results.filter(Boolean).length} из {results.length} карточек выучены.</p>
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={restart}
          >
            Повторить
          </button>
        </div>
      )}
    </div>
  );
}
