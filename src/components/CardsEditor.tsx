'use client';

import { Card } from '@/types';

interface CardsEditorProps {
  cards: Card[];
  onUpdateCard?: (id: string, field: keyof Card, value: string) => void;
  onDeleteCard?: (id: string) => void;
  onAddCard?: () => void;
}

const noop = () => undefined;

export default function CardsEditor({ cards, onUpdateCard = noop, onDeleteCard = noop, onAddCard = noop }: CardsEditorProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Карточки</h3>
          <p className="text-sm text-slate-500">Отредактируй вопросы и ответы до запуска в Study Mode.</p>
        </div>
        <button
          type="button"
          onClick={onAddCard}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
        >
          + Добавить карточку
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2">Вопрос</th>
              <th className="px-3 py-2">Ответ</th>
              <th className="px-3 py-2 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cards.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-slate-400">
                  Пока нет карточек. Сгенерируй их через форму сверху.
                </td>
              </tr>
            )}
            {cards.map((card) => (
              <tr key={card.id}>
                <td className="px-3 py-2 align-top">
                  <textarea
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm focus:border-sky-500 focus:outline-none"
                    value={card.question}
                    onChange={(event) => onUpdateCard(card.id, 'question', event.target.value)}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <textarea
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm focus:border-sky-500 focus:outline-none"
                    value={card.answer}
                    onChange={(event) => onUpdateCard(card.id, 'answer', event.target.value)}
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onDeleteCard(card.id)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
