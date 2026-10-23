import { PaletteColors } from '../types/catalog';

export interface ColorPreset {
  id: string;
  labelPt: string;
  colors: PaletteColors;
  notePt: string;
}

// Presets alinhados aos temas do filtro (FilterBar) para coerência com o catálogo.
export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'dark-acid',
    labelPt: 'Dark Ácido (LB)',
    colors: { background: '#09090B', text: '#FAFAFA', accent: '#DFE104', neutral: '#3F3F46' },
    notePt:
      'Use superfícies em camadas de cinza-escuro sobre o fundo; o destaque amarelo deve aparecer em CTAs, links, badges e seleção.',
  },
  {
    id: 'claro-clean',
    labelPt: 'Claro Clean',
    colors: { background: '#FFFFFF', text: '#111827', accent: '#2563EB', neutral: '#E5E7EB' },
    notePt:
      'Design claro e arejado com bastante respiro; sombras suaves e o azul apenas em ações e destaques.',
  },
  {
    id: 'luxo-editorial',
    labelPt: 'Luxo Editorial',
    colors: { background: '#12100E', text: '#F5EFE6', accent: '#C9A227', neutral: '#2B2723' },
    notePt:
      'Sensação premium: tipografia serifada nos títulos, muito espaço negativo e dourado usado com parcimônia.',
  },
  {
    id: 'vidro-glass',
    labelPt: 'Efeito Vidro',
    colors: { background: '#0F172A', text: '#F1F5F9', accent: '#38BDF8', neutral: '#334155' },
    notePt:
      'Cartões translúcidos com blur (backdrop-blur), bordas semi-transparentes e um gradiente sutil de fundo.',
  },
  {
    id: 'vibrante',
    labelPt: 'Colorido & Vibrante',
    colors: { background: '#FFF7ED', text: '#7C2D12', accent: '#EA580C', neutral: '#FED7AA' },
    notePt:
      'Energia alta: gradientes permitidos nos destaques, cantos arredondados generosos e contraste forte.',
  },
  {
    id: 'minimalista',
    labelPt: 'Minimalista',
    colors: { background: '#FAFAF9', text: '#1C1917', accent: '#111111', neutral: '#E7E5E4' },
    notePt:
      'Menos é mais: tipografia generosa, poucas linhas divisórias e zero elementos decorativos desnecessários.',
  },
  {
    id: 'brutalista',
    labelPt: 'Brutalista Retrô',
    colors: { background: '#FDF6E3', text: '#1A1A1A', accent: '#FF3D00', neutral: '#1A1A1A' },
    notePt:
      'Bordas pretas grossas (2-3px), sombras duras deslocadas (sem blur), cantos retos e estética de zine impressa.',
  },
];
