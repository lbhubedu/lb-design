import React from 'react';
import { Search, Sparkles, Heart, HelpCircle, Layers, Palette, X } from 'lucide-react';
import { ActiveTab } from '../types/catalog';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalPrompts: number;
  totalDesignSystems: number;
  favoriteCount: number;
  onOpenHowTo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  totalPrompts,
  totalDesignSystems,
  favoriteCount,
  onOpenHowTo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-b-2 border-[#3F3F46] transition-all">
      <div className="max-w-[95vw] mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('prompts')}
              className="flex items-center gap-3 text-left group transition cursor-pointer"
            >
              <div className="w-10 h-10 bg-[#DFE104] flex items-center justify-center text-black font-black text-xl rounded-none group-hover:scale-105 transition-transform">
                SD
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg sm:text-xl tracking-tighter text-[#FAFAFA] font-heading uppercase">
                    SUPERDESIGN <span className="text-[#DFE104]">BRASIL</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-[#27272A] text-[#DFE104] border border-[#3F3F46] uppercase tracking-wider rounded-none">
                    100% DESBLOQUEADO
                  </span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] font-bold uppercase tracking-widest hidden sm:block">
                  BIBLIOTECA PESSOAL DE PROMPTS & DESIGN SYSTEMS
                </p>
              </div>
            </button>
          </div>

          {/* Search input in center */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="BUSCAR PROMPT (EX: BARBEARIA, DASHBOARD, CLINICA, ESCURO, BOTAO)..."
                className="w-full pl-10 pr-9 py-3 text-xs uppercase tracking-wider font-semibold bg-[#27272A] text-[#FAFAFA] placeholder:text-[#A1A1AA]/70 rounded-none border-2 border-[#3F3F46] focus:border-[#DFE104] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#FAFAFA] p-0.5"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHowTo}
              className="h-10 px-4 bg-transparent border-2 border-[#3F3F46] hover:bg-[#FAFAFA] hover:text-[#000000] text-xs font-bold uppercase tracking-wider text-[#FAFAFA] transition rounded-none flex items-center gap-1.5 cursor-pointer"
              title="Guia Passo a Passo para Leigos"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">COMO USAR</span>
            </button>

            <a
              href="https://github.com/lbhubedu/superdesign-biblioteca-pt"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-3 bg-transparent border-2 border-[#3F3F46] hover:border-[#DFE104] hover:text-[#DFE104] text-[#FAFAFA] transition rounded-none hidden lg:flex items-center justify-center"
              title="Repositório no GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="BUSCAR MODELOS, SITES, COMPONENTES..."
              className="w-full pl-10 pr-8 py-2.5 text-xs uppercase tracking-wider bg-[#27272A] text-[#FAFAFA] placeholder:text-[#A1A1AA] rounded-none border-2 border-[#3F3F46] focus:border-[#DFE104] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#FAFAFA] p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation row */}
        <div className="flex items-center justify-between border-t-2 border-[#3F3F46] pt-2 pb-2.5 overflow-x-auto scrollbar-none gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('prompts')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-none transition cursor-pointer ${
                activeTab === 'prompts'
                  ? 'bg-[#DFE104] text-[#000000]'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>BIBLIOTECA DE PROMPTS</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-black ${
                  activeTab === 'prompts'
                    ? 'bg-black text-[#DFE104]'
                    : 'bg-[#27272A] text-[#FAFAFA]'
                }`}
              >
                {totalPrompts}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('design-systems')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-none transition cursor-pointer ${
                activeTab === 'design-systems'
                  ? 'bg-[#DFE104] text-[#000000]'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>SISTEMAS DESIGN.MD</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-black ${
                  activeTab === 'design-systems'
                    ? 'bg-black text-[#DFE104]'
                    : 'bg-[#27272A] text-[#FAFAFA]'
                }`}
              >
                {totalDesignSystems}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-none transition cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#DFE104] text-[#000000]'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A]'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-current' : ''}`}
              />
              <span>MEUS FAVORITOS</span>
              {favoriteCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-black ${
                    activeTab === 'favorites'
                      ? 'bg-black text-[#DFE104]'
                      : 'bg-[#DFE104] text-[#000000]'
                  }`}
                >
                  {favoriteCount}
                </span>
              )}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#A1A1AA] font-bold uppercase tracking-widest font-mono">
            <span>// SUPORTA:</span>
            <span className="text-[#FAFAFA]">LOVABLE</span>
            <span>•</span>
            <span className="text-[#FAFAFA]">BOLT</span>
            <span>•</span>
            <span className="text-[#FAFAFA]">V0</span>
            <span>•</span>
            <span className="text-[#FAFAFA]">CHATGPT</span>
          </div>
        </div>
      </div>
    </header>
  );
};
