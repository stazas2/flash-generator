'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/types';
import { analytics } from '@/utils/analytics';
import { Brain, Eye, Check, X, RotateCcw, Trophy, Target, Sparkles } from 'lucide-react';

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

  const progressPercent = useMemo(() => {
    return (currentIndex / cards.length) * 100;
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
    analytics.track({
      event: 'study_restart',
      timestamp: Date.now(),
      props: { deckName, total: cards.length },
    });
  };

  useEffect(() => {
    analytics.track({
      event: 'study_start',
      timestamp: Date.now(),
      props: { deckName, total: cards.length },
    });
  }, [deckName, cards.length]);

  useEffect(() => {
    if (!isComplete || results.length === 0) {
      return;
    }

    const correct = results.filter(Boolean).length;
    analytics.track({
      event: 'study_complete',
      timestamp: Date.now(),
      props: { deckName, total: cards.length, correct, accuracy: correct / results.length },
    });
  }, [isComplete, results, deckName, cards.length]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <Brain className="h-8 w-8 text-slate-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500">Нет карточек для изучения</p>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-8 shadow-lg shadow-emerald-100/50 backdrop-blur-sm transition-all">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-400/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <Target className="h-4 w-4" />
                Режим учёбы
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">{deckName}</h3>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-bold text-slate-700">Карточка {progressLabel}</span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {!isComplete ? (
          <div className="space-y-6">
            {/* Question Card */}
            <div className="animate-slide-in overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-lg">
              <div className="mb-4 flex items-center justify-center">
                <div className="rounded-full bg-indigo-100 px-4 py-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Вопрос</p>
                </div>
              </div>
              <p className="text-center text-lg font-semibold leading-relaxed text-slate-900">{cards[currentIndex]?.question}</p>

              {showAnswer ? (
                <div className="mt-8 animate-slide-in overflow-hidden rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Ответ</p>
                  </div>
                  <p className="text-base leading-relaxed text-slate-800">{cards[currentIndex]?.answer}</p>
                </div>
              ) : (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAnswer(true)}
                    className="group/show flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95"
                  >
                    <Eye className="h-4 w-4 transition-transform group-hover/show:scale-110" />
                    Показать ответ
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                disabled={!showAnswer}
                className="group/yes flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 px-6 py-4 text-sm font-bold text-emerald-700 shadow-sm transition-all hover:scale-105 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-200/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                onClick={() => handleNext(true)}
              >
                <Check className="h-5 w-5 transition-transform group-hover/yes:scale-110" />
                Знаю
              </button>
              <button
                type="button"
                disabled={!showAnswer}
                className="group/no flex items-center justify-center gap-2 rounded-xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 px-6 py-4 text-sm font-bold text-rose-700 shadow-sm transition-all hover:scale-105 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-200/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                onClick={() => handleNext(false)}
              >
                <X className="h-5 w-5 transition-transform group-hover/no:scale-110" />
                Не знаю
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-slide-in space-y-6 text-center">
            {/* Completion Card */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-10">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-2xl">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-slate-900">Сессия завершена!</h4>
              <div className="mt-6 flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{results.filter(Boolean).length}</p>
                  <p className="mt-1 text-sm font-medium text-slate-600">Выучено</p>
                </div>
                <div className="h-12 w-px bg-slate-300" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-400">{results.filter((r) => !r).length}</p>
                  <p className="mt-1 text-sm font-medium text-slate-600">Пропущено</p>
                </div>
                <div className="h-12 w-px bg-slate-300" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{Math.round((results.filter(Boolean).length / results.length) * 100)}%</p>
                  <p className="mt-1 text-sm font-medium text-slate-600">Точность</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="group/restart flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98]"
              onClick={restart}
            >
              <RotateCcw className="h-4 w-4 transition-transform group-hover/restart:rotate-180" />
              Повторить сессию
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
