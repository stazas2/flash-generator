import Link from 'next/link';
import { notFound } from 'next/navigation';
import CardsEditor from '@/components/CardsEditor';
import GenerateForm from '@/components/GenerateForm';
import { findMockDeck } from '@/data/mockDecks';

interface DeckPageProps {
  params: { id: string };
}

export default function DeckPage({ params }: DeckPageProps) {
  const deck = findMockDeck(params.id);
  if (!deck) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Редактирование колоды</p>
            <h1 className="text-3xl font-semibold text-slate-900">{deck.name}</h1>
          </div>
          <Link href="/" className="text-sm text-slate-600">
            ← Вернуться
          </Link>
        </div>
        <GenerateForm />
        <CardsEditor cards={deck.cards} />
      </div>
    </main>
  );
}
