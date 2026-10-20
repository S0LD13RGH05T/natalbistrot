import React from 'react';
import { Music } from 'lucide-react';
import { BistroTable } from '../types';
import { BISTRO_TABLES } from '../data';

interface SeatingMapProps {
  selectedTableId: string;
  onSelectTable: (id: string) => void;
}

export default function SeatingMap({ selectedTableId, onSelectTable }: SeatingMapProps) {
  return (
    <div className="rounded-2xl border border-[#eadbd0] bg-white p-6 shadow-xl shadow-[#b8937d]/10 md:p-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-[#eadbd0] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-display text-lg font-semibold uppercase tracking-[0.18em] text-[#352220]">Mesas do salão</h4>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8a6a61]">Escolha uma localização</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#eadbd0] bg-[#fffaf5] px-3 py-1 font-serif text-sm text-[#6e5a56] sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-[#8f4f61]" />
          <span>6 mesas disponíveis</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#eadbd0] bg-[#fffaf5] p-4 md:p-6">
        <div className="mb-6 text-center">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#8a6a61]">Rua Rio Grande, 218</p>
          <div className="mx-auto mt-3 h-px max-w-sm bg-gradient-to-r from-transparent via-[#d9c5b8] to-transparent" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {BISTRO_TABLES.map((table: BistroTable) => {
            const isSelected = selectedTableId === table.id;

            return (
              <button
                key={table.id}
                type="button"
                onClick={() => onSelectTable(table.id)}
                className={`relative flex h-36 cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-300 ${
                  isSelected
                    ? 'scale-[1.02] border-[#8f4f61] bg-[#f4e3e7] shadow-md'
                    : 'border-[#eadbd0] bg-white hover:border-[#d998a8]'
                }`}
                id={`table-button-${table.id}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#352220]">
                    Mesa 0{table.number}
                  </span>
                  <span className="rounded-full bg-[#fffaf5] px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-[#8f4f61]">
                    {table.location === 'window' ? 'Janela' : table.location === 'piano' ? 'Piano' : table.location === 'alcove' ? 'Recanto' : 'Estufa'}
                  </span>
                </div>

                <div className="relative flex items-center justify-center py-2">
                  <span className={`absolute left-5 h-3.5 w-3.5 rounded-full ${isSelected ? 'bg-[#8f4f61]' : 'bg-[#d9c5b8]'}`} />
                  <span className={`absolute right-5 h-3.5 w-3.5 rounded-full ${isSelected ? 'bg-[#8f4f61]' : 'bg-[#d9c5b8]'}`} />
                  <span
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border font-serif text-sm font-semibold ${
                      isSelected ? 'border-[#8f4f61] bg-white text-[#8f4f61]' : 'border-[#d9c5b8] bg-[#fffaf5] text-[#6e5a56]'
                    }`}
                  >
                    {table.capacity}p
                  </span>
                </div>

                <p className="truncate font-serif text-xs italic text-[#6e5a56]">{table.locationDescription}</p>

                {isSelected && (
                  <span className="absolute bottom-2 right-3 font-mono text-[8px] font-black uppercase tracking-widest text-[#8f4f61]">
                    escolhida
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col items-center justify-between gap-2 rounded-xl border border-[#eadbd0] bg-white p-4 text-sm text-[#6e5a56] sm:flex-row">
          <div className="flex items-center gap-2 font-serif">
            <Music className="h-4 w-4 text-[#8f4f61]" />
            <span>Piano e jazz ao vivo durante a noite</span>
          </div>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#8a6a61]">incluso</span>
        </div>
      </div>
    </div>
  );
}
