'use client';

import { useEffect, useMemo, useState } from 'react';
import CardsEditor from '@/components/CardsEditor';
import DeckList from '@/components/DeckList';
import ExportImport from '@/components/ExportImport';
import FeedbackForm from '@/components/FeedbackForm';
import GenerateForm from '@/components/GenerateForm';
import { mockDecks } from '@/data/mockDecks';
import { Card, Deck } from '@/types';
import { analytics } from '@/utils/analytics';
import { requestDeckGeneration } from '@/utils/api';
import { loadDecks, saveDeck } from '@/utils/storage';

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `deck-${Date.now()}`;
};

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>(mockDecks);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(mockDecks[0] ?? null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);

  useEffect(() => {
    const storedDecks = loadDecks();
    if (storedDecks.length > 0) {
      setDecks(storedDecks);
      setSelectedDeck(storedDecks[0] ?? null);
    }
  }, []);

  const cards = useMemo(() => selectedDeck?.cards ?? [], [selectedDeck]);

  const syncDeck = (deck: Deck) => {
    const updatedDecks = saveDeck(deck);
    setDecks(updatedDecks);
    setSelectedDeck(deck);
  };

  const handleGenerate = async (text: string, count: number) => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const { cards: cardsFromApi, rateLimitRemaining: remaining } = await requestDeckGeneration({ text, count });
      setRateLimitRemaining(typeof remaining === 'number' ? remaining : null);

      const newDeck: Deck = {
        id: generateId(),
        name: `Новая колода #${decks.length + 1}`,
        description: `Сгенерировано из ${text.slice(0, 30)}${text.length > 30 ? '...' : ''}`,
        createdAt: new Date().toISOString(),
        cards: cardsFromApi,
      };

      syncDeck(newDeck);
      analytics.track({
        event: 'generate_success',
        timestamp: Date.now(),
        props: {
          deckId: newDeck.id,
          cards: cardsFromApi.length,
          rateLimitRemaining: remaining,
          textLength: text.length,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось сгенерировать карточки.';
      setGenerationError(message);
      analytics.track({
        event: 'generate_error',
        timestamp: Date.now(),
        props: { message },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateDeck = () => {
    const newDeck: Deck = {
      id: generateId(),
      name: `Черновик #${decks.length + 1}`,
      createdAt: new Date().toISOString(),
      cards: [],
    };

    syncDeck(newDeck);
    analytics.track({
      event: 'deck_created',
      timestamp: Date.now(),
      props: { deckId: newDeck.id },
    });
  };

  const handleUpdateCard = (id: string, field: keyof Card, value: string) => {
    if (!selectedDeck) {
      return;
    }

    const updatedDeck: Deck = {
      ...selectedDeck,
      cards: selectedDeck.cards.map((card) => (card.id === id ? { ...card, [field]: value } : card)),
    };

    syncDeck(updatedDeck);
  };

  const handleDeleteCard = (id: string) => {
    if (!selectedDeck) {
      return;
    }

    const updatedDeck: Deck = {
      ...selectedDeck,
      cards: selectedDeck.cards.filter((card) => card.id !== id),
    };

    syncDeck(updatedDeck);
  };

  const handleAddCard = () => {
    if (!selectedDeck) {
      return;
    }

    const newCard: Card = {
      id: generateId(),
      question: 'Новый вопрос',
      answer: 'Ответ...',
    };

    const updatedDeck: Deck = {
      ...selectedDeck,
      cards: [...selectedDeck.cards, newCard],
    };

    syncDeck(updatedDeck);
  };

  const handleImport = () => {
    const storedDecks = loadDecks();
    setDecks(storedDecks.length > 0 ? storedDecks : mockDecks);
    const active = storedDecks.find((deck) => deck.id === selectedDeck?.id);
    setSelectedDeck(active ?? storedDecks[0] ?? mockDecks[0] ?? null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/50">
      {/* Animated background elements */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-400/10 to-fuchsia-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 lg:flex-row lg:py-16">
        <div className="flex-1 space-y-8">
          <GenerateForm
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            errorMessage={generationError}
            rateLimitRemaining={rateLimitRemaining}
          />
          <CardsEditor cards={cards} onUpdateCard={handleUpdateCard} onDeleteCard={handleDeleteCard} onAddCard={handleAddCard} />
          <FeedbackForm />
        </div>
        <div className="flex w-full flex-col gap-8 lg:w-2/5">
          <DeckList decks={decks} onCreateDeck={handleCreateDeck} onSelectDeck={setSelectedDeck} />
          <ExportImport onImportComplete={handleImport} />
        </div>
      </div>
    </main>
  );
}
