import { CatalogIndex, DesignSystemsCatalog, PromptDetail, PromptItem, ColorPalette } from '../types/catalog';
import { COLOR_PRESETS } from '../lib/palettes';

let catalogIndexCache: CatalogIndex | null = null;
let designSystemsCache: DesignSystemsCatalog | null = null;
const promptDetailCache = new Map<string, PromptDetail>();

export async function fetchCatalogIndex(): Promise<CatalogIndex> {
  if (catalogIndexCache) return catalogIndexCache;

  const res = await fetch('/data/catalog-index.json');
  if (!res.ok) {
    throw new Error(`Falha ao carregar catálogo: ${res.statusText}`);
  }
  const data: CatalogIndex = await res.json();
  catalogIndexCache = data;
  return data;
}

export async function fetchDesignSystems(): Promise<DesignSystemsCatalog> {
  if (designSystemsCache) return designSystemsCache;

  const res = await fetch('/data/design-systems.json');
  if (!res.ok) {
    throw new Error(`Falha ao carregar sistemas de design: ${res.statusText}`);
  }
  const data: DesignSystemsCatalog = await res.json();
  designSystemsCache = data;
  return data;
}

export async function fetchPromptDetail(id: string): Promise<PromptDetail> {
  if (promptDetailCache.has(id)) {
    return promptDetailCache.get(id)!;
  }

  try {
    const res = await fetch(`/data/p/${id}.json`);
    if (res.ok) {
      const data: PromptDetail = await res.json();
      promptDetailCache.set(id, data);
      return data;
    }
  } catch (err) {
    console.warn(`Tentando fallback remoto para o prompt ${id}...`, err);
  }

  // Fallback direct to original API if local file fails
  const remoteRes = await fetch(`https://api.superdesign.dev/v1/prompt-library/${id}`);
  if (!remoteRes.ok) {
    throw new Error(`Falha ao carregar detalhes do prompt ${id}`);
  }
  const remoteData = await remoteRes.json();
  const detail: PromptDetail = {
    id: remoteData.id,
    slug: remoteData.slug || remoteData.id,
    fullDescription: remoteData.description || '',
    prompt: remoteData.prompt || '',
    structured: remoteData.structured || null,
    images: remoteData.images || [],
  };
  promptDetailCache.set(id, detail);
  return detail;
}

// LocalStorage Favorites
const FAVORITES_KEY = 'superdesign_pt_favorites';
export function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteId(id: string): boolean {
  try {
    const favs = getFavoriteIds();
    const exists = favs.includes(id);
    const updated = exists ? favs.filter((f) => f !== id) : [...favs, id];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}

export function isFavoriteId(id: string): boolean {
  return getFavoriteIds().includes(id);
}

// Personalizador Mágico de Prompts
export interface PersonalizeOptions {
  businessName: string;
  businessType: string;
  language: 'pt-BR' | 'en';
  aiTarget: 'arena' | 'codex' | 'antigravity' | 'chatgpt';
  palette: ColorPalette;
}

// Bloco de cores injetado no prompt quando o usuário escolhe/Personaliza uma paleta.
function buildPaletteBlock(palette: ColorPalette, isPt: boolean): string {
  if (palette.mode === 'original') return '';

  let colors = palette.colors;
  let note = '';
  if (palette.mode === 'preset' && palette.presetId) {
    const preset = COLOR_PRESETS.find((p) => p.id === palette.presetId);
    if (!preset) return '';
    colors = preset.colors;
    note = isPt ? preset.notePt : '';
  }
  if (!colors) return '';

  if (isPt) {
    return `\n\n[PALETA DE CORES OBRIGATÓRIA]\n- Cor de fundo: ${colors.background}\n- Cor do texto principal: ${colors.text}\n- Cor de destaque (CTAs, links e detalhes): ${colors.accent}\n- Bordas e elementos neutros: ${colors.neutral}\nDiretivas: use EXATAMENTE estas cores em TODA a interface. ${note} Garanta contraste legível (mínimo AA). Não introduza cores fora desta paleta (exceto variações de estado como hover/active/disabled). Mantenha consistência visual em todas as seções.`;
  }
  return `\n\n[REQUIRED COLOR PALETTE]\n- Background: ${colors.background}\n- Primary text: ${colors.text}\n- Accent (CTAs, links, highlights): ${colors.accent}\n- Borders & neutral elements: ${colors.neutral}\nDirectives: use EXACTLY these colors across the entire interface. Ensure readable contrast (minimum AA). Do not introduce colors outside this palette (except state variations like hover/active/disabled). Keep visual consistency across all sections.`;
}

export function personalizePrompt(
  item: PromptItem,
  detail: PromptDetail,
  options: PersonalizeOptions
): string {
  const { businessName, businessType, language, aiTarget, palette } = options;
  const isPt = language === 'pt-BR';

  const basePrompt = detail.prompt || '';
  const hasCustomBiz = businessName.trim().length > 0;

  let targetPrefix = '';
  let targetInstructions = '';

  switch (aiTarget) {
    case 'arena':
      targetPrefix = isPt
        ? `Você é um Engenheiro Frontend Sênior e UI Designer competindo no ARENA.AI. Crie a melhor e mais impressionante interface em React + Tailwind CSS, auto-contida em um único componente executável.`
        : `You are a Senior Frontend Engineer and UI Designer competing on ARENA.AI. Output the single best, most visually stunning self-contained React + Tailwind CSS component.`;
      targetInstructions = isPt
        ? `\n\nDIRETIVAS CRÍTICAS PARA ARENA.AI:\n1. Código 100% autocontido em um único arquivo React (Single-File Component) pronto para visualização instantânea.\n2. Utilize Tailwind CSS para estilização moderna e Lucide Icons (ou SVGs inline) sem dependências externas não resolvidas.\n3. Todos os textos, botões e labels em Português do Brasil.\n4. Inclua estados interativos dinâmicos (hover, active, tabs, filtros e dados simulados realistas).\n5. Zero erros de compilação ou TypeScript.`
        : `\n\nARENA.AI BUILD RULES:\n1. 100% self-contained single-file React component ready for instant rendering.\n2. Modern Tailwind CSS styling with Lucide icons (or inline SVGs) without missing packages.\n3. Realistic localized data and interactive states.\n4. Zero runtime errors.`;
      break;

    case 'codex':
      targetPrefix = isPt
        ? `Instrução para CODEX DESKTOP / ChatGPT:\nVocê é um Arquiteto de Software e Engenheiro de UI implementando este sistema diretamente no ambiente desktop do Codex.`
        : `Instructions for CODEX DESKTOP / ChatGPT:\nYou are a Software Architect and UI Engineer implementing this system directly in the Codex Desktop environment.`;
      targetInstructions = isPt
        ? `\n\nDIRETRIZES TÉCNICAS PARA CODEX DESKTOP:\n1. Estruture a aplicação de forma modular em arquivos limpos com TypeScript rigoroso.\n2. Estilize com classes utilitárias do Tailwind CSS respeitando o design system.\n3. Localize todos os textos para o público brasileiro com linguagem comercial de alto padrão.\n4. Forneça o código completo de cada arquivo necessário para rodar no projeto.`
        : `\n\nCODEX DESKTOP TECHNICAL DIRECTIVES:\n1. Modularize cleanly into strongly-typed TypeScript React files.\n2. Apply idiomatic Tailwind CSS utility classes.\n3. Output full implementation files ready for drop-in.`;
      break;

    case 'antigravity':
      targetPrefix = isPt
        ? `Instrução para Antigravity Desktop (Google Antigravity Agentic IDE):\nAtue como o Agente de Código Sênior do Antigravity implementando esta interface de alta fidelidade no workspace.`
        : `Instructions for Antigravity Desktop (Google Antigravity Agentic IDE):\nAct as the Senior Code Agent implementing this high-fidelity interface directly into the workspace.`;
      targetInstructions = isPt
        ? `\n\nPLANO DE IMPLEMENTAÇÃO ANTIGRAVITY:\n1. Analise o design system, tokens de cores e componentes necessários.\n2. Escreva o código nos arquivos do projeto usando React funcional + Tailwind CSS.\n3. Preserve integridade arquitetural, micro-interações fluidas e responsividade (Desktop/Mobile).\n4. Todos os textos adaptados para o contexto do cliente no Brasil.`
        : `\n\nANTIGRAVITY IMPLEMENTATION PLAN:\n1. Analyze design tokens and component requirements.\n2. Implement React + Tailwind components into workspace.\n3. Ensure fluid micro-interactions and responsive layouts.\n4. Localize all text.`;
      break;

    case 'chatgpt':
    default:
      targetPrefix = isPt
        ? `Você é um Diretor de Arte e Desenvolvedor Full-Stack especialista em criar produtos digitais modernos de altíssima conversão.`
        : `You are a World-Class Art Director and Full-Stack Web Architect specialized in high-conversion digital experiences.`;
      targetInstructions = isPt
        ? `\n\nPor favor, escreva o código completo (React + Tailwind CSS) e explique o passo a passo de como integrar.`
        : `\n\nPlease output the complete clean React + Tailwind CSS code with step-by-step guidance.`;
      break;
  }

  let businessContext = '';
  if (hasCustomBiz) {
    businessContext = isPt
      ? `\n\n[CONTEXTO DO PROJETO / CLIENTE]\n- Nome da Empresa / Projeto: ${businessName}\n- Ramo de Atuação / Descrição: ${businessType || 'Geral'}\n- Público-Alvo: Clientes brasileiros que valorizam qualidade, confiança e inovação.\n- Adapte todos os textos, títulos, chamadas para ação (CTAs), depoimentos e imagens para este nicho específico.\n`
      : `\n\n[PROJECT CONTEXT]\n- Project Name: ${businessName}\n- Industry / Business Type: ${businessType || 'General'}\n- Target Audience: Customers who value modern quality and intuitive design.\n- Adapt all copywriting, headlines, CTAs, and examples to fit this business.\n`;
  }

  // Combine
  const paletteBlock = buildPaletteBlock(palette, isPt);
  let result = `${targetPrefix}${businessContext}${paletteBlock}\n${basePrompt}${targetInstructions}`;

  return result.trim();
}
