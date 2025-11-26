'use client';

import { ChangeEvent, useRef } from 'react';
import { Deck } from '@/types';
import { loadDecks, persistDecks } from '@/utils/storage';

interface ExportImportProps {
  onImportComplete?: (decks: Deck[]) => void;
}

export default function ExportImport({ onImportComplete }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const decks = loadDecks();
    const blob = new Blob([JSON.stringify(decks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `flashcards-backup-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const imported = JSON.parse(loadEvent.target?.result as string);
        if (Array.isArray(imported)) {
          persistDecks(imported);
          onImportComplete?.(imported as Deck[]);
          alert('Импорт завершён!');
        } else {
          alert('Файл не похож на бэкап колод.');
        }
      } catch (error) {
        alert('Не удалось прочитать файл.');
        console.error(error);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Бэкап данных</h3>
          <p className="text-sm text-slate-500">Экспортируй все колоды в JSON-файл или импортируй обратно.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm" onClick={handleExport}>
            Экспортировать
          </button>
          <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm" onClick={handleImportClick}>
            Импортировать
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
