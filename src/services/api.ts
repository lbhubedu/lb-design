import { CatalogIndex, DesignSystemsCatalog, PromptDetail, PromptItem } from '../types/catalog';

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
  aiTarget: 'lovable' | 'bolt' | 'v0' | 'chatgpt' | 'claude' | 'cursor';
}

export function personalizePrompt(
  item: PromptItem,
  detail: PromptDetail,
  options: PersonalizeOptions
): string {
  const { businessName, businessType, language, aiTarget } = options;
  const isPt = language === 'pt-BR';

  const basePrompt = detail.prompt || '';
  const hasCustomBiz = businessName.trim().length > 0;

  let targetPrefix = '';
  let targetInstructions = '';

  switch (aiTarget) {
    case 'lovable':
    case 'bolt':
    case 'v0':
      targetPrefix = isPt
        ? `Você é um desenvolvedor Frontend Sênior e UI Designer especialista em React, Tailwind CSS e Lucide Icons.`
        : `You are a Senior Frontend Engineer and UI Designer specialized in modern React, Tailwind CSS, and Lucide Icons.`;
      targetInstructions = isPt
        ? `\n\nREGRAS DE CONSTRUÇÃO:\n1. Crie uma aplicação React completa, responsiva, interativa e sem erros de TypeScript.\n2. Utilize Tailwind CSS para estilização moderna e componentes refinados.\n3. Todos os textos, botões e títulos devem estar em Português do Brasil.\n4. Inclua estados interativos (hover, active, transições suaves).\n5. Adicione micro-interações elegantes e dados de exemplo realistas.`
        : `\n\nBUILD RULES:\n1. Create a production-ready, highly interactive React application with Tailwind CSS.\n2. Ensure zero TypeScript or React runtime errors.\n3. All copy, titles, and buttons must be localized for the project context.\n4. Include fluid micro-interactions, smooth hover states, and realistic mock data.`;
      break;

    case 'cursor':
      targetPrefix = isPt
        ? `Instrução para Cursor / Agente de Código:\nCrie ou adapte o componente/página a seguir seguindo rigorosamente as diretrizes visuais e arquiteturais abaixo.`
        : `Instructions for Cursor / Code Agent:\nBuild or adapt the component/page strictly following the visual and structural architecture below.`;
      targetInstructions = isPt
        ? `\n\nDIRETRIZES TÉCNICAS:\n- Use componentes funcionais React com TypeScript limpo.\n- Modularize em componentes reutilizáveis.\n- Estilize via Tailwind CSS utility classes.`
        : `\n\nTECHNICAL DIRECTIVES:\n- Use modular React functional components with clean TypeScript.\n- Keep styling fully idiomatic with Tailwind CSS.`;
      break;

    case 'chatgpt':
    case 'claude':
    default:
      targetPrefix = isPt
        ? `Você é um Diretor de Arte e Desenvolvedor Full-Stack especialista em criar produtos digitais de altíssima conversão e design de classe mundial.`
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
  let result = `${targetPrefix}${businessContext}\n${basePrompt}${targetInstructions}`;

  return result.trim();
}
