'use client';

import { FormEvent, useState } from 'react';
import { analytics } from '@/utils/analytics';
import { MessageCircle, Send, Star, CheckCircle2 } from 'lucide-react';

export default function FeedbackForm() {
  const [rating, setRating] = useState(3);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    analytics.track({
      event: 'feedback_submitted',
      props: { rating, hasMessage: Boolean(message.trim()) },
      timestamp: Date.now(),
    });
    setSubmitted(true);
    setMessage('');
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-lg">
        <div className="rounded-full bg-emerald-500 p-2">
          <CheckCircle2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-emerald-800">Спасибо за фидбек!</p>
          <p className="text-sm text-emerald-700">Мы уже смотрим твоё сообщение</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-white p-6 shadow-lg shadow-amber-100/50 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-amber-200/50"
    >
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-amber-400/10 to-orange-400/10 blur-3xl transition-all group-hover:scale-110" />

      <div className="relative">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 shadow-lg">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Как тебе качество карточек?</h3>
            <p className="text-sm text-slate-600">Поставь оценку и расскажи, что улучшить</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="feedback-slider">
                <Star className="h-4 w-4 text-amber-500" />
                Оценка качества
              </label>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 transition-colors ${
                      i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-bold text-amber-600">{rating}/5</span>
              </div>
            </div>
            <input
              id="feedback-slider"
              type="range"
              min={1}
              max={5}
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-amber-200 to-orange-200 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-500 [&::-webkit-slider-thumb]:to-orange-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700" htmlFor="feedback-message">
              <MessageCircle className="h-4 w-4 text-indigo-500" />
              Твой комментарий
            </label>
            <textarea
              id="feedback-message"
              className="h-28 w-full resize-none rounded-xl border-2 border-slate-200 bg-slate-50/50 p-4 text-sm transition-all placeholder:text-slate-400 hover:border-amber-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-100"
              placeholder="Опиши, что понравилось или что можно улучшить..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="group/send mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98]"
        >
          <Send className="h-4 w-4 transition-transform group-hover/send:translate-x-1" />
          Отправить фидбек
        </button>
      </div>
    </form>
  );
}
