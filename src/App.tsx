import React, { useState, useEffect, useMemo } from 'react';
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
  PromptCategoryMeta,
} from './types/catalog';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { PromptCard } from './components/PromptCard';
import { PromptDetailModal } from './components/PromptDetailModal';
import { DesignSystemsView } from './components/DesignSystemsView';
import { HowToModal } from './components/HowToModal';
import { Toast } from './components/Toast';
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
      showToast('Salvo nos Favoritos!', 'Você pode acessar na aba Meus Favoritos');
    } else {
      showToast('Removido dos Favoritos');
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
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

      {/* Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4 animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 font-heading">
              Carregando a Biblioteca Completa...
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Preparando 1.134 modelos e 147 sistemas de design para você.
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Ops, algo deu errado</h3>
            <p className="text-xs text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Recarregar Página
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
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    {activeTab === 'favorites' ? (
                      <Heart className="w-6 h-6 text-rose-400" />
                    ) : (
                      <Layers className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading mb-1">
                    {activeTab === 'favorites'
                      ? 'Você ainda não salvou nenhum modelo favorito'
                      : 'Nenhum modelo encontrado com estes filtros'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    {activeTab === 'favorites'
                      ? 'Navegue pela biblioteca e clique no coração dos modelos que você mais gostar para guardá-los aqui!'
                      : 'Tente buscar por termos mais genéricos ou clique no botão abaixo para restaurar todos os modelos.'}
                  </p>
                  {activeTab === 'favorites' ? (
                    <button
                      onClick={() => setActiveTab('prompts')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                    >
                      Explorar Todos os Modelos
                    </button>
                  ) : (
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                    >
                      Limpar Filtros e Mostrar Todos
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {pagedItems.map((item) => (
                      <PromptCard
                        key={item.id}
                        item={item}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenDetail={setActiveModalItem}
                        onCopySuccess={(title) =>
                          showToast('Prompt Copiado!', `Modelo "${title}" copiado com sucesso`)
                        }
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < filteredItems.length && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleLoadMore}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition"
                      >
                        <ArrowDown className="w-4 h-4 text-blue-600" />
                        <span>
                          Carregar Mais Modelos (mostrando {pagedItems.length} de{' '}
                          {filteredItems.length})
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

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-semibold text-slate-700">
            Superdesign Brasil — Versão Pessoal Desbloqueada da Prompt Library
          </p>
          <p>
            1.134 Prompts de UI, Sites e Aplicativos + 147 Sistemas de Design <code className="text-slate-700">design.md</code> 100% livres de login e bloqueios.
          </p>
          <p className="text-[11px] text-slate-400 pt-2">
            Compatível com Lovable.dev, Bolt.new, v0.dev, ChatGPT, Claude e Cursor.
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
