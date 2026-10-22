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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('prompts')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-heading">
                    Superdesign <span className="text-blue-600">Brasil</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    100% Desbloqueado
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Biblioteca Pessoal de Prompts de UI, Sites e Aplicativos para Leigos
                </p>
              </div>
            </button>
          </div>

          {/* Search input in center */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Busque por tipo de site (ex: barbearia, dashboard, clínica, escuro, botão)..."
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 border border-slate-200 transition"
              title="Guia Passo a Passo para Leigos"
            >
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">Como Usar</span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition hidden lg:flex items-center justify-center"
              title="Repositório no GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar modelos, sites, componentes..."
              className="w-full pl-10 pr-8 py-2 text-sm bg-slate-100 text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation row */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 pb-2.5 overflow-x-auto scrollbar-none gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectTab('prompts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === 'prompts'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Modelos & Prompts</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'prompts'
                    ? 'bg-blue-700 text-blue-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {totalPrompts}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('design-systems')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === 'design-systems'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Sistemas de Cores & Design</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'design-systems'
                    ? 'bg-blue-700 text-blue-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {totalDesignSystems}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('favorites')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === 'favorites'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-rose-500 text-rose-500' : ''} ${
                  activeTab === 'favorites' ? 'text-white fill-white' : ''
                }`}
              />
              <span>Meus Favoritos</span>
              {favoriteCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                    activeTab === 'favorites'
                      ? 'bg-rose-700 text-rose-100'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {favoriteCount}
                </span>
              )}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>✨ Funciona direto no</span>
            <span className="font-semibold text-slate-800">Lovable</span>
            <span>•</span>
            <span className="font-semibold text-slate-800">Bolt.new</span>
            <span>•</span>
            <span className="font-semibold text-slate-800">v0</span>
            <span>•</span>
            <span className="font-semibold text-slate-800">ChatGPT</span>
          </div>
        </div>
      </div>
    </header>
  );
};
