'use client';

import { Card } from '@/types';
import { Plus, Edit3, Trash2, FileQuestion, MessageSquare } from 'lucide-react';

interface CardsEditorProps {
  cards: Card[];
  onUpdateCard?: (id: string, field: keyof Card, value: string) => void;
  onDeleteCard?: (id: string) => void;
  onAddCard?: () => void;
}

const noop = () => undefined;

export default function CardsEditor({ cards, onUpdateCard = noop, onDeleteCard = noop, onAddCard = noop }: CardsEditorProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-cyan-100 bg-white p-6 shadow-lg shadow-cyan-100/50 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-cyan-200/50">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl transition-all group-hover:scale-110" />

      <div className="relative">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 shadow-lg">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Карточки</h3>
              <p className="text-sm text-slate-600">Отредактируй вопросы и ответы до запуска в Study Mode</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAddCard}
            className="group/add flex items-center gap-2 rounded-xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 shadow-sm transition-all hover:scale-105 hover:border-cyan-300 hover:shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4 transition-transform group-hover/add:rotate-90" />
            Добавить карточку
          </button>
        </div>

        <div className="space-y-4">
          {cards.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center backdrop-blur-sm">
              <div className="rounded-full bg-slate-100 p-4">
                <FileQuestion className="h-8 w-8 text-slate-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">Пока нет карточек</p>
              <p className="mt-1 text-xs text-slate-400">Сгенерируй их через форму сверху</p>
            </div>
          )}

          {cards.map((card, index) => (
            <div
              key={card.id}
              className="group/card animate-slide-in rounded-xl border-2 border-slate-100 bg-gradient-to-br from-slate-50/50 to-white p-5 shadow-sm transition-all hover:border-cyan-200 hover:shadow-md"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                    {index + 1}
                  </span>
                  Карточка
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteCard(card.id)}
                  className="group/delete flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 opacity-0 transition-all hover:border-rose-300 hover:bg-rose-100 group-hover/card:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5 transition-transform group-hover/delete:scale-110" />
                  Удалить
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <FileQuestion className="h-3.5 w-3.5 text-indigo-500" />
                    Вопрос
                  </label>
                  <textarea
                    className="min-h-[100px] w-full resize-y rounded-xl border-2 border-slate-200 bg-white p-3 text-sm transition-all placeholder:text-slate-400 hover:border-indigo-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    placeholder="Введи вопрос..."
                    value={card.question}
                    onChange={(event) => onUpdateCard(card.id, 'question', event.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                    Ответ
                  </label>
                  <textarea
                    className="min-h-[100px] w-full resize-y rounded-xl border-2 border-slate-200 bg-white p-3 text-sm transition-all placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                    placeholder="Введи ответ..."
                    value={card.answer}
                    onChange={(event) => onUpdateCard(card.id, 'answer', event.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {cards.length > 0 && (
          <div className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              Всего карточек: <span className="font-bold text-indigo-600">{cards.length}</span>
            </p>
            <button
              type="button"
              onClick={onAddCard}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              Еще одну
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
