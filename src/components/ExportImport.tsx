'use client';

import { ChangeEvent, useRef } from 'react';
import { Deck } from '@/types';
import { loadDecks, persistDecks } from '@/utils/storage';
import { Download, Upload, Database, FileJson } from 'lucide-react';

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
    <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/50 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-blue-200/50">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-400/10 blur-3xl transition-all group-hover:scale-110" />

      <div className="relative">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-lg">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">Бэкап данных</h3>
            <p className="mt-1 text-sm text-slate-600">Экспортируй все колоды в JSON или импортируй обратно</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="group/export flex items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:scale-105 hover:border-blue-300 hover:shadow-md active:scale-95"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 transition-transform group-hover/export:translate-y-0.5" />
            Экспортировать
          </button>
          <button
            type="button"
            className="group/import flex items-center justify-center gap-2 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all hover:scale-105 hover:border-indigo-300 hover:shadow-md active:scale-95"
            onClick={handleImportClick}
          >
            <Upload className="h-4 w-4 transition-transform group-hover/import:-translate-y-0.5" />
            Импортировать
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 p-3">
          <FileJson className="h-4 w-4 text-blue-600" />
          <p className="text-xs font-medium text-blue-700">Формат: JSON • Все колоды и карточки</p>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
