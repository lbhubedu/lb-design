import React from 'react';
import {
  Laptop,
  Smartphone,
  SlidersHorizontal,
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
  { id: 'all', label: 'Todos os Estilos', emoji: '✨' },
  { id: 'escuro', label: 'Modo Escuro (Dark)', emoji: '🌙' },
  { id: 'claro', label: 'Modo Claro & Clean', emoji: '☀️' },
  { id: 'vidro', label: 'Efeito Vidro (Glass)', emoji: '🪟' },
  { id: 'luxo', label: 'Elegante & Luxo', emoji: '💎' },
  { id: 'vibrante', label: 'Colorido & Moderno', emoji: '🎨' },
  { id: 'minimalista', label: 'Minimalista & Suave', emoji: '🌿' },
  { id: 'retro-brutalista', label: 'Retrô & Criativo', emoji: '🕹️' },
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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-3.5">
      {/* Category header title & description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <span>{currentCategory ? currentCategory.labelPt : 'Todos os Modelos'}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredCount} {filteredCount === 1 ? 'modelo' : 'modelos'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentCategory
              ? currentCategory.descriptionPt
              : 'Navegue por mais de 1.100 modelos de interfaces, sites e componentes prontos para copiar.'}
          </p>
        </div>

        {/* Device toggle & Sort dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Device selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => onSelectDevice('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedDevice === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Todos os Dispositivos"
            >
              Todos
            </button>
            <button
              onClick={() => onSelectDevice('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                selectedDevice === 'desktop'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Apenas Modelos Desktop / Computador"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => onSelectDevice('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                selectedDevice === 'mobile'
                  ? 'bg-white text-emerald-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Apenas Modelos Celular / Mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="popular">Mais Usados</option>
              <option value="recent">Mais Recentes</option>
              <option value="name">Ordem A-Z</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
              title="Limpar todos os filtros"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Theme horizontal chip list */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Estilo Visual:
        </span>
        {THEMES.map((th) => {
          const isSelected = selectedTheme === th.id;
          return (
            <button
              key={th.id}
              onClick={() => onSelectTheme(th.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
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
