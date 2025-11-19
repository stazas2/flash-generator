import Link from 'next/link';
import { notFound } from 'next/navigation';
import StudyView from '@/components/StudyView';
import { findMockDeck } from '@/data/mockDecks';

interface StudyPageProps {
  params: { id: string };
}

export default function StudyPage({ params }: StudyPageProps) {
  const deck = findMockDeck(params.id);
  if (!deck) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Study Mode</p>
            <h1 className="text-3xl font-semibold text-slate-900">{deck.name}</h1>
          </div>
          <Link href={`/deck/${deck.id}`} className="text-sm text-slate-600">
            ← К редактору
          </Link>
        </div>
        <StudyView deckName={deck.name} cards={deck.cards} />
      </div>
    </main>
  );
}
