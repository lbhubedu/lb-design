import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Sparkles,
  Layers,
  Wand2,
  FileCode,
  Heart,
  Share2,
  Info,
  Maximize2,
} from 'lucide-react';
import { PromptItem, PromptDetail, AiTarget } from '../types/catalog';
import { fetchPromptDetail, personalizePrompt } from '../services/api';

interface PromptDetailModalProps {
  item: PromptItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopySuccess: (title: string, sub?: string) => void;
}

type ActiveViewTab = 'personalize' | 'full-prompt' | 'components';
type FrameSize = 'desktop' | 'tablet' | 'mobile';

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  item,
  onClose,
  isFavorite,
  onToggleFavorite,
  onCopySuccess,
}) => {
  if (!item) return null;

  const [detail, setDetail] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveViewTab>('personalize');
  const [frameSize, setFrameSize] = useState<FrameSize>(
    item.previewDevice === 'mobile' ? 'mobile' : 'desktop'
  );

  // Personalization state
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [aiTarget, setAiTarget] = useState<AiTarget>('lovable');
  const [language, setLanguage] = useState<'pt-BR' | 'en'>('pt-BR');

  const [copiedPersonalized, setCopiedPersonalized] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPromptDetail(item.id)
      .then((data) => {
        if (mounted) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar prompt detalhado:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [item.id]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const customizedPromptText = detail
    ? personalizePrompt(item, detail, {
        businessName,
        businessType,
        language,
        aiTarget,
      })
    : '';

  const handleCopyPersonalized = async () => {
    if (!customizedPromptText) return;
    await navigator.clipboard.writeText(customizedPromptText);
    setCopiedPersonalized(true);
    onCopySuccess(
      'Prompt Personalizado Copiado!',
      `Otimizado para ${aiTarget.toUpperCase()} em Português`
    );
    setTimeout(() => setCopiedPersonalized(false), 2200);
  };

  const handleCopyRaw = async () => {
    if (!detail?.prompt) return;
    await navigator.clipboard.writeText(detail.prompt);
    setCopiedRaw(true);
    onCopySuccess('Prompt Original Copiado!', 'Pronto para colar em qualquer IA');
    setTimeout(() => setCopiedRaw(false), 2200);
  };

  const handleCopyBlock = async (key: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedSection(key);
    onCopySuccess(`Seção "${key}" copiada!`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-7xl h-[94vh] rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Navigation Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 shrink-0">
              {item.categoryLabelPt}
            </span>
            <div className="truncate">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading truncate">
                {item.titlePt || item.title}
              </h2>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                {item.idealForPt || item.summaryPt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(item.id)}
              className={`p-2 rounded-xl border transition ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Favoritar este modelo'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* External link */}
            {item.previewUrl && (
              <a
                href={item.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition"
                title="Abrir pré-visualização em tela cheia"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nova Aba</span>
              </a>
            )}

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/70 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Split into Left: Customizer & Right: Live Frame) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Column: Personalizer & Prompts */}
          <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-white overflow-hidden">
            {/* View Tabs */}
            <div className="flex items-center border-b border-slate-200 px-5 pt-3 gap-2 shrink-0 bg-slate-50/40">
              <button
                onClick={() => setActiveTab('personalize')}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
                  activeTab === 'personalize'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Wand2 className="w-4 h-4 text-blue-500" />
                <span>Personalizador Mágico</span>
              </button>

              <button
                onClick={() => setActiveTab('full-prompt')}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
                  activeTab === 'full-prompt'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-500" />
                <span>Prompt Original</span>
              </button>

              {detail?.structured && (
                <button
                  onClick={() => setActiveTab('components')}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
                    activeTab === 'components'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4 text-teal-500" />
                  <span>Seções & Blocos</span>
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {loading ? (
                <div className="space-y-3 py-8">
                  <div className="h-6 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                  <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
                </div>
              ) : activeTab === 'personalize' ? (
                /* TAB 1: PERSONALIZADOR MÁGICO */
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-900">
                    <div className="flex items-center gap-2 font-bold text-blue-800 mb-1">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Como funciona o Personalizador Mágico:
                    </div>
                    Digite o nome da sua empresa e o que ela faz. Nós adaptamos o prompt
                    automaticamente em português, pronto para colar no Lovable, Bolt, v0 ou ChatGPT!
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nome do seu Negócio / Projeto
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ex: Barbearia Vip, Dra. Ana Silva, Hamburgueria Zé..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ferramenta de IA que você vai usar
                      </label>
                      <select
                        value={aiTarget}
                        onChange={(e) => setAiTarget(e.target.value as AiTarget)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer font-semibold text-slate-800"
                      >
                        <option value="lovable">Lovable (Recomendado para Web Apps)</option>
                        <option value="bolt">Bolt.new (Fullstack rápido)</option>
                        <option value="v0">v0 da Vercel (Componentes Next.js / React)</option>
                        <option value="chatgpt">ChatGPT (GPT-4o)</option>
                        <option value="claude">Claude (Sonnet 3.5)</option>
                        <option value="cursor">Cursor / Antigravity (Editor de Código)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        O que sua empresa faz ou vende? (Opcional)
                      </label>
                      <input
                        type="text"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        placeholder="Ex: Clínica odontológica moderna em SP focada em implantes e clareamento dental"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  {/* Generated Prompt Box */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-blue-600" />
                        Prompt Pronto para Copiar:
                      </span>
                      <button
                        onClick={handleCopyPersonalized}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition ${
                          copiedPersonalized
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                        }`}
                      >
                        {copiedPersonalized ? (
                          <>
                            <Check className="w-4 h-4 stroke-[2.5]" />
                            <span>Copiado com Sucesso!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copiar Prompt Personalizado</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed border border-slate-800">
                      {customizedPromptText}
                    </pre>
                  </div>
                </div>
              ) : activeTab === 'full-prompt' ? (
                /* TAB 2: PROMPT ORIGINAL */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Prompt original completo sem modificações ({detail?.prompt.length || 0} caracteres)
                    </span>
                    <button
                      onClick={handleCopyRaw}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        copiedRaw
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {copiedRaw ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Original</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono whitespace-pre-wrap max-h-[500px] overflow-y-auto leading-relaxed border border-slate-800">
                    {detail?.prompt || 'Nenhum prompt disponível.'}
                  </pre>
                </div>
              ) : (
                /* TAB 3: COMPONENTES & SEÇÕES */
                <div className="space-y-4">
                  {detail?.structured?.style && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          🎨 Diretrizes de Estilo Visual
                        </span>
                        <button
                          onClick={() => handleCopyBlock('style', detail.structured!.style!)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-600 transition"
                        >
                          {copiedSection === 'style' ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copiar Estilo</span>
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-slate-800 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">
                        {detail.structured.style}
                      </pre>
                    </div>
                  )}

                  {detail?.structured?.layout && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          📐 Estrutura de Layout
                        </span>
                        <button
                          onClick={() => handleCopyBlock('layout', detail.structured!.layout!)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-600 transition"
                        >
                          {copiedSection === 'layout' ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copiar Layout</span>
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-slate-800 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">
                        {detail.structured.layout}
                      </pre>
                    </div>
                  )}

                  {detail?.structured?.components && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                        🧩 Componentes Específicos
                      </span>
                      {Object.entries(detail.structured.components).map(([cName, cContent]) => (
                        <div
                          key={cName}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-blue-700">{cName}</span>
                            <button
                              onClick={() => handleCopyBlock(cName, cContent)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-600 transition"
                            >
                              {copiedSection === cName ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copiar Bloco</span>
                            </button>
                          </div>
                          <pre className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {cContent}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Interactive Frame Preview */}
          <div className="w-full lg:w-1/2 flex flex-col bg-slate-950 overflow-hidden">
            {/* Frame Controls Bar */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Pré-visualização Interativa</span>
              </div>

              {/* Viewport switchers */}
              <div className="flex items-center bg-slate-800 p-1 rounded-xl gap-1">
                <button
                  onClick={() => setFrameSize('desktop')}
                  className={`p-1.5 rounded-lg transition ${
                    frameSize === 'desktop'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Visão Computador (100%)"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setFrameSize('tablet')}
                  className={`p-1.5 rounded-lg transition ${
                    frameSize === 'tablet'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Visão Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setFrameSize('mobile')}
                  className={`p-1.5 rounded-lg transition ${
                    frameSize === 'mobile'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Visão Celular (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Iframe or Fallback container */}
            <div className="flex-1 bg-slate-900/90 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              {item.previewUrl ? (
                <div
                  className={`h-full bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col border border-slate-800 ${
                    frameSize === 'mobile'
                      ? 'w-[375px] max-w-full'
                      : frameSize === 'tablet'
                      ? 'w-[768px] max-w-full'
                      : 'w-full'
                  }`}
                >
                  <iframe
                    src={item.previewUrl}
                    title={item.titlePt || item.title}
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400 max-w-md">
                  <div className="w-16 h-16 rounded-3xl bg-slate-800 text-blue-400 flex items-center justify-center mx-auto mb-4">
                    <Laptop className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Visualização em Código Puro
                  </h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Este modelo é focado em lógica, regras e componentes diretos. Copie o prompt e
                    cole no Lovable, Bolt ou v0 para ver a interface renderizada instantaneamente!
                  </p>
                  <button
                    onClick={handleCopyPersonalized}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition inline-flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copiar e Testar no Lovable
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
