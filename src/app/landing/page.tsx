import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">AI Flashcard Generator</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Перестань тратить часы на создание карточек</h1>
          <p className="text-lg text-slate-300">
            Вставь конспект — получи готовую колоду за 10 секунд. Без регистрации, с приватным хранением в браузере.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-full bg-sky-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/40"
          >
            Начать бесплатно
          </Link>
        </header>

        <section className="mt-16 grid gap-10 rounded-3xl bg-slate-900/70 p-10 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Как это работает?</h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-300">
              <li>1. Вставь текст из конспекта или учебника</li>
              <li>2. AI генерирует карточки (вопрос/ответ)</li>
              <li>3. Редактируй и запускай Study Mode</li>
            </ol>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Почему удобно?</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>⚡ Быстро: 20 карточек за 10 секунд</li>
              <li>🔒 Приватно: всё хранится локально</li>
              <li>✏️ Редактируемо: AI не идеален, но ты контролируешь</li>
              <li>📥 Экспорт: делай JSON-бэкапы</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Что дальше?</h2>
            <p className="mt-4 text-sm text-slate-300">
              Оставь email и получи доступ к ранним обновлениям: study mode, spaced repetition, импорт в Anki.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
