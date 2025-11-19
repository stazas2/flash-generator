'use client';

import { FormEvent, useState } from 'react';

interface GenerateFormProps {
  onGenerate?: (text: string, count: number) => void;
  isGenerating?: boolean;
}

export default function GenerateForm({ onGenerate, isGenerating }: GenerateFormProps) {
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
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Сгенерировать новую колоду</h2>
          <p className="text-sm text-slate-500">Вставь текст из конспекта, выбери количество карточек и нажми Generate.</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <span>{count} карточек</span>
        </div>
      </div>

      <label className="block text-sm font-medium text-slate-700" htmlFor="deck-text">
        Исходный текст
      </label>
      <textarea
        id="deck-text"
        name="deck-text"
        className="mt-1 h-40 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm focus:border-sky-500 focus:outline-none"
        placeholder="Вставь сюда 1-2 абзаца учебника или конспекта"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700" htmlFor="card-count">
          Количество карточек
        </label>
        <input
          id="card-count"
          type="range"
          min={10}
          max={50}
          step={5}
          className="mt-2 w-full"
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
        />
        <p className="text-xs text-slate-500">Пока что лимит — 10-50 карточек за одну генерацию.</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={isGenerating}
          className="flex-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? 'Генерируем...' : 'Generate'}
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
          onClick={() => {
            setText('');
            setCount(20);
          }}
        >
          Сбросить
        </button>
      </div>
    </form>
  );
}
