import { Deck } from '@/types';

export const mockDecks: Deck[] = [
  {
    id: 'biology-basics',
    name: 'Биология: фотосинтез',
    description: '10 карточек по процессу фотосинтеза',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'bio-1',
        question: 'Что является основным назначением фотосинтеза?',
        answer: 'Синтез органических веществ из неорганических с использованием энергии света.',
      },
      {
        id: 'bio-2',
        question: 'Какие органеллы клетки отвечают за фотосинтез?',
        answer: 'Хлоропласты, содержащие хлорофилл для поглощения света.',
      },
    ],
  },
  {
    id: 'history-ww2',
    name: 'История: Вторая мировая',
    description: 'Основные события 1939-1945',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'hist-1',
        question: 'Когда началась Вторая мировая война?',
        answer: '1 сентября 1939 года после вторжения Германии в Польшу.',
      },
      {
        id: 'hist-2',
        question: 'Какие страны входили в антигитлеровскую коалицию?',
        answer: 'СССР, США, Великобритания и их союзники.',
      },
    ],
  },
];

export const findMockDeck = (id: string) => mockDecks.find((deck) => deck.id === id);
