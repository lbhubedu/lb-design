export interface CategorySubcategory {
  name: string;
  count: number;
}

export interface PromptCategoryMeta {
  id: string;
  labelPt: string;
  shortLabelPt: string;
  descriptionPt: string;
  icon: string;
  count: number;
  subcategories: CategorySubcategory[];
}

export interface PromptItem {
  id: string;
  slug: string;
  title: string;
  titlePt: string;
  description: string;
  summaryPt: string;
  idealForPt: string;
  category: string;
  categoryLabelPt: string;
  subcategory: string;
  theme: 'escuro' | 'claro' | 'vidro' | 'luxo' | 'vibrante' | 'minimalista' | 'retro-brutalista';
  themeLabelPt: string;
  tags: string[];
  tagsPt: string[];
  previewUrl: string | null;
  thumbnailUrl: string | null;
  thumbnailType: 'image' | 'video' | 'empty';
  previewDevice: 'desktop' | 'mobile';
  isStructured: boolean;
  hasStyle: boolean;
  hasLayout: boolean;
  hasComponents: boolean;
  sectionCount: number;
  componentCount: number;
  sectionNamesPt: string[];
  stats: {
    views?: number;
    uses?: number;
    likes?: number;
    bookmarks?: number;
    shares?: number;
  };
  creatorName: string;
  createdAt: string;
  source?: 'superdesign' | 'superdesign-prompts' | 'kibo-ui';
  sourceUrl?: string;
  chunkIndex: number;
}

export interface CatalogIndex {
  generatedAt: string;
  totalPrompts: number;
  categories: PromptCategoryMeta[];
  items: PromptItem[];
}

export interface PromptDetail {
  id: string;
  slug: string;
  fullDescription: string;
  prompt: string;
  structured: {
    style?: string;
    layout?: string;
    components?: Record<string, string>;
    sections?: Record<string, string>;
    meta?: Record<string, any>;
  } | null;
  images: string[];
}

export interface DesignSystemItem {
  id: string;
  slug: string;
  name: string;
  namePt: string;
  description: string;
  mode: string;
  modeLabelPt: string;
  colors: Record<string, string>;
  typography: {
    fontFamilySans?: string;
    fontFamilySerif?: string;
    fontFamilyMono?: string;
  } | null;
  rounded: string | null;
  spacing: string | null;
  sourceDomain: string | null;
  sourceUrl: string | null;
  tokenPreviewUrl: string | null;
  designMdUrl: string | null;
  thumbnailUrl: string | null;
  creatorName: string;
  createdAt: string;
}

export interface DesignSystemsCatalog {
  generatedAt: string;
  total: number;
  items: DesignSystemItem[];
}

export type ViewMode = 'grid' | 'compact' | 'studio';
export type ActiveTab = 'prompts' | 'design-systems' | 'favorites';
export type AiTarget = 'arena' | 'codex' | 'antigravity' | 'chatgpt';
