import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Laptop,
  Smartphone,
  Tablet,
  Sparkles,
  Layers,
  Wand2,
  FileCode,
  Heart,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { PromptItem, PromptDetail, AiTarget, ColorPalette, ColorPaletteMode, PaletteColors } from '../types/catalog';
import { fetchPromptDetail, personalizePrompt } from '../services/api';
import { COLOR_PRESETS } from '../lib/palettes';
import { PalettePreview } from './PalettePreview';

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
  // Hooks SEMPRE rodando na mesma ordem — o early return fica depois deles.
  const [detail, setDetail] = useState<PromptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveViewTab>('personalize');
  const [previewMode, setPreviewMode] = useState<'interactive' | 'screenshot'>('interactive');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [frameSize, setFrameSize] = useState<FrameSize>(
    item?.previewDevice === 'mobile' ? 'mobile' : 'desktop'
  );

  // Personalization state
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [aiTarget, setAiTarget] = useState<AiTarget>('arena');
  const [language, setLanguage] = useState<'pt-BR' | 'en'>('pt-BR');

  const [copiedPersonalized, setCopiedPersonalized] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Paleta de cores aplicada ao prompt personalizado
  const [paletteMode, setPaletteMode] = useState<ColorPaletteMode>('original');
  const [presetId, setPresetId] = useState<string>(COLOR_PRESETS[0].id);
  const [customColors, setCustomColors] = useState<PaletteColors>({
    background: '#09090B',
    text: '#FAFAFA',
    accent: '#DFE104',
    neutral: '#3F3F46',
  });

  const activePalette: ColorPalette =
    paletteMode === 'original'
      ? { mode: 'original' }
      : paletteMode === 'preset'
      ? { mode: 'preset', presetId }
      : { mode: 'custom', colors: customColors };

  const activeColors: PaletteColors | null =
    paletteMode === 'custom'
      ? customColors
      : paletteMode === 'preset'
      ? COLOR_PRESETS.find((p) => p.id === presetId)?.colors ?? null
      : null;

  useEffect(() => {
    if (!item) return;
    let mounted = true;
    setLoading(true);
    setDetail(null);
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
  }, [item?.id]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const customizedPromptText = detail
    ? personalizePrompt(item, detail, {
        businessName,
        businessType,
        language,
        aiTarget,
        palette: activePalette,
      })
    : '';

  const handleCopyPersonalized = async () => {
    if (!customizedPromptText) return;
    await navigator.clipboard.writeText(customizedPromptText);
    setCopiedPersonalized(true);
    onCopySuccess(
      'PROMPT PERSONALIZADO COPIADO!',
      `OTIMIZADO PARA ${aiTarget.toUpperCase()} EM PORTUGUÊS`
    );
    setTimeout(() => setCopiedPersonalized(false), 2200);
  };

  const handleCopyRaw = async () => {
    if (!detail?.prompt) return;
    await navigator.clipboard.writeText(detail.prompt);
    setCopiedRaw(true);
    onCopySuccess('PROMPT ORIGINAL COPIADO!', 'PRONTO PARA QUALQUER IA');
    setTimeout(() => setCopiedRaw(false), 2200);
  };

  const handleCopyBlock = async (key: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedSection(key);
    onCopySuccess(`SEÇÃO "${key.toUpperCase()}" COPIADA!`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div
        className="bg-[#09090B] w-full max-w-7xl h-[100dvh] sm:h-[94vh] border-0 sm:border-2 sm:border-[#3F3F46] flex flex-col overflow-hidden rounded-none shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Navigation Header */}
        <div className="px-6 py-4 border-b-2 border-[#3F3F46] flex items-center justify-between gap-4 bg-[#09090B] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-[#DFE104] text-black shrink-0 font-mono">
              {item.categoryLabelPt}
            </span>
            <div className="truncate">
              <h2 className="text-base sm:text-xl font-black text-[#FAFAFA] font-heading uppercase tracking-tight truncate">
                {item.titlePt || item.title}
              </h2>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wider truncate hidden sm:block">
                {item.idealForPt || item.summaryPt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(item.id)}
              className={`h-10 px-3 border-2 transition rounded-none cursor-pointer flex items-center gap-1.5 ${
                isFavorite
                  ? 'bg-rose-600 border-rose-600 text-white'
                  : 'bg-[#27272A] border-[#3F3F46] text-[#FAFAFA] hover:border-[#DFE104]'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Favoritar este modelo'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Source link (fontes abertas) */}
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 bg-[#27272A] border-2 border-[#3F3F46] text-xs font-bold uppercase tracking-wider text-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-black transition rounded-none flex items-center gap-1.5"
                title="Abrir a fonte original deste modelo"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">FONTE</span>
              </a>
            )}

            {/* External link */}
            {item.previewUrl && (
              <a
                href={item.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 bg-[#27272A] border-2 border-[#3F3F46] text-xs font-bold uppercase tracking-wider text-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-black transition rounded-none flex items-center gap-1.5"
                title="Abrir pré-visualização em tela cheia"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">NOVA ABA</span>
              </a>
            )}

            {/* Close modal */}
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center bg-[#27272A] border-2 border-[#3F3F46] text-[#FAFAFA] hover:bg-rose-600 hover:border-rose-600 transition rounded-none cursor-pointer"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Split into Left: Customizer & Right: Live Frame) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          {/* Left Column: Personalizer & Prompts */}
          <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r-2 border-[#3F3F46] bg-[#09090B] lg:overflow-hidden">
            {/* View Tabs */}
            <div className="flex items-center border-b-2 border-[#3F3F46] px-6 pt-3 gap-2 shrink-0 bg-[#09090B]">
              <button
                onClick={() => setActiveTab('personalize')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition cursor-pointer rounded-none ${
                  activeTab === 'personalize'
                    ? 'border-[#DFE104] text-[#DFE104] bg-[#27272A]'
                    : 'border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]'
                }`}
              >
                <Wand2 className="w-4 h-4 text-[#DFE104]" />
                <span>PERSONALIZADOR MÁGICO</span>
              </button>

              <button
                onClick={() => setActiveTab('full-prompt')}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition cursor-pointer rounded-none ${
                  activeTab === 'full-prompt'
                    ? 'border-[#DFE104] text-[#DFE104] bg-[#27272A]'
                    : 'border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>PROMPT COMPLETO</span>
              </button>

              {detail?.structured && (
                <button
                  onClick={() => setActiveTab('components')}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition cursor-pointer rounded-none ${
                    activeTab === 'components'
                      ? 'border-[#DFE104] text-[#DFE104] bg-[#27272A]'
                      : 'border-transparent text-[#A1A1AA] hover:text-[#FAFAFA]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>SEÇÕES & BLOCOS</span>
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="p-6 space-y-6 lg:flex-1 lg:overflow-y-auto">
              {loading ? (
                <div className="space-y-4 py-12">
                  <div className="h-6 bg-[#27272A] animate-pulse" />
                  <div className="h-28 bg-[#27272A] animate-pulse" />
                  <div className="h-48 bg-[#27272A] animate-pulse" />
                </div>
              ) : activeTab === 'personalize' ? (
                /* TAB 1: PERSONALIZADOR MÁGICO */
                <div className="space-y-5">
                  <div className="bg-[#DFE104] text-black border-2 border-black p-4 text-xs font-bold uppercase tracking-wider rounded-none">
                    <div className="flex items-center gap-2 font-black mb-1">
                      <Sparkles className="w-4 h-4" />
                      COMO FUNCIONA:
                    </div>
                    DIGITE O NOME E O RAMO DA SUA EMPRESA. ESCOLHA UMA PALETA DE CORES (OU PERSONALIZE AS SUAS). ADAPTAMOS TUDO AUTOMATICAMENTE EM PORTUGUÊS PARA O ARENA.AI, CODEX DESKTOP, ANTIGRAVITY OU CHATGPT.
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#FAFAFA] mb-1.5 font-mono">
                        NOME DA SUA EMPRESA // PROJETO
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="EX: BARBEARIA VIP, DRA. ANA SILVA..."
                        className="w-full px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-[#27272A] border-2 border-[#3F3F46] text-[#FAFAFA] placeholder:text-[#A1A1AA]/50 focus:border-[#DFE104] focus:outline-none rounded-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[#FAFAFA] mb-1.5 font-mono">
                        FERRAMENTA DE IA DESTINO
                      </label>
                      <select
                        value={aiTarget}
                        onChange={(e) => setAiTarget(e.target.value as AiTarget)}
                        className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider bg-[#27272A] border-2 border-[#3F3F46] text-[#DFE104] focus:border-[#DFE104] focus:outline-none cursor-pointer rounded-none"
                      >
                        <option value="arena">ARENA.AI (SINGLE-FILE COMPONENT)</option>
                        <option value="codex">CHATGPT / CODEX DESKTOP</option>
                        <option value="antigravity">ANTIGRAVITY DESKTOP (GOOGLE AGENTIC IDE)</option>
                        <option value="chatgpt">CHATGPT (PASSO A PASSO GERAL)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase tracking-wider text-[#FAFAFA] mb-1.5 font-mono">
                        O QUE SUA EMPRESA FAZ OU VENDE? (OPCIONAL)
                      </label>
                      <input
                        type="text"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        placeholder="EX: CLINICA ODONTOLOGICA MODERNA EM SP FOCADA EM IMPLANTES E ESTETICA"
                        className="w-full px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-[#27272A] border-2 border-[#3F3F46] text-[#FAFAFA] placeholder:text-[#A1A1AA]/50 focus:border-[#DFE104] focus:outline-none rounded-none"
                      />
                    </div>
                  </div>

                  {/* Paleta de cores */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#FAFAFA] mb-2 font-mono">
                      PALETA DE CORES (OPCIONAL)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setPaletteMode('original')}
                        title="Manter as cores originais do modelo"
                        className={`flex items-center gap-2 px-3 py-2 text-[11px] font-black uppercase tracking-wider border-2 rounded-none transition cursor-pointer ${
                          paletteMode === 'original'
                            ? 'bg-[#DFE104] text-black border-[#DFE104]'
                            : 'bg-[#27272A] text-[#FAFAFA] border-[#3F3F46] hover:border-[#DFE104]'
                        }`}
                      >
                        <span>ORIGINAL</span>
                      </button>

                      {COLOR_PRESETS.map((p) => {
                        const isSelected = paletteMode === 'preset' && presetId === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              setPaletteMode('preset');
                              setPresetId(p.id);
                            }}
                            title={p.notePt}
                            className={`flex items-center gap-2 px-3 py-2 text-[11px] font-black uppercase tracking-wider border-2 rounded-none transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#DFE104] text-black border-[#DFE104]'
                                : 'bg-[#27272A] text-[#FAFAFA] border-[#3F3F46] hover:border-[#DFE104]'
                            }`}
                          >
                            <span className="flex gap-0.5">
                              {[
                                p.colors.background,
                                p.colors.text,
                                p.colors.accent,
                                p.colors.neutral,
                              ].map((c, i) => (
                                <span
                                  key={i}
                                  className="w-3 h-3 border border-black/40"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </span>
                            <span>{p.labelPt}</span>
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setPaletteMode('custom')}
                        title="Escolher suas próprias cores"
                        className={`flex items-center gap-2 px-3 py-2 text-[11px] font-black uppercase tracking-wider border-2 rounded-none transition cursor-pointer ${
                          paletteMode === 'custom'
                            ? 'bg-[#DFE104] text-black border-[#DFE104]'
                            : 'bg-[#27272A] text-[#FAFAFA] border-[#3F3F46] hover:border-[#DFE104]'
                        }`}
                      >
                        <span>🎨 PERSONALIZAR</span>
                      </button>
                    </div>

                    {paletteMode === 'custom' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 bg-[#18181B] border-2 border-[#3F3F46] p-4">
                        {(
                          [
                            ['background', 'Fundo'],
                            ['text', 'Texto'],
                            ['accent', 'Destaque (CTA)'],
                            ['neutral', 'Bordas/Neutro'],
                          ] as const
                        ).map(([key, label]) => (
                          <div key={key} className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                              {label}
                            </span>
                            <input
                              type="color"
                              value={customColors[key]}
                              onChange={(e) =>
                                setCustomColors((c) => ({ ...c, [key]: e.target.value }))
                              }
                              aria-label={label}
                              className="w-full h-9 border-2 border-[#3F3F46] bg-transparent cursor-pointer rounded-none p-0.5"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {paletteMode !== 'original' && activeColors && (
                      <>
                        <PalettePreview
                          colors={activeColors}
                          labelPt={
                            paletteMode === 'custom'
                              ? 'Personalizado'
                              : COLOR_PRESETS.find((p) => p.id === presetId)?.labelPt || ''
                          }
                          device={item.previewDevice}
                        />
                        <p className="mt-2 text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider">
                          // AS CORES SERÃO INJETADAS COMO REGRAS OBRIGATÓRIAS NO PROMPT COPIADO.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Generated Prompt Box */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-[#DFE104] flex items-center gap-1.5 font-mono">
                        <FileCode className="w-3.5 h-3.5" />
                        PROMPT PRONTO:
                      </span>
                      <button
                        onClick={handleCopyPersonalized}
                        className={`h-11 px-5 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 rounded-none cursor-pointer ${
                          copiedPersonalized
                            ? 'bg-emerald-500 text-black'
                            : 'bg-[#DFE104] text-black hover:scale-105 active:scale-95'
                        }`}
                      >
                        {copiedPersonalized ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>COPIADO COM SUCESSO!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>COPIAR PROMPT PERSONALIZADO</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 bg-[#18181B] text-[#FAFAFA] text-xs font-mono whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed border-2 border-[#3F3F46] rounded-none">
                      {customizedPromptText}
                    </pre>
                  </div>
                </div>
              ) : activeTab === 'full-prompt' ? (
                /* TAB 2: PROMPT ORIGINAL */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#A1A1AA] uppercase">
                      PROMPT ORIGINAL ({detail?.prompt.length || 0} CARACTERES)
                    </span>
                    <button
                      onClick={handleCopyRaw}
                      className={`h-10 px-4 text-xs font-black uppercase tracking-wider transition rounded-none cursor-pointer flex items-center gap-1.5 ${
                        copiedRaw
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#DFE104] text-black hover:scale-105 active:scale-95'
                      }`}
                    >
                      {copiedRaw ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>COPIADO!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPIAR ORIGINAL</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 bg-[#18181B] text-[#FAFAFA] text-xs font-mono whitespace-pre-wrap max-h-[500px] overflow-y-auto leading-relaxed border-2 border-[#3F3F46] rounded-none">
                    {detail?.prompt || 'Nenhum prompt disponível.'}
                  </pre>
                </div>
              ) : (
                /* TAB 3: COMPONENTES & SEÇÕES */
                <div className="space-y-4">
                  {detail?.structured?.style && (
                    <div className="bg-[#18181B] border-2 border-[#3F3F46] p-4 rounded-none">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#3F3F46]">
                        <span className="text-xs font-black uppercase tracking-wider text-[#DFE104] font-mono">
                          // DIRETRIZES DE ESTILO VISUAL
                        </span>
                        <button
                          onClick={() => handleCopyBlock('style', detail.structured!.style!)}
                          className="h-8 px-3 text-[11px] font-bold uppercase bg-[#27272A] hover:bg-[#FAFAFA] hover:text-black text-[#FAFAFA] transition rounded-none cursor-pointer flex items-center gap-1"
                        >
                          {copiedSection === 'style' ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>COPIAR ESTILO</span>
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-[#FAFAFA] whitespace-pre-wrap">
                        {detail.structured.style}
                      </pre>
                    </div>
                  )}

                  {detail?.structured?.layout && (
                    <div className="bg-[#18181B] border-2 border-[#3F3F46] p-4 rounded-none">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#3F3F46]">
                        <span className="text-xs font-black uppercase tracking-wider text-[#DFE104] font-mono">
                          // ESTRUTURA DE LAYOUT
                        </span>
                        <button
                          onClick={() => handleCopyBlock('layout', detail.structured!.layout!)}
                          className="h-8 px-3 text-[11px] font-bold uppercase bg-[#27272A] hover:bg-[#FAFAFA] hover:text-black text-[#FAFAFA] transition rounded-none cursor-pointer flex items-center gap-1"
                        >
                          {copiedSection === 'layout' ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>COPIAR LAYOUT</span>
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-[#FAFAFA] whitespace-pre-wrap">
                        {detail.structured.layout}
                      </pre>
                    </div>
                  )}

                  {detail?.structured?.components && (
                    <div className="space-y-3">
                      <span className="text-xs font-black uppercase tracking-widest text-[#FAFAFA] font-mono block">
                        // COMPONENTES MODULARES
                      </span>
                      {Object.entries(detail.structured.components).map(([cName, cContent]) => (
                        <div
                          key={cName}
                          className="bg-[#18181B] border-2 border-[#3F3F46] p-4 rounded-none"
                        >
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#3F3F46]">
                            <span className="text-xs font-black uppercase tracking-wider text-[#DFE104] font-mono">
                              {cName}
                            </span>
                            <button
                              onClick={() => handleCopyBlock(cName, cContent)}
                              className="h-8 px-3 text-[11px] font-bold uppercase bg-[#27272A] hover:bg-[#FAFAFA] hover:text-black text-[#FAFAFA] transition rounded-none cursor-pointer flex items-center gap-1"
                            >
                              {copiedSection === cName ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>COPIAR BLOCO</span>
                            </button>
                          </div>
                          <pre className="text-xs font-mono text-[#FAFAFA] whitespace-pre-wrap max-h-40 overflow-y-auto">
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

          {/* Barra de cópia fixa no mobile */}
          <div className="lg:hidden sticky bottom-0 border-t-2 border-[#3F3F46] bg-[#09090B] p-3">
            <button
              onClick={handleCopyPersonalized}
              className={`h-12 w-full text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-none cursor-pointer ${
                copiedPersonalized
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#DFE104] text-black hover:scale-[1.01] active:scale-95'
              }`}
            >
              {copiedPersonalized ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>COPIADO COM SUCESSO!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPIAR PROMPT PERSONALIZADO</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Visual Preview Panel */}
          <div className="w-full lg:w-1/2 flex flex-col bg-[#000000] overflow-hidden h-[72vh] lg:h-auto shrink-0">
            {/* Frame Controls Bar */}
            <div className="px-5 py-3 bg-[#09090B] border-b-2 border-[#3F3F46] flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Interactive vs Screenshot mode switcher */}
              <div className="flex items-center bg-[#27272A] p-0.5 border-2 border-[#3F3F46]">
                <button
                  onClick={() => setPreviewMode('interactive')}
                  className={`px-3 py-1 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    previewMode === 'interactive'
                      ? 'bg-[#DFE104] text-black'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  ⚡ AO VIVO
                </button>
                <button
                  onClick={() => setPreviewMode('screenshot')}
                  className={`px-3 py-1 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    previewMode === 'screenshot'
                      ? 'bg-[#DFE104] text-black'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  🖼️ SCREENSHOT HD
                </button>
              </div>

              {/* Viewport switchers */}
              <div className="flex items-center gap-2">
                {previewMode === 'interactive' && item.previewUrl && (
                  <div className="flex items-center bg-[#27272A] p-0.5 border-2 border-[#3F3F46]">
                    <button
                      onClick={() => setFrameSize('desktop')}
                      className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        frameSize === 'desktop'
                          ? 'bg-[#DFE104] text-black'
                          : 'text-[#A1A1AA] hover:text-white'
                      }`}
                      title="Visão Computador (100%)"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setFrameSize('tablet')}
                      className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        frameSize === 'tablet'
                          ? 'bg-[#DFE104] text-black'
                          : 'text-[#A1A1AA] hover:text-white'
                      }`}
                      title="Visão Tablet (768px)"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setFrameSize('mobile')}
                      className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        frameSize === 'mobile'
                          ? 'bg-[#DFE104] text-black'
                          : 'text-[#A1A1AA] hover:text-white'
                      }`}
                      title="Visão Celular (375px)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {item.previewUrl && (
                  <a
                    href={item.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 px-2.5 bg-[#27272A] hover:bg-[#FAFAFA] hover:text-black text-[#FAFAFA] border-2 border-[#3F3F46] text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1"
                    title="Abrir pré-visualização em tela cheia externa"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span className="hidden sm:inline">NOVA ABA</span>
                  </a>
                )}
              </div>
            </div>

            {/* Preview Frame Container */}
            <div className="flex-1 bg-[#000000] flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
              {previewMode === 'interactive' && item.previewUrl ? (
                <div
                  className={`h-full bg-white border-2 border-[#3F3F46] overflow-hidden transition-all duration-300 flex flex-col rounded-none relative ${
                    frameSize === 'mobile'
                      ? 'w-[375px] max-w-full'
                      : frameSize === 'tablet'
                      ? 'w-[768px] max-w-full'
                      : 'w-full'
                  }`}
                >
                  <iframe
                    src={`/api/preview?url=${encodeURIComponent(item.previewUrl)}`}
                    title={item.titlePt || item.title}
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    loading="eager"
                  />
                </div>
              ) : item.thumbnailUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center overflow-auto p-4 bg-[#09090B] border-2 border-[#3F3F46]">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.titlePt || item.title}
                    className="max-w-full max-h-full object-contain border-2 border-[#3F3F46]"
                  />
                  <div className="mt-3 text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider">
                    // CAPTURA VISUAL EM ALTA RESOLUÇÃO
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-[#A1A1AA] max-w-md border-2 border-[#3F3F46] bg-[#09090B]">
                  <div className="w-16 h-16 bg-[#27272A] border-2 border-[#DFE104] text-[#DFE104] flex items-center justify-center mx-auto mb-4 rounded-none">
                    <Laptop className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black uppercase text-white mb-2 font-heading tracking-tight">
                    CÓDIGO E REGRAS DIRETAS
                  </h4>
                  <p className="text-xs text-[#A1A1AA] uppercase tracking-wider mb-6 leading-relaxed font-mono">
                    ESTE MODELO FOI CONSTRUÍDO COM REGRAS PURAS PARA GERAR TELAS NO ARENA.AI, CODEX OU ANTIGRAVITY.
                  </p>
                  <button
                    onClick={handleCopyPersonalized}
                    className="h-12 px-6 bg-[#DFE104] text-black text-xs font-black uppercase tracking-wider transition rounded-none inline-flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Copy className="w-4 h-4" />
                    <span>COPIAR PARA O ARENA.AI</span>
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
