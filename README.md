## AI Flashcard Generator (Next.js)

Генератор флэш-карточек на Next.js: вставляешь конспект — получаешь Q/A колоду за секунды, редактируешь и учишься в Study Mode. Данные хранятся локально, есть экспорт/импорт и дневной rate limit.

### Стек
- Next.js 16 (App Router), React 19, TypeScript
- OpenAI (gpt-4o-mini) через `/api/generate`
- Tailwind 4 (CSS-in-JS runtime)

### Возможности
- Генерация колоды из текста (AI, JSON-mode)
- Редактор карточек (добавить/удалить/править)
- Study Mode с результатами сессии
- localStorage + экспорт/импорт JSON
- In-memory rate limit (3 генерации/день) + события аналитики (консоль)
- Лэндинг `/landing` с описанием

### Быстрый старт
```bash
npm install
cp .env.example .env.local   # заполни ключи
npm run dev                  # http://localhost:3000
```

### Переменные окружения
```
OPENAI_API_KEY=sk-...        # обязателен для /api/generate
OPENAI_BASE_URL=...          # опционально (например, прокси)
GEMINI_API_KEY=...           # фолбек-модель (если OpenAI недоступен)
GEMINI_MODEL=gemini-1.5-flash
ANTHROPIC_API_KEY=...        # зарезервировано для future fallback
NODE_ENV=development
```
- Поведение фолбека: сначала OpenAI, если ошибка — Gemini, если оба недоступны — мок-генерация из текста (но качество хуже).
- Если оба ключа не заданы, эндпойнт ответит мок-карточками (warning в JSON), UI остаётся кликабельным на мок-данных — поэтому приложение выглядит «рабочим» без ключей.

### Скрипты
- `npm run dev` — dev-сервер
- `npm run build` — прод-билд
- `npm run start` — запуск прод-сборки
- `npm run lint` — ESLint

### Структура (фронт)
- `src/app/page.tsx` — главная: генерация, редактор, список колод
- `src/app/deck/[id]` — редактор отдельной колоды
- `src/app/deck/[id]/study` — Study Mode
- `src/app/api/generate` — AI генерация + rate limit
- `src/components/*` — UI-компоненты (GenerateForm, CardsEditor, StudyView и др.)
- `src/utils/*` — api, storage, analytics

### Что улучшить дальше
- Привязать аналитические события к бекенду/SaaS (например, Plausible или Supabase) вместо консоли.
- Персистентный rate limit (Redis) и привязка к пользователю, а не IP.
- Добавить fallback-модель (Anthropic) и деградацию в мок-генератор при проблемах с AI.
- Улучшить UX в Study Mode: горячие клавиши, shuffle, повторение «не знаю».
- Обновить Landing с формой сбора email (waiting list).
