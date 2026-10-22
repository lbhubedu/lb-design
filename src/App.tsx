import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  fetchCatalogIndex,
  fetchDesignSystems,
  getFavoriteIds,
  toggleFavoriteId,
} from './services/api';
import {
  CatalogIndex,
  DesignSystemsCatalog,
  PromptItem,
  ActiveTab,
} from './types/catalog';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MarqueeBanner } from './components/MarqueeBanner';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { PromptCard } from './components/PromptCard';
import { PromptDetailModal } from './components/PromptDetailModal';
import { DesignSystemsView } from './components/DesignSystemsView';
import { HowToModal } from './components/HowToModal';
import { Toast } from './components/Toast';
import { NoiseOverlay } from './components/NoiseOverlay';
import { Sparkles, Layers, Heart, AlertCircle, ArrowDown } from 'lucide-react';

const PAGE_SIZE = 36;

export const App: React.FC = () => {
  const [catalog, setCatalog] = useState<CatalogIndex | null>(null);
  const [designSystems, setDesignSystems] = useState<DesignSystemsCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [activeTab, setActiveTab] = useState<ActiveTab>('prompts');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'name'>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Modals & UI
  const [activeModalItem, setActiveModalItem] = useState<PromptItem | null>(null);
  const [isHowToOpen, setIsHowToOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; subMessage?: string }>({
    isVisible: false,
    message: '',
  });

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    setFavorites(getFavoriteIds());

    Promise.all([fetchCatalogIndex(), fetchDesignSystems()])
      .then(([catData, dsData]) => {
        setCatalog(catData);
        setDesignSystems(dsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Falha ao inicializar catálogo:', err);
        setError('Não foi possível carregar a biblioteca de dados. Tente recarregar a página.');
        setLoading(false);
      });
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedTheme,
    selectedDevice,
    sortBy,
    searchQuery,
    activeTab,
  ]);

  const showToast = (message: string, subMessage?: string) => {
    setToast({ isVisible: true, message, subMessage });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2800);
  };

  const handleToggleFavorite = (id: string) => {
    const isNowFav = toggleFavoriteId(id);
    setFavorites(getFavoriteIds());
    if (isNowFav) {
      showToast('SALVO NOS FAVORITOS!', 'ACESSE NA ABA MEUS FAVORITOS');
    } else {
      showToast('REMOVIDO DOS FAVORITOS');
    }
  };

  const scrollToCatalog = () => {
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter & Sort Items
  const filteredItems = useMemo(() => {
    if (!catalog) return [];

    let list = catalog.items;

    // Filter by tab (Favorites tab)
    if (activeTab === 'favorites') {
      list = list.filter((item) => favorites.includes(item.id));
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory !== 'all') {
      list = list.filter((item) => item.subcategory === selectedSubcategory);
    }

    // Filter by theme
    if (selectedTheme !== 'all') {
      list = list.filter((item) => item.theme === selectedTheme);
    }

    // Filter by device
    if (selectedDevice !== 'all') {
      list = list.filter((item) => item.previewDevice === selectedDevice);
    }

    // Search query filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const titleMatch = (item.titlePt || '').toLowerCase().includes(q) || item.title.toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q) || (item.summaryPt || '').toLowerCase().includes(q) || (item.idealForPt || '').toLowerCase().includes(q);
        const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q)) || (item.tagsPt || []).some((t) => t.toLowerCase().includes(q));
        const subcatMatch = (item.subcategory || '').toLowerCase().includes(q);
        return titleMatch || descMatch || tagMatch || subcatMatch;
      });
    }

    // Sorting
    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'popular') {
        const usesA = a.stats?.uses || 0;
        const usesB = b.stats?.uses || 0;
        return usesB - usesA;
      }
      if (sortBy === 'recent') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'name') {
        const nameA = a.titlePt || a.title;
        const nameB = b.titlePt || b.title;
        return nameA.localeCompare(nameB, 'pt-BR');
      }
      return 0;
    });

    return sorted;
  }, [
    catalog,
    activeTab,
    favorites,
    selectedCategory,
    selectedSubcategory,
    selectedTheme,
    selectedDevice,
    searchQuery,
    sortBy,
  ]);

  const pagedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedTheme('all');
    setSelectedDevice('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col font-sans selection:bg-[#DFE104] selection:text-[#000000] relative">
      {/* Noise Texture Overlay */}
      <NoiseOverlay />

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        subMessage={toast.subMessage}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalPrompts={catalog?.totalPrompts || 1134}
        totalDesignSystems={designSystems?.total || 147}
        favoriteCount={favorites.length}
        onOpenHowTo={() => setIsHowToOpen(true)}
      />

      {/* Hero Section (shown on Prompts tab when no search query) */}
      {activeTab === 'prompts' && !searchQuery && selectedCategory === 'all' && (
        <>
          <HeroSection
            totalPrompts={catalog?.totalPrompts || 1134}
            totalDesignSystems={designSystems?.total || 147}
            onExploreClick={scrollToCatalog}
            onOpenHowTo={() => setIsHowToOpen(true)}
          />

          {/* Continuous Kinetic Marquee */}
          <MarqueeBanner variant="acid" speed={80} />
        </>
      )}

      {/* Body Content - Ultra Wide Max-w-[95vw] */}
      <main
        ref={catalogSectionRef}
        className="flex-1 max-w-[95vw] w-full mx-auto px-4 sm:px-6 py-8"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-[#3F3F46] bg-[#09090B]">
            <div className="w-16 h-16 bg-[#DFE104] text-black flex items-center justify-center mb-6 font-black text-2xl font-heading animate-pulse">
              SD
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#FAFAFA] font-heading uppercase tracking-tighter">
              CARREGANDO BIBLIOTECA COMPLETA...
            </h2>
            <p className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mt-2">
              SINCRONIZANDO 1.134 PROMPTS E 147 SISTEMAS DE DESIGN.
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center max-w-lg mx-auto border-2 border-rose-800 bg-[#27272A]">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-black uppercase text-white mb-2 font-heading">
              ERRO AO CARREGAR DADOS
            </h3>
            <p className="text-xs font-mono text-rose-300 mb-6 uppercase">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="h-12 px-6 bg-[#DFE104] text-black text-xs font-black uppercase tracking-wider rounded-none cursor-pointer hover:scale-105 active:scale-95"
            >
              RECARREGAR PÁGINA
            </button>
          </div>
        ) : activeTab === 'design-systems' ? (
          /* DESIGN SYSTEMS TAB */
          <DesignSystemsView
            items={designSystems?.items || []}
            onCopySuccess={(title, sub) => showToast(title, sub)}
          />
        ) : (
          /* PROMPTS & FAVORITES TABS */
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar (Categories) */}
            <Sidebar
              categories={catalog?.categories || []}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              onSelectSubcategory={setSelectedSubcategory}
              totalPrompts={catalog?.totalPrompts || 1134}
            />

            {/* Main Area */}
            <div className="flex-1 min-w-0">
              {/* Filter bar */}
              <FilterBar
                selectedCategory={selectedCategory}
                categories={catalog?.categories || []}
                selectedTheme={selectedTheme}
                onSelectTheme={setSelectedTheme}
                selectedDevice={selectedDevice}
                onSelectDevice={setSelectedDevice}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filteredCount={filteredItems.length}
                totalCount={catalog?.totalPrompts || 1134}
                onResetFilters={handleResetFilters}
              />

              {/* Grid of Cards */}
              {filteredItems.length === 0 ? (
                <div className="bg-[#09090B] border-2 border-[#3F3F46] p-16 text-center rounded-none">
                  <div className="w-16 h-16 bg-[#27272A] border-2 border-[#3F3F46] text-[#A1A1AA] flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'favorites' ? (
                      <Heart className="w-8 h-8 text-rose-500" />
                    ) : (
                      <Layers className="w-8 h-8 text-[#DFE104]" />
                    )}
                  </div>
                  <h3 className="text-xl font-black text-[#FAFAFA] font-heading uppercase tracking-tight mb-2">
                    {activeTab === 'favorites'
                      ? 'NENHUM MODELO FAVORITADO AINDA'
                      : 'NENHUM MODELO ENCONTRADO'}
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] max-w-md mx-auto mb-6">
                    {activeTab === 'favorites'
                      ? 'CLIQUE NO CORAÇÃO DE QUALQUER MODELO PARA GUARDÁ-LO NA SUA LISTA.'
                      : 'TENTE OUTROS TERMOS DE BUSCA OU CLIQUE ABAIXO PARA VER TODOS OS PROMPTS.'}
                  </p>
                  {activeTab === 'favorites' ? (
                    <button
                      onClick={() => setActiveTab('prompts')}
                      className="h-12 px-6 bg-[#DFE104] text-black text-xs font-black uppercase tracking-wider transition rounded-none cursor-pointer hover:scale-105"
                    >
                      EXPLORAR TODOS OS MODELOS
                    </button>
                  ) : (
                    <button
                      onClick={handleResetFilters}
                      className="h-12 px-6 bg-[#DFE104] text-black text-xs font-black uppercase tracking-wider transition rounded-none cursor-pointer hover:scale-105"
                    >
                      LIMPAR FILTROS // VER TODOS
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedItems.map((item) => (
                      <PromptCard
                        key={item.id}
                        item={item}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenDetail={setActiveModalItem}
                        onCopySuccess={(title) =>
                          showToast('PROMPT COPIADO!', `"${title.toUpperCase()}" COPIADO`)
                        }
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < filteredItems.length && (
                    <div className="mt-12 text-center">
                      <button
                        onClick={handleLoadMore}
                        className="h-16 px-10 border-2 border-[#3F3F46] bg-[#09090B] hover:bg-[#DFE104] hover:text-black hover:border-[#DFE104] text-[#FAFAFA] text-xs sm:text-sm font-black uppercase tracking-widest transition-all rounded-none inline-flex items-center gap-3 cursor-pointer"
                      >
                        <ArrowDown className="w-5 h-5 stroke-[2.5]" />
                        <span>
                          CARREGAR MAIS MODELOS ({pagedItems.length} DE {filteredItems.length})
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Marquee before footer */}
      <MarqueeBanner variant="dark" speed={50} direction="right" className="mt-16" />

      {/* Brutalist Footer */}
      <footer className="border-t-2 border-[#3F3F46] bg-[#09090B] py-12 text-center text-xs">
        <div className="max-w-[95vw] mx-auto px-4 sm:px-6 space-y-3">
          <div className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#FAFAFA] font-heading">
            SUPERDESIGN <span className="text-[#DFE104]">BRASIL</span> // 2026
          </div>
          <p className="font-mono text-[#A1A1AA] uppercase tracking-wider">
            1.134 PROMPTS DE UI & DESIGN SYSTEMS 100% DESBLOQUEADOS // COMPATÍVEL COM LOVABLE, BOLT, V0, CHATGPT, CLAUDE E CURSOR.
          </p>
          <p className="text-[10px] font-mono text-[#3F3F46] uppercase pt-2">
            PROJETO DE USO PESSOAL CRIADO COM ENGENHARIA REVERSA & KINETIC TYPOGRAPHY.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <PromptDetailModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        isFavorite={activeModalItem ? favorites.includes(activeModalItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onCopySuccess={(title, sub) => showToast(title, sub)}
      />

      <HowToModal isOpen={isHowToOpen} onClose={() => setIsHowToOpen(false)} />
    </div>
  );
};
