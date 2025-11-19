'use client';

import { FormEvent, useState } from 'react';
import { analytics } from '@/utils/analytics';

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
    return <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">Спасибо! Мы уже смотрим твой фидбек.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold">Как тебе качество карточек?</h3>
      <p className="text-sm text-slate-500">Поставь оценку и расскажи, что улучшить.</p>

      <label className="mt-4 block text-sm font-medium" htmlFor="feedback-slider">
        Оценка качества: {rating}/5
      </label>
      <input
        id="feedback-slider"
        type="range"
        min={1}
        max={5}
        value={rating}
        onChange={(event) => setRating(Number(event.target.value))}
        className="mt-2 w-full"
      />

      <textarea
        className="mt-4 h-24 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-sky-500 focus:outline-none"
        placeholder="Опиши, что понравилось или что бесит"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
      >
        Отправить
      </button>
    </form>
  );
}
