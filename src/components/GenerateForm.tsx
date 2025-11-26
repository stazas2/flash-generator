'use client';

import { FormEvent, useState } from 'react';
import { Sparkles, RotateCcw, FileText, Sliders } from 'lucide-react';

interface GenerateFormProps {
  onGenerate?: (text: string, count: number) => void;
  isGenerating?: boolean;
  errorMessage?: string | null;
  rateLimitRemaining?: number | null;
}

export default function GenerateForm({ onGenerate, isGenerating, errorMessage, rateLimitRemaining }: GenerateFormProps) {
  const [text, setText] = useState('');
  const [count, setCount] = useState(20);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) {
      return;
    }

    onGenerate?.(text, count);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-8 shadow-lg shadow-indigo-100/50 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-indigo-200/50"
    >
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-400/10 blur-3xl transition-all group-hover:scale-110" />

      <div className="relative">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Сгенерировать новую колоду</h2>
              <p className="mt-1 text-sm text-slate-600">Вставь текст из конспекта и создай карточки с помощью AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2">
            <Sliders className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">{count} карточек</span>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="deck-text">
              <FileText className="h-4 w-4 text-indigo-500" />
              Исходный текст
            </label>
            <textarea
              id="deck-text"
              name="deck-text"
              className="mt-2 h-44 w-full resize-none rounded-xl border-2 border-slate-200 bg-slate-50/50 p-4 text-sm backdrop-blur-sm transition-all placeholder:text-slate-400 hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
              placeholder="Вставь сюда 1-2 абзаца учебника или конспекта..."
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="card-count">
                <Sliders className="h-4 w-4 text-indigo-500" />
                Количество карточек
              </label>
              <span className="text-lg font-bold text-indigo-600">{count}</span>
            </div>
            <input
              id="card-count"
              type="range"
              min={10}
              max={50}
              step={5}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-indigo-500 [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Лимит: 10-50 карточек</span>
              {typeof rateLimitRemaining === 'number' && (
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                  Осталось генераций: {rateLimitRemaining}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="submit"
            disabled={isGenerating || !text.trim()}
            className="group/btn relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : 'group-hover/btn:rotate-12'} transition-transform`} />
              {isGenerating ? 'Генерируем...' : 'Generate'}
            </span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity group-hover/btn:opacity-100" />
          </button>
          <button
            type="button"
            className="group/reset flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
            onClick={() => {
              setText('');
              setCount(20);
            }}
          >
            <RotateCcw className="h-4 w-4 transition-transform group-hover/reset:rotate-180" />
            Сбросить
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <div className="text-rose-600">⚠️</div>
            <p className="text-sm font-medium text-rose-700">{errorMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
}
