import React from 'react';
import {
  Laptop,
  Layout,
  Layers,
  Smartphone,
  ShoppingBag,
  Briefcase,
  Zap,
  Palette,
  Presentation,
  Wand2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { PromptCategoryMeta } from '../types/catalog';

interface SidebarProps {
  categories: PromptCategoryMeta[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedSubcategory: string;
  onSelectSubcategory: (subcat: string) => void;
  totalPrompts: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'sites-vendas': <Laptop className="w-4 h-4 shrink-0 text-blue-500" />,
  'paineis-sistemas': <Layout className="w-4 h-4 shrink-0 text-indigo-500" />,
  'pecas-componentes': <Layers className="w-4 h-4 shrink-0 text-teal-500" />,
  'apps-celular': <Smartphone className="w-4 h-4 shrink-0 text-emerald-500" />,
  'lojas-produtos': <ShoppingBag className="w-4 h-4 shrink-0 text-amber-500" />,
  'portfolios-criativos': <Briefcase className="w-4 h-4 shrink-0 text-purple-500" />,
  'efeitos-animacoes': <Zap className="w-4 h-4 shrink-0 text-yellow-500" />,
  'estilos-identidade': <Palette className="w-4 h-4 shrink-0 text-rose-500" />,
  'apresentacoes-slides': <Presentation className="w-4 h-4 shrink-0 text-orange-500" />,
  'superpoderes-ia': <Wand2 className="w-4 h-4 shrink-0 text-pink-500" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  totalPrompts,
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs lg:sticky lg:top-28">
        <div className="px-3 pt-2 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Categorias Principais
          </span>
        </div>

        {/* All items button */}
        <button
          onClick={() => {
            onSelectCategory('all');
            onSelectSubcategory('all');
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition text-left mb-1 ${
            selectedCategory === 'all'
              ? 'bg-blue-50 text-blue-700 font-bold'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Todos os Modelos</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] ${
              selectedCategory === 'all'
                ? 'bg-blue-200/70 text-blue-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {totalPrompts}
          </span>
        </button>

        {/* Categories list */}
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div key={cat.id} className="rounded-xl overflow-hidden">
                <button
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onSelectSubcategory('all');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition text-left ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {CATEGORY_ICONS[cat.id] || <Sparkles className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{cat.shortLabelPt || cat.labelPt}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        isSelected
                          ? 'bg-blue-200/70 text-blue-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        isSelected ? 'rotate-90 text-blue-600' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Subcategories if category is active */}
                {isSelected && cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="pl-7 pr-2 py-1.5 space-y-1 bg-blue-50/40 rounded-b-xl mb-1 border-l-2 border-blue-400 ml-3">
                    <button
                      onClick={() => onSelectSubcategory('all')}
                      className={`w-full flex items-center justify-between text-left px-2 py-1 rounded-md text-xs transition ${
                        selectedSubcategory === 'all'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-600 hover:text-blue-700 hover:bg-blue-100/50'
                      }`}
                    >
                      <span>Todos de {cat.shortLabelPt}</span>
                      <span className="text-[10px] opacity-80">{cat.count}</span>
                    </button>

                    {cat.subcategories.map((sub) => {
                      const isSubSelected = selectedSubcategory === sub.name;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => onSelectSubcategory(sub.name)}
                          className={`w-full flex items-center justify-between text-left px-2 py-1 rounded-md text-xs transition ${
                            isSubSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'text-slate-600 hover:text-blue-700 hover:bg-blue-100/50'
                          }`}
                        >
                          <span className="truncate pr-1">{sub.name}</span>
                          <span className="text-[10px] opacity-75 shrink-0">{sub.count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
