import React from 'react';
import {
  Laptop,
  Smartphone,
  X,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { PromptCategoryMeta } from '../types/catalog';

interface FilterBarProps {
  selectedCategory: string;
  categories: PromptCategoryMeta[];
  selectedTheme: string;
  onSelectTheme: (theme: string) => void;
  selectedDevice: string;
  onSelectDevice: (device: string) => void;
  sortBy: 'popular' | 'recent' | 'name';
  onSortChange: (sort: 'popular' | 'recent' | 'name') => void;
  filteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
}

const THEMES = [
  { id: 'all', label: 'TODOS OS ESTILOS', emoji: '★' },
  { id: 'escuro', label: 'DARK MODE (NOTURNO)', emoji: '🌙' },
  { id: 'claro', label: 'MODO CLARO (CLEAN)', emoji: '☀️' },
  { id: 'vidro', label: 'GLASSMORPHISM (VIDRO)', emoji: '🪟' },
  { id: 'luxo', label: 'ELEGANTE & LUXO (SERIF)', emoji: '💎' },
  { id: 'vibrante', label: 'COLORIDO & VIBRANTE', emoji: '⚡' },
  { id: 'minimalista', label: 'MINIMALISTA & SUAVE', emoji: '🌿' },
  { id: 'retro-brutalista', label: 'RETRÔ // BRUTALISTA', emoji: '🕹️' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  categories,
  selectedTheme,
  onSelectTheme,
  selectedDevice,
  onSelectDevice,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount,
  onResetFilters,
}) => {
  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const hasActiveFilters =
    selectedTheme !== 'all' || selectedDevice !== 'all' || selectedCategory !== 'all';

  return (
    <div className="bg-[#09090B] border-2 border-[#3F3F46] p-5 mb-6 space-y-4 rounded-none">
      {/* Category header title & description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#3F3F46]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#FAFAFA] font-heading uppercase tracking-tighter">
              {currentCategory ? currentCategory.labelPt : 'TODOS OS MODELOS'}
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#DFE104] text-black">
              {filteredCount} {filteredCount === 1 ? 'PROMPT' : 'PROMPTS'}
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1 font-medium uppercase tracking-wider">
            {currentCategory
              ? currentCategory.descriptionPt
              : 'CATÁLOGO COMPLETO DE TELAS, COMPONENTES E SISTEMAS PRONTOS PARA COPIAR.'}
          </p>
        </div>

        {/* Device toggle & Sort dropdown */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Device selector */}
          <div className="flex items-center bg-[#27272A] p-0.5 border-2 border-[#3F3F46] text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => onSelectDevice('all')}
              className={`px-3 py-1.5 transition cursor-pointer ${
                selectedDevice === 'all'
                  ? 'bg-[#DFE104] text-black'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`}
            >
              TODOS
            </button>
            <button
              onClick={() => onSelectDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition cursor-pointer ${
                selectedDevice === 'desktop'
                  ? 'bg-[#DFE104] text-black'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DESKTOP</span>
            </button>
            <button
              onClick={() => onSelectDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 transition cursor-pointer ${
                selectedDevice === 'mobile'
                  ? 'bg-[#DFE104] text-black'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">MOBILE</span>
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-[#27272A] border-2 border-[#3F3F46] px-3 py-1.5 text-xs font-bold text-[#FAFAFA] uppercase tracking-wider">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#DFE104]" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-xs font-bold uppercase tracking-wider text-[#FAFAFA] focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-[#09090B] text-white">MAIS USADOS</option>
              <option value="recent" className="bg-[#09090B] text-white">MAIS RECENTES</option>
              <option value="name" className="bg-[#09090B] text-white">ORDEM A-Z</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 h-9 px-3 bg-[#27272A] hover:bg-rose-950 text-xs font-bold uppercase tracking-wider text-rose-300 border-2 border-rose-800 transition cursor-pointer"
              title="Limpar todos os filtros"
            >
              <X className="w-3.5 h-3.5" />
              <span>LIMPAR</span>
            </button>
          )}
        </div>
      </div>

      {/* Theme horizontal chip list */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#DFE104] shrink-0 mr-1 flex items-center gap-1">
          ESTILO:
        </span>
        {THEMES.map((th) => {
          const isSelected = selectedTheme === th.id;
          return (
            <button
              key={th.id}
              onClick={() => onSelectTheme(th.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition shrink-0 cursor-pointer rounded-none border-2 ${
                isSelected
                  ? 'bg-[#DFE104] text-black border-[#DFE104]'
                  : 'bg-[#27272A] text-[#FAFAFA] border-[#3F3F46] hover:border-[#DFE104]'
              }`}
            >
              <span>{th.emoji}</span>
              <span>{th.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
