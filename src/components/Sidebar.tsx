import React from 'react';
import {
  Smartphone,
  Users,
  LayoutDashboard,
  Wand2,
  Laptop,
  Flame,
  Layers,
  Palette,
  Zap,
  Presentation,
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
  'apps-aplicativos': <Smartphone className="w-4 h-4 shrink-0" />,
  'crms-gestao': <Users className="w-4 h-4 shrink-0" />,
  'dashboards-paineis': <LayoutDashboard className="w-4 h-4 shrink-0" />,
  'ferramentas-ia': <Wand2 className="w-4 h-4 shrink-0" />,
  'sistemas-saas': <Laptop className="w-4 h-4 shrink-0" />,
  'sites-vendas': <Flame className="w-4 h-4 shrink-0" />,
  'pecas-componentes': <Layers className="w-4 h-4 shrink-0" />,
  'identidades-design-systems': <Palette className="w-4 h-4 shrink-0" />,
  'efeitos-animacoes': <Zap className="w-4 h-4 shrink-0" />,
  'apresentacoes-pitch': <Presentation className="w-4 h-4 shrink-0" />,
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
    <aside className="w-full lg:w-80 shrink-0">
      <div className="bg-[#09090B] border-2 border-[#3F3F46] p-4 lg:sticky lg:top-28 rounded-none">
        <div className="pb-3 mb-2 border-b-2 border-[#3F3F46] flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-[#DFE104] font-heading">
            // CATEGORIAS
          </span>
          <span className="text-[10px] font-mono text-[#A1A1AA] uppercase">
            [10 NICHOS]
          </span>
        </div>

        {/* All items button */}
        <button
          onClick={() => {
            onSelectCategory('all');
            onSelectSubcategory('all');
          }}
          className={`w-full flex items-center justify-between px-3.5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors text-left mb-1.5 rounded-none cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#DFE104] text-[#000000]'
              : 'text-[#FAFAFA] bg-[#27272A] hover:bg-[#3F3F46]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] font-bold">00</span>
            <span>TODOS OS MODELOS</span>
          </div>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-black ${
              selectedCategory === 'all'
                ? 'bg-black text-[#DFE104]'
                : 'bg-[#09090B] text-[#FAFAFA]'
            }`}
          >
            {totalPrompts}
          </span>
        </button>

        {/* Categories list */}
        <div className="space-y-1">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            const numberLabel = String(idx + 1).padStart(2, '0');

            return (
              <div key={cat.id} className="border border-transparent">
                <button
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onSelectSubcategory('all');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors text-left rounded-none cursor-pointer ${
                    isSelected
                      ? 'bg-[#DFE104] text-[#000000]'
                      : 'text-[#FAFAFA] hover:bg-[#27272A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-[10px] opacity-60 shrink-0">
                      {numberLabel}
                    </span>
                    <span className="shrink-0">{CATEGORY_ICONS[cat.id]}</span>
                    <span className="truncate">{cat.shortLabelPt || cat.labelPt}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-black ${
                        isSelected
                          ? 'bg-black text-[#DFE104]'
                          : 'bg-[#27272A] text-[#FAFAFA]'
                      }`}
                    >
                      {cat.count}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'rotate-90 text-black' : 'text-[#A1A1AA]'
                      }`}
                    />
                  </div>
                </button>

                {/* Subcategories if category is active */}
                {isSelected && cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="pl-6 pr-2 py-2 space-y-1 bg-[#27272A]/70 border-l-2 border-[#DFE104] my-1">
                    <button
                      onClick={() => onSelectSubcategory('all')}
                      className={`w-full flex items-center justify-between text-left px-2 py-1 text-xs font-bold uppercase tracking-wider transition rounded-none cursor-pointer ${
                        selectedSubcategory === 'all'
                          ? 'bg-[#DFE104] text-[#000000]'
                          : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                      }`}
                    >
                      <span>TODOS DE {cat.shortLabelPt}</span>
                      <span className="text-[10px] font-mono">{cat.count}</span>
                    </button>

                    {cat.subcategories.map((sub) => {
                      const isSubSelected = selectedSubcategory === sub.name;
                      return (
                        <button
                          key={sub.name}
                          onClick={() => onSelectSubcategory(sub.name)}
                          className={`w-full flex items-center justify-between text-left px-2 py-1 text-xs font-bold uppercase tracking-wider transition rounded-none cursor-pointer ${
                            isSubSelected
                              ? 'bg-[#DFE104] text-[#000000]'
                              : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                          }`}
                        >
                          <span className="truncate pr-1">{sub.name}</span>
                          <span className="text-[10px] font-mono shrink-0">{sub.count}</span>
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
