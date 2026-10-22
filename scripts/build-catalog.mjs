import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_DIR = path.join(__dirname, "raw");
const RAW_PROMPTS_PATH = path.join(RAW_DIR, "prompts.json");
const RAW_DESIGN_MD_PATH = path.join(RAW_DIR, "design-md.json");
const PUBLIC_DATA_DIR = path.join(__dirname, "..", "public", "data");
const CHUNKS_DIR = path.join(PUBLIC_DATA_DIR, "prompts-chunks");

fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });

// Parse structured prompt exactly like Superdesign module 97958
function parseStructuredPrompt(raw) {
  if (!raw || typeof raw !== "string") return null;
  try {
    const a = JSON.parse(raw);
    if (
      typeof a.summary !== "string" ||
      typeof a.style?.prompt !== "string" ||
      !Array.isArray(a.layout_and_structure?.prompts)
    ) {
      return null;
    }
    const n = a.special_ui_components;
    if (Array.isArray(n)) {
      a.special_ui_components = n.map((e) =>
        typeof e === "string"
          ? { component: "Componente", description: "", prompt: e }
          : {
              component: e?.component ?? "Componente",
              description: e?.description ?? "",
              prompt: e?.prompt ?? "",
            }
      );
    } else if (typeof n === "string") {
      a.special_ui_components = [{ component: "Componente", description: "", prompt: n }];
    } else {
      a.special_ui_components = undefined;
    }
    return a;
  } catch {
    return null;
  }
}

// Optimize Supabase storage image URLs like Superdesign module 19172
function optimizeImageUrl(url, width = 600) {
  if (!url) return "";
  if (url.endsWith(".gif") || url.endsWith(".mp4") || url.endsWith(".webm")) {
    return url;
  }
  const marker = "/storage/v1/object/public/";
  if (url.includes(marker)) {
    const rendered = url.replace(marker, "/storage/v1/render/image/public/");
    const sep = rendered.includes("?") ? "&" : "?";
    return `${rendered}${sep}width=${width}&quality=75&resize=contain`;
  }
  return url;
}

// Phrase & vocabulary translation rules for titles and descriptions
const TITLE_EXACT_MAP = {
  "Ascii hero": "Topo de Site em Arte ASCII (Estilo Terminal Técnico)",
  "Tubes Interactive Background": "Fundo Interativo 3D de Tubos Neon",
  "High Contrast Landing Page": "Página de Vendas de Alto Contraste",
  "Lumina SaaS Landing Page": "Lumina — Página de Vendas Moderna para Software (SaaS)",
  "Serene — Find My Dream": "Serene — Site Minimalista e Calmo",
  "Deep Red Style": "Estilo Vermelho Profundo e Elegante",
  "Red Noir Style": "Estilo Noir Vermelho e Preto Cinematográfico",
  "Softly - Digital Wellness App": "Softly — Aplicativo de Bem-Estar Digital",
  "Glassmorphism Style": "Estilo Efeito Vidro Fosco (Glassmorphism)",
  "Brutalist E-commerce Page": "Loja Virtual Estilo Brutalista Moderno",
  "Kinetic Orange Style": "Estilo Laranja Dinâmico e Vibrante",
  "Mosaic Grid Architecture Style": "Estilo Grade de Mosaico para Arquitetura",
  "Luxury-focused Design System": "Sistema Visual de Luxo e Sofisticação",
  "Neural Noir Interface Style": "Estilo de Interface Escura Futurista (Neural Noir)",
  "Glassmorphism card": "Cartão com Efeito de Vidro Transparente",
  "Bold Editorial Studio Style": "Estilo de Estúdio Editorial Marcante",
  "Nature Inspired Style": "Estilo Inspirado na Natureza e Orgânico",
  "Cinematic Style": "Estilo Cinematográfico de Impacto",
  "BabyBites - Sophisticated Palette": "BabyBites — Aplicativo Infantil com Paleta Sofisticada",
  "Scroll Journey Line": "Linha do Tempo Animada ao Rolar a Página",
  'The "Stacking Cards" Effect': "Efeito de Cartões Empilhados na Rolagem",
  "Synapse": "Synapse — Visual Tecnológico e Conectado",
  "Card Swap": "Troca Animada de Cartões (Galeria Interativa)",
  "Bold Editorial Style": "Estilo Editorial Forte com Destaque Amarelo",
  "Observe — See the shape of the noise": "Observe — Site de Monitoramento e Dados",
  "LMS Dashboard without Left Borders": "Painel de Plataforma de Cursos e Ensino (LMS)",
  "SaaS Landing Page for Developer Tool": "Página de Vendas para Ferramenta Técnica / SaaS",
  "Midnight Editorial Style": "Estilo Editorial Noturno (Meia-Noite)",
  "Brutalist Style Ecommerce Page": "Loja Virtual com Visual Brutalista e Laranja",
  "Hyper-Saturated Fluid": "Estilo Fluido com Cores Ultra Vibrantes",
  "Neumorphism": "Estilo Neumorfismo (Botões com Relevo Suave)",
  "GSAP Horizontal scroll": "Rolagem Horizontal Suave (Efeito Galeria)",
  "Futuristic SasS Landing Page": "Página de Vendas Futurista para Software",
  "Magnification Dock": "Menu Inferior com Efeito Lupa (Estilo Mac)",
  "Premium Dual-Theme Developer Portfolio": "Portfólio Profissional com Tema Claro e Escuro",
  "Bold Editorial Design Style": "Estilo de Design Editorial Forte",
  "Force Field Background": "Fundo Interativo com Campo de Força",
  "EdTech Pro Dashboard - Strict Reproduction": "Painel de Controle para Plataforma de Educação",
  "Clean CRM dashboard UI design": "Painel de Gestão de Clientes (CRM) Limpo e Claro",
  "Clean fluid": "Estilo Fluido, Limpo e Suave",
  "Hyper-Speed Loading State": "Animação de Carregamento em Alta Velocidade",
  "Neo-Brutalism Style": "Estilo Neo-Brutalista com Bordas Marcadas",
  "Minimalist Beta Capture": "Página Minimalista para Captura de E-mails (Lista VIP)",
  "Light Beam Button": "Botão com Feixe de Luz Animado",
  "Aura Dynamics - Video Landing Page": "Aura Dynamics — Página de Vendas com Vídeo no Topo",
  "Cinematic Noir Style": "Estilo Escuro de Cinema (Noir)",
  "Neon Velocity Countdown": "Página de Contagem Regressiva com Luzes Neon",
  "Parallax Stars Background": "Fundo Espacial com Estrelas em Movimento (Parallax)",
  "Cyber Serif Style": "Estilo Tecnológico com Fontes Clássicas (Cyber Serif)",
  "Warm Industrial Gray Style": "Estilo Cinza Industrial Acolhedor",
  "Chrome Extension Landing Page": "Página de Apresentação para Extensão de Navegador",
  "Pill Nav": "Menu de Navegação em Formato de Pílula",
  "Playful": "Estilo Divertido, Leve e Colorido",
  "Horizontal Gallery": "Galeria de Imagens com Deslizamento Horizontal",
  "Light Rays Background": "Fundo com Raios de Luz Suaves",
  "Superdesign Editorial Waitlist": "Página de Lista de Espera com Visual de Revista",
  '"Exploded View" Assembly': "Animação de Produto Desmontado em Camadas",
  "Text blur animation": "Animação de Texto Surgindo com Desfoque Suave",
  "Hover reveal effect": "Efeito de Revelar Imagem ao Passar o Mouse",
  "Testimonial: Portrait Stack": "Seção de Depoimentos com Pilha de Fotos",
  "Tech Editorial": "Estilo Revista de Tecnologia Moderna",
  "Liquid Ether Background": "Fundo Animado de Líquido Etéreo",
  "Clay UI": "Estilo Clay UI (Elementos 3D Macios como Argila)",
  "Circular Gallery": "Galeria de Fotos em Roda Circular Interativa",
  "Red sun": "Estilo Sol Vermelho Minimalista",
  "Testimonial: Marquee": "Faixa de Depoimentos Deslizante Contínua",
  "Ghost Cursor": "Efeito de Cursor com Rastro Fantasma",
  "Typing animation": "Animação de Texto Digitando Sozinho",
  "Dark Avant-Garde Style": "Estilo Escuro Vanguarda e Artístico",
  "zenIx Dashboard - Refined Elegant Glass": "Painel zenIx — Sistema Elegante com Efeito Vidro",
  "Scroll animation": "Animação Suave Guiada pela Rolagem da Página",
  "Masonry Gallery": "Galeria de Fotos em Mosaico (Estilo Pinterest)",
  "Interactive virtual character": "Personagem Virtual Interativo na Tela",
  "Disruptor Beta Launch": "Página de Lançamento de Produto Inovador",
  "Lumina Interactive Hero": "Topo de Site Interativo e Iluminado (Lumina)",
  "Sketch": "Estilo Desenho à Mão e Rascunho Criativo",
  "Gooey Gradient Background": "Fundo com Gradiente Líquido Orgânico",
  "Radiant Prompt Input": "Caixa de Digitação com Brilho Radiante (Estilo IA)",
  "Send-It | Customer Dashboard Redesign": "Send-It — Painel de Atendimento e Clientes",
  "Colored, Glowing Edge Card": "Cartão com Borda Colorida Iluminada",
  "Testimonial": "Seção de Depoimentos de Clientes",
  "Interactive Waves Background": "Fundo Interativo com Ondas em Movimento",
  "Grunge Collage Motion": "Estilo Colagem Artística com Movimento",
  "Dark SaaS Dashboard - Spark Pixel Team": "Painel de Controle Escuro para Sistemas SaaS",
  "Liquid Metal style": "Estilo Metal Líquido Cromado",
  "Bento": "Layout em Grade Bento (Blocos Organizados Estilo Apple)",
  "Jelly Squish Button": "Botão com Efeito Elástico de Gelatina ao Clicar",
  "be creative | Premium Polished Navigation": "Menu de Navegação Sofisticado e Criativo",
  "Dynamic Data Display": "Exibição Dinâmica de Números e Estatísticas",
  "Animated Stepper": "Indicador de Passos Animado (Passo a Passo)",
  "Enterprise Admin Platform": "Plataforma Administrativa para Grandes Empresas",
  "Terminal": "Visual de Terminal de Comando Retrô",
  "Architectural Type System Style": "Estilo Tipográfico de Arquitetura",
  "Architectural Blueprint": "Estilo Planta Baixa de Arquitetura (Azul Técnico)",
  "Interactive Folder": "Pasta de Arquivos Interativa que Abre ao Clicar",
  "Sticky Content Switch": "Conteúdo Fixo que Muda Conforme a Rolagem",
  "Hand Drawn Underline Headline": "Título com Sublinhado Desenhado à Mão",
  "Telecom CRM — Application Shell": "Sistema CRM de Telecomunicações e Atendimento",
  "Flat design": "Estilo Design Plano, Limpo e Direto (Flat)",
  "FullScreenImageExpansion": "Imagem que Expande em Tela Cheia na Rolagem",
  "Text slidedown animation": "Animação de Texto Deslizando para Baixo",
  "Glow Cursor Button": "Botão que Brilha Onde o Mouse Passa",
  "News Print": "Estilo Jornal Impresso Clássico",
  "Kinetic": "Estilo Tipografia em Movimento (Cinético)",
  "Staggered Menu": "Menu que Abre em Cascata Animada",
  "Material": "Estilo Material Design (Google)",
  "Aura Audio Showroom": "Showroom Virtual para Produtos de Áudio e Música",
  "Organic Modern Style": "Estilo Moderno Orgânico e Natural",
  "Plasma Background": "Fundo Animado de Plasma Colorido",
  "Rotating logos": "Carrossel Giratório de Logotipos de Clientes",
  "Premium Dark B2B Service Landing": "Página de Vendas Escura Premium para Empresas (B2B)",
  "Win98": "Estilo Nostálgico Windows 98 Retrô",
  "Bauhaus": "Estilo Artístico Geométrico Bauhaus",
  "Tilted Card": "Cartão com Inclinação 3D ao Passar o Mouse",
  "Xan CRM — Invoices List": "Painel Financeiro de Faturas e Cobranças (CRM)",
  "Gen-Z Social App": "Aplicativo Social Vibrante para Público Jovem",
  "Bold Retro-Modernism": "Estilo Retrô-Modernista Marcante",
  "Gradient Blinds Background": "Fundo com Efeito de Persianas em Degradê",
  "Lightning Background": "Fundo Animado com Raios Elétricos",
  "Text Pressure": "Texto Interativo que Reage à Pressão do Mouse",
  "Shader: Mesh Drift": "Fundo 3D com Malha Fluida em Movimento",
  "Super Shampoo - High Conversion LP": "Página de Vendas de Alta Conversão para Produto Físico",
  "Pastel Gradient Background": "Fundo Suave em Tons Pastéis",
  "Luxury": "Estilo Luxo Clássico e Exclusivo",
  "Swiss Style": "Estilo Suíço de Design (Grade Precisa e Limpa)",
  "Rolodex Text": "Texto Giratório Estilo Letreiro / Rolodex",
  "Monochrome": "Estilo Monocromático (Preto, Branco e Cinza)",
  "Pricing": "Tabela de Preços e Planos de Assinatura",
  "Hyperspeed Background": "Fundo Espacial em Velocidade da Luz",
  "Shader: Halftone": "Efeito Visual de Pontilhado (Meio-Tom)",
  "Modern Bold": "Estilo Moderno com Títulos Fortes",
  "Timeline: Horizontal Roadmap": "Linha do Tempo e Cronograma Horizontal",
  "Linklyst Analytics Dashboard": "Painel de Métricas e Cliques (Analytics)",
  "Fintech Dashboard with Line Chart": "Painel Financeiro com Gráfico de Desempenho",
  "VoidAI - Premium AI Landing Page": "VoidAI — Página de Vendas Premium para Inteligência Artificial",
  "Faulty Terminal Background": "Fundo de Terminal com Efeito Glitch Retrô",
  "Flowing Menu": "Menu Fluido com Destaque Deslizante",
  "Ballpit Background": "Fundo Interativo com Bolinhas Físicas 3D",
  "Squares Background": "Fundo Geométrico de Quadrados Interativos",
  "Tectonic style": "Estilo Arquitetônico em Blocos Sólidos (Tectônico)",
  "Shiny Text": "Texto com Reflexo de Luz Brilhante",
  "Shader: Liquid Metal": "Efeito 3D de Metal Líquido Reluzente",
  "LeadFlow Dashboard with Navigation": "Painel de Gestão de Leads e Vendas",
  "Data Visualization Dashboard": "Painel de Visualização de Dados e Relatórios",
  "Luminous Switch": "Botão Interruptor (Liga/Desliga) Iluminado",
  "Text Color Inversion": "Texto que Inverte de Cor Sobre Imagens",
  "Prism Background": "Fundo com Luzes de Prisma e Arco-Íris Suave",
  '"Spotlight" Mask': "Efeito Holofote que Ilumina a Tela com o Mouse",
  "Chat UI with Sidebar Navigation": "Tela de Chat e Mensagens com Menu Lateral (Estilo ChatGPT)",
  "TechPro Laptops Store": "Loja Virtual de Computadores e Eletrônicos",
  "Editorial Magazine Pitch Deck": "Apresentação de Slides Estilo Revista Editorial",
  "Interactive Card Stack": "Pilha de Cartões Interativos",
  "Testimonial: Scrolling Columns": "Colunas de Depoimentos Rolando Automaticamente",
  "Terminal Portfolio": "Portfólio Pessoal Estilo Tela de Programador",
  "LiquidUI - Production Design System": "Sistema de Design Completo com Efeito Fluido (LiquidUI)",
  '"Parallax Tilt" Grid': "Grade de Imagens com Inclinação 3D",
};

const WORD_REPLACEMENTS = [
  [/\bAnimated Landing Page:\s*/gi, "Página Animada: "],
  [/\bAnimated Hero Section:\s*/gi, "Topo de Site Animado: "],
  [/\bLanding Page Hero:\s*/gi, "Topo de Página de Vendas: "],
  [/\bAnimated Scroll-Pinned\s*/gi, "Página com Rolagem Fixa: "],
  [/\bAnimated\b/gi, "Animado"],
  [/\bLanding Page\b/gi, "Página de Vendas"],
  [/\bProduct Page\b/gi, "Página de Produto"],
  [/\bPricing Page\b/gi, "Página de Preços"],
  [/\bLogin Page UI\b/gi, "Tela de Login"],
  [/\bLogin Page\b/gi, "Tela de Login"],
  [/\bDashboard UI\b/gi, "Painel de Controle"],
  [/\bDashboard\b/gi, "Painel de Controle"],
  [/\bAnalytics Dashboard\b/gi, "Painel de Métricas"],
  [/\bMobile App\b/gi, "Aplicativo de Celular"],
  [/\bDeveloper Portfolio\b/gi, "Portfólio Profissional"],
  [/\bPortfolio Website\b/gi, "Site de Portfólio"],
  [/\bPortfolio\b/gi, "Portfólio"],
  [/\bDesign System\b/gi, "Sistema de Design"],
  [/\bBackground\b/gi, "Fundo Interativo"],
  [/\bHero Section\b/gi, "Topo de Site"],
  [/\bHero\b/gi, "Topo de Site"],
  [/\bWaitlist\b/gi, "Lista de Espera"],
  [/\bE-commerce\b/gi, "Loja Virtual"],
  [/\bEcommerce\b/gi, "Loja Virtual"],
  [/\bPitch Deck\b/gi, "Apresentação de Slides"],
  [/\bSlide Deck\b/gi, "Apresentação de Slides"],
  [/\bDeck\b/gi, "Apresentação"],
  [/\bTestimonial\b/gi, "Depoimentos"],
  [/\bButton\b/gi, "Botão"],
  [/\bCard\b/gi, "Cartão"],
  [/\bSwitch\b/gi, "Interruptor"],
  [/\bGallery\b/gi, "Galeria"],
  [/\bNavigation\b/gi, "Menu de Navegação"],
  [/\bSidebar\b/gi, "Menu Lateral"],
  [/\bDark Mode\b/gi, "Modo Escuro"],
  [/\bDark\b/gi, "Escuro"],
  [/\bLight Mode\b/gi, "Modo Claro"],
  [/\bGlassmorphism\b/gi, "Efeito Vidro"],
  [/\bClaymorphism\b/gi, "Efeito Argila 3D"],
  [/\bBrutalist\b/gi, "Brutalista"],
  [/\bMinimalist\b/gi, "Minimalista"],
  [/\bMinimal\b/gi, "Minimalista"],
  [/\bLuxury\b/gi, "Luxo"],
  [/\bEditorial\b/gi, "Editorial"],
  [/\bInteractive\b/gi, "Interativo"],
  [/\bFintech\b/gi, "Financeiro (Fintech)"],
  [/\bReal Estate\b/gi, "Imobiliária e Imóveis"],
  [/\bHealthcare\b/gi, "Saúde e Clínica"],
  [/\bClinic\b/gi, "Clínica"],
  [/\bRestaurant\b/gi, "Restaurante"],
  [/\bAgency\b/gi, "Agência"],
  [/\bStudio\b/gi, "Estúdio"],
  [/\bStyle\b/gi, "Estilo"],
  [/\bwith\b/gi, "com"],
  [/\band\b/gi, "e"],
  [/\bfor\b/gi, "para"],
  [/\bImage Generation\s*\/\s*/gi, "Geração de Imagem: "],
  [/\bVideo Generation\s*\/\s*/gi, "Geração de Vídeo: "],
  [/\bAnimation\s*\/\s*/gi, "Animação: "],
  [/\bLanding Page\s*\/\s*/gi, "Página de Vendas: "],
  [/\bMobile App\s*\/\s*/gi, "App de Celular: "],
  [/\bWeb App\s*\/\s*/gi, "Sistema Web: "],
];

const PREFIX_RULES = [
  [/^Image Generation\s*\/\s*/i, "Geração de Imagem: "],
  [/^Video Generation\s*\/\s*/i, "Geração de Vídeo: "],
  [/^Animation\s*\/\s*/i, "Animação: "],
  [/^Landing Page\s*\/\s*/i, "Página de Vendas: "],
  [/^Mobile App\s*\/\s*/i, "App de Celular: "],
  [/^Web App\s*\/\s*/i, "Sistema Web: "],
];

// Nomes curados quando existe tradução; caso contrário mantemos o nome original
// do modelo (é um nome próprio) e a interface mostra o tipo em português.
function translateTitleToPt(title) {
  if (!title) return "Modelo de Design";
  const trimmed = title.trim();
  if (TITLE_EXACT_MAP[trimmed]) return TITLE_EXACT_MAP[trimmed];
  let pt = trimmed;
  for (const [regex, replacement] of PREFIX_RULES) pt = pt.replace(regex, replacement);
  return pt;
}

const TAG_MAP_PT = {
  "responsive": "Responsivo (Celular e PC)",
  "saas": "Software / SaaS",
  "landing-page": "Página de Vendas",
  "landing page": "Página de Vendas",
  "landing": "Página de Vendas",
  "desktop": "Computador",
  "editorial": "Estilo Revista / Editorial",
  "animation": "Com Animação",
  "animated": "Animado",
  "skill": "Superpoder para IA",
  "layout": "Estrutura de Página",
  "minimal": "Minimalista",
  "style": "Estilo Visual",
  "light": "Modo Claro",
  "light-mode": "Modo Claro",
  "light mode": "Modo Claro",
  "cream": "Fundo Creme Suave",
  "dark": "Modo Escuro",
  "dark-mode": "Modo Escuro",
  "dark mode": "Modo Escuro",
  "mobile app": "App de Celular",
  "mobile": "Celular",
  "hero": "Topo de Site Impactante",
  "pricing page": "Tabela de Preços",
  "pricing": "Preços e Planos",
  "background": "Fundo Decorativo",
  "billing-toggle": "Alternador Mensal/Anual",
  "sticky-nav": "Menu Fixo no Topo",
  "serif": "Fonte Clássica (Serifa)",
  "ui component": "Peça / Componente",
  "component": "Componente",
  "warm": "Cores Quentes",
  "portfolio": "Portfólio",
  "page": "Página Completa",
  "monochrome": "Preto e Branco",
  "coral": "Tom Coral",
  "ecommerce": "Loja Virtual",
  "teal": "Azul-Petróleo",
  "amber": "Tom Âmbar / Dourado",
  "gradient": "Degradê de Cores",
  "developer-tool": "Ferramenta Técnica",
  "dev-tool": "Ferramenta Técnica",
  "high-contrast": "Alto Contraste",
  "high contrast": "Alto Contraste",
  "scroll-animation": "Animação ao Rolar",
  "scroll animation": "Animação ao Rolar",
  "form": "Formulário",
  "monospace": "Fonte Técnica",
  "shopify": "Loja Estilo Shopify",
  "tailwind": "Tailwind CSS",
  "glassmorphism": "Efeito Vidro",
  "frosted-glass": "Vidro Fosco",
  "auth": "Login e Cadastro",
  "login": "Tela de Login",
  "brutalist": "Estilo Brutalista",
  "onboarding": "Boas-Vindas (Onboarding)",
  "faq-accordion": "Perguntas Frequentes (FAQ)",
  "three-tier": "3 Planos de Preço",
  "navy": "Azul Marinho",
  "testimonial": "Depoimentos de Clientes",
  "generative": "Arte Generativa",
  "newsletter": "Captura de E-mail",
  "webgl": "Efeito 3D (WebGL)",
  "ai": "Inteligência Artificial",
  "cta": "Chamada para Ação",
  "playful": "Divertido e Colorido",
  "shader": "Efeito Visual 3D",
  "aurora": "Luzes Aurora",
  "emerald": "Verde Esmeralda",
  "marketing": "Marketing e Vendas",
  "marketing-site": "Site de Marketing",
  "marquee": "Faixa Deslizante",
  "paper": "Textura de Papel",
  "cobalt": "Azul Cobalto",
  "dashboard": "Painel de Controle",
  "pastel": "Tons Pastéis",
  "social-proof": "Prova Social",
  "studio": "Estúdio / Agência",
  "text animation": "Texto Animado",
  "button": "Botão Interativo",
  "comparison-table": "Tabela Comparativa",
  "graphite": "Cinza Grafite",
  "product": "Apresentação de Produto",
  "rounded": "Cantos Arredondados",
  "bold": "Visual Forte",
  "waitlist": "Lista de Espera",
  "luxury": "Luxo e Sofisticação",
  "card": "Cartão Visual",
  "hover effect": "Efeito ao Passar o Mouse",
  "switch": "Botão Liga/Desliga",
  "presentation": "Apresentação de Slides",
};

function translateTag(tag) {
  const lower = (tag || "").toLowerCase().trim();
  if (TAG_MAP_PT[lower]) return TAG_MAP_PT[lower];
  return tag
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const CATEGORIES_META = {
  "apps-aplicativos": {
    id: "apps-aplicativos",
    labelPt: "Aplicativos (Mobile & Desktop)",
    shortLabelPt: "Apps & Mobile",
    descriptionPt: "Interfaces completas para celulares (iOS/Android), web apps responsivos e telas desktop de alta fidelidade.",
    icon: "Smartphone",
  },
  "crms-gestao": {
    id: "crms-gestao",
    labelPt: "CRMs & Gestão Comercial",
    shortLabelPt: "CRMs & Clientes",
    descriptionPt: "Sistemas de CRM, gestão de leads, funis de vendas, pipelines Kanban, faturamento, invoices e suporte.",
    icon: "Users",
  },
  "dashboards-paineis": {
    id: "dashboards-paineis",
    labelPt: "Dashboards & Painéis de Controle",
    shortLabelPt: "Dashboards & Métricas",
    descriptionPt: "Painéis de controle, gráficos de receita, métricas analíticas, consoles administrativos e monitoramento.",
    icon: "LayoutDashboard",
  },
  "ferramentas-ia": {
    id: "ferramentas-ia",
    labelPt: "Ferramentas de IA & Agentes",
    shortLabelPt: "Ferramentas de IA",
    descriptionPt: "Interfaces para IA generativa, assistentes inteligentes, chatbots, playgrounds de prompts e agentes autônomos.",
    icon: "Wand2",
  },
  "sistemas-saas": {
    id: "sistemas-saas",
    labelPt: "Sistemas Web & Plataformas SaaS",
    shortLabelPt: "Sistemas SaaS",
    descriptionPt: "Plataformas web completas para empresas, áreas de membros, ferramentas colaborativas e portais.",
    icon: "Laptop",
  },
  "sites-vendas": {
    id: "sites-vendas",
    labelPt: "Páginas de Vendas & Landing Pages",
    shortLabelPt: "Páginas de Vendas",
    descriptionPt: "Landing pages de alta conversão para produtos digitais, serviços, lançamentos e marcas de alto padrão.",
    icon: "Flame",
  },
  "pecas-componentes": {
    id: "pecas-componentes",
    labelPt: "Componentes & Peças de UI",
    shortLabelPt: "Componentes UI",
    descriptionPt: "Menus de navegação, tabelas de preço, formulários, modais, cartões bento grid e botões interativos.",
    icon: "Layers",
  },
  "identidades-design-systems": {
    id: "identidades-design-systems",
    labelPt: "Estilos Visuais & Design Systems",
    shortLabelPt: "Estilos & Cores",
    descriptionPt: "Sistemas de identidade visual prontos: Dark Mode, Neumorphism, Efeito Vidro, Luxo Editorial e Minimalismo.",
    icon: "Palette",
  },
  "efeitos-animacoes": {
    id: "efeitos-animacoes",
    labelPt: "Efeitos Visuais & Animações 3D",
    shortLabelPt: "Efeitos & 3D",
    descriptionPt: "Fundos animados com shaders, simulações 3D, efeitos de rolagem (scroll) e cursores interativos.",
    icon: "Zap",
  },
  "apresentacoes-pitch": {
    id: "apresentacoes-pitch",
    labelPt: "Apresentações & Pitch Decks",
    shortLabelPt: "Apresentações",
    descriptionPt: "Slides visuais e modelos de pitch deck para investidores, relatórios e demonstrações comerciais.",
    icon: "Presentation",
  },
};

function classifyItem(item) {
  const tags = (item.tags || []).map((t) => t.toLowerCase());
  const title = (item.title || "").toLowerCase();
  const desc = (item.description || "").toLowerCase();
  const text = `${title} ${desc} ${tags.join(" ")}`;

  let category = "sites-vendas";
  let subcategory = "Geral";

  // 1. Ferramentas de IA & Agentes
  if (
    tags.includes("skill") ||
    /\b(ai tool|ai agent|artificial intelligence|prompt engineering|chatbot|copilot|voice agent|image generation|video generation|neural|llm|gpt|claude|gemini|assistant|ai assistant|ai playground|prompt library|agentic|superdesign skill|configgen ai|generative ai)\b/.test(title) ||
    (/\b(ai agent|ai-powered|prompt engineering|llm model|neural network|autonomous agent|ai copilot|ai chatbot|prompt generator|ai assistant)\b/.test(text) && !title.includes("landing page"))
  ) {
    category = "ferramentas-ia";
    if (/\b(image generation|photography|illustration|art generator)\b/.test(text)) subcategory = "Geradores de Imagem & Arte";
    else if (/\b(video generation|video|cinematic)\b/.test(text)) subcategory = "Geradores de Vídeo";
    else if (/\b(agent|autonomous|workflow|bot|assistant|voice)\b/.test(text)) subcategory = "Agentes & Assistentes";
    else if (/\b(chat|prompt|playground|llm|gpt)\b/.test(text)) subcategory = "Chatbots & Playgrounds de Prompts";
    else subcategory = "Superpoderes & Skills para IA";
  }
  // 2. CRMs & Gestão Comercial
  else if (
    /\b(crm|leadflow|pipeline|customer relationship|client management|sales pipeline|sales funnel|funnel|deal|deals|invoice|invoices|telecom crm|customer portal|billing management|helpdesk|support desk|client portal)\b/.test(title) ||
    (/\b(crm dashboard|lead management|customer portal|customer management|sales crm|invoices list|invoice editor)\b/.test(text) && !title.includes("landing page"))
  ) {
    category = "crms-gestao";
    if (/\b(sales|funnel|pipeline|deal|deals|leadflow|lead)\b/.test(text)) subcategory = "Funis de Vendas & Leads";
    else if (/\b(invoice|invoices|billing|finance|payment)\b/.test(text)) subcategory = "Faturamento & Invoices";
    else if (/\b(helpdesk|support|ticket|client portal)\b/.test(text)) subcategory = "Suporte & Portais de Clientes";
    else subcategory = "CRMs de Clientes & Vendas";
  }
  // 3. Dashboards & Painéis de Controle
  else if (
    tags.includes("dashboard") ||
    /\b(dashboard|analytics|admin console|metrics|kpi|telemetry|revenue dashboard|monitoring|trading dashboard|admin panel|console|tracker|kanban|saas analytics)\b/.test(title) ||
    /\b(analytics dashboard|admin dashboard|metrics dashboard|financial dashboard|data console|management console)\b/.test(desc)
  ) {
    category = "dashboards-paineis";
    if (/\b(revenue|billing|financial|trading|finance|crypto|bank)\b/.test(text)) subcategory = "Painéis Financeiros & Receita";
    else if (/\b(analytics|data|metrics|chart|telemetry)\b/.test(text)) subcategory = "Métricas & Análise de Dados";
    else if (/\b(devops|ci\/cd|developer|security|endpoint|waf|deployments)\b/.test(text)) subcategory = "Consoles Técnicos & Dev";
    else subcategory = "Painéis Administrativos Gerais";
  }
  // 4. Aplicativos (Mobile & Desktop)
  else if (
    tags.includes("mobile app") ||
    tags.includes("mobile") ||
    item.previewDevice === "mobile" ||
    /\b(mobile app|ios app|android app|app store|wallet app|health app|fitness app|chat app|habit tracker|desktop application|ios interface|mobile interface|wallet home|wellness app)\b/.test(title) ||
    /\b(mobile app|ios app|wallet home|mobile screen)\b/.test(desc)
  ) {
    category = "apps-aplicativos";
    if (/\b(wallet|fintech|bank|crypto|finance|pay)\b/.test(text)) subcategory = "Apps Financeiros & Carteiras";
    else if (/\b(health|fitness|wellness|meditation|workout)\b/.test(text)) subcategory = "Saúde, Treino & Bem-Estar";
    else if (/\b(social|chat|messenger|community|feed)\b/.test(text)) subcategory = "Redes Sociais & Mensagens";
    else subcategory = "Apps de Produtividade & Utilidades";
  }
  // 5. Apresentações & Pitch Decks
  else if (
    tags.includes("presentation") ||
    tags.includes("pitch-deck") ||
    tags.includes("slide-deck") ||
    /\b(deck|slides?|presentation|keynote|pitch)\b/.test(title) ||
    /\b(pitch deck|presentation deck|slide deck)\b/.test(desc)
  ) {
    category = "apresentacoes-pitch";
    subcategory = "Pitch Decks & Apresentações";
  }
  // 6. Componentes & Peças de UI
  else if (
    tags.includes("ui component") ||
    tags.includes("component") ||
    /\b(button|switch|dock|nav|navigation|menu|stepper|card stack|marquee|carousel|input|modal|widget|accordion|pricing table|testimonial|footer|tab bar|tabs)\b/.test(title) ||
    (/\b(carousel|card stack|dock menu|navbar|navigation bar|pricing table|hero component)\b/.test(desc) && !text.includes("landing page"))
  ) {
    category = "pecas-componentes";
    if (/\b(button|switch|toggle|cta)\b/.test(text)) subcategory = "Botões & Interruptores";
    else if (/\b(nav|navigation|menu|dock|sidebar|header)\b/.test(text)) subcategory = "Menus & Navegação";
    else if (/\b(pricing|billing|plan|subscription)\b/.test(text)) subcategory = "Tabelas de Preços & Planos";
    else if (/\b(login|auth|signup|registration|input|form)\b/.test(text)) subcategory = "Login, Cadastro & Formulários";
    else subcategory = "Cartões, Bento Grids & Blocos";
  }
  // 7. Efeitos Visuais & Animações 3D
  else if (
    (tags.includes("animation") && !tags.includes("landing page") && !tags.includes("landing-page") && !tags.includes("style")) ||
    /\b(background animation|shader|cursor effect|particle|webgl|fluid simulation|threejs|gsap)\b/.test(title)
  ) {
    category = "efeitos-animacoes";
    if (/\b(background|shader|aurora|plasma|ether|stars|rays|waves|prism|mesh)\b/.test(title)) subcategory = "Fundos Animados & Shaders 3D";
    else if (/\b(text|typing|headline|rolodex|shiny|kinetic)\b/.test(title)) subcategory = "Textos com Efeito & Tipografia";
    else if (/\b(scroll|horizontal|stacking|journey|timeline)\b/.test(title)) subcategory = "Efeitos ao Rolar a Página";
    else subcategory = "Efeitos de Mouse & Interações";
  }
  // 8. Sistemas Web & Plataformas SaaS
  else if (
    /\b(platform|workspace|portal|b2b software|developer platform|cloud platform|collab|editor|management system|saas platform)\b/.test(title)
  ) {
    category = "sistemas-saas";
    subcategory = "Plataformas SaaS & Trabalho";
  }
  // 9. Páginas de Vendas & Landing Pages
  else if (
    tags.includes("landing page") ||
    tags.includes("landing-page") ||
    tags.includes("landing") ||
    tags.includes("page") ||
    /\b(landing|waitlist|launch|saas|hero|website|home page|homepage|sales page)\b/.test(title) ||
    /\b(landing page|landing-page|waitlist page|saas website)\b/.test(desc)
  ) {
    category = "sites-vendas";
    if (/\b(ai|agent|neural|llm|gpt)\b/.test(text)) subcategory = "Páginas de IA & Ferramentas";
    else if (/\b(waitlist|beta|launch|countdown)\b/.test(text)) subcategory = "Lançamentos & Lista de Espera";
    else if (/\b(health|clinic|medical|wellness|dental)\b/.test(text)) subcategory = "Saúde, Clínicas & Bem-Estar";
    else if (/\b(finance|bank|fintech|wealth|accounting)\b/.test(text)) subcategory = "Finanças & Negócios";
    else subcategory = "Software (SaaS) & Empresas";
  }
  // 10. Identidades Visuais & Design Systems
  else {
    category = "identidades-design-systems";
    if (/\b(dark|noir|midnight|cyber)\b/.test(text)) subcategory = "Estilos Noturnos & Dark Mode";
    else if (/\b(glass|fluid|liquid|clay)\b/.test(text)) subcategory = "Efeito Vidro & Neumorphism";
    else if (/\b(editorial|luxury|serif|swiss)\b/.test(text)) subcategory = "Elegante, Revista & Luxo";
    else subcategory = "Minimalista, Brutalista & Retrô";
  }

  // Visual theme (Clima Visual)
  let theme = "claro";
  if (/\b(glassmorphism|frosted-glass|glass-panel|elegant glass)\b/.test(text)) {
    theme = "vidro";
  } else if (/\b(luxury|didone|serif|boutique|editorial|swiss)\b/.test(text) && !/\b(brutalist|terminal)\b/.test(text)) {
    theme = "luxo";
  } else if (/\b(brutalist|neo-brutalism|win98|retro|crt|terminal|bauhaus|memphis)\b/.test(text)) {
    theme = "retro-brutalista";
  } else if (/\b(neon|hyper-saturated|vibrant|colorful|playful|aurora|gradient|fuchsia|kinetic orange)\b/.test(text)) {
    theme = "vibrante";
  } else if (/\b(dark|dark-mode|noir|midnight|near-black|obsidian|black)\b/.test(text)) {
    theme = "escuro";
  } else if (/\b(minimal|minimalist|clean|flat|monochrome|paper|e-ink)\b/.test(text)) {
    theme = "minimalista";
  }

  const THEME_LABELS = {
    escuro: "Modo Escuro (Dark)",
    claro: "Modo Claro e Limpo",
    vidro: "Efeito Vidro (Glass)",
    luxo: "Elegante & Editorial",
    vibrante: "Colorido & Vibrante",
    minimalista: "Minimalista & Suave",
    "retro-brutalista": "Criativo / Retrô / Brutalista",
  };

  return {
    category,
    categoryLabelPt: CATEGORIES_META[category].labelPt,
    subcategory,
    theme,
    themeLabelPt: THEME_LABELS[theme] || "Modo Claro e Limpo",
  };
}

function translateSectionName(part) {
  if (!part) return "Seção";
  return part
    .replace(/\bHero\b/gi, "Topo Principal (Hero)")
    .replace(/\bNavigation\b|\bNavbar\b|\bHeader\b/gi, "Menu do Topo")
    .replace(/\bFooter\b/gi, "Rodapé")
    .replace(/\bPricing\b/gi, "Planos e Preços")
    .replace(/\bTestimonials?\b/gi, "Depoimentos")
    .replace(/\bFeatures?\b/gi, "Recursos e Diferenciais")
    .replace(/\bFAQ\b/gi, "Perguntas Frequentes (FAQ)")
    .replace(/\bCTA\b|\bCall to Action\b/gi, "Chamada Final para Ação")
    .replace(/\bAbout\b/gi, "Sobre Nós")
    .replace(/\bSidebar\b/gi, "Menu Lateral")
    .replace(/\bStats\b|\bMetrics\b/gi, "Números e Resultados");
}

function buildFriendlyPtSummary(item, classification, structured) {
  const catMeta = CATEGORIES_META[classification.category];
  const sectionCount = structured?.layout_and_structure?.prompts?.length || 0;
  const compCount = structured?.special_ui_components?.length || 0;

  let baseDesc = "";
  if (classification.category === "superpoderes-ia") {
    baseDesc = `Guia prático de ${classification.subcategory.toLowerCase()} pronto para colar na IA e ensinar técnicas profissionais passo a passo.`;
  } else if (classification.category === "paineis-sistemas") {
    baseDesc = `Interface de sistema (${classification.subcategory.toLowerCase()}) com visual ${classification.themeLabelPt.toLowerCase()}, organizada para fácil leitura de dados e ações rápidas.`;
  } else if (classification.category === "pecas-componentes") {
    baseDesc = `Componente visual de ${classification.subcategory.toLowerCase()} com acabamento ${classification.themeLabelPt.toLowerCase()} para adicionar ao seu site ou sistema.`;
  } else if (classification.category === "efeitos-animacoes") {
    baseDesc = `Efeito visual interativo (${classification.subcategory.toLowerCase()}) para deixar o fundo ou a rolagem do seu site muito mais atraente.`;
  } else if (classification.category === "apps-celular") {
    baseDesc = `Tela de aplicativo mobile (${classification.subcategory.toLowerCase()}) com estilo ${classification.themeLabelPt.toLowerCase()} e navegação pensada para o toque.`;
  } else if (classification.category === "lojas-produtos") {
    baseDesc = `Página de vitrine e vendas (${classification.subcategory.toLowerCase()}) com visual ${classification.themeLabelPt.toLowerCase()} para destacar produtos e aumentar conversões.`;
  } else if (classification.category === "portfolios-criativos") {
    baseDesc = `Modelo de portfólio e apresentação profissional (${classification.subcategory.toLowerCase()}) com visual ${classification.themeLabelPt.toLowerCase()}.`;
  } else if (classification.category === "apresentacoes-slides") {
    baseDesc = `Apresentação visual de slides com estética ${classification.themeLabelPt.toLowerCase()} para apresentar projetos, empresas ou propostas.`;
  } else if (classification.category === "estilos-identidade") {
    baseDesc = `Identidade visual completa (${classification.subcategory.toLowerCase()}) definindo cores, fontes, botões e sensação de ${classification.themeLabelPt.toLowerCase()}.`;
  } else {
    baseDesc = `Página completa (${classification.subcategory.toLowerCase()}) no estilo ${classification.themeLabelPt.toLowerCase()}, pronta para adaptar para o seu negócio.`;
  }

  const extras = [];
  if (sectionCount > 0) extras.push(`${sectionCount} seções detalhadas`);
  if (compCount > 0) extras.push(`${compCount} componentes especiais`);
  if (item.previewUrl) extras.push("demonstração interativa ao vivo");

  const structureNote = extras.length > 0 ? ` Inclui ${extras.join(", ")}.` : "";
  return `${baseDesc}${structureNote}`;
}

function buildIdealForPt(classification) {
  const map = {
    "Inteligência Artificial (IA)": "Ferramentas de IA, startups de tecnologia, chatbots e automações",
    "Tecnologia e Ferramentas": "Softwares, sistemas web, ferramentas digitais e serviços técnicos",
    "Saúde, Clínicas e Bem-Estar": "Clínicas médicas, odontologia, estética, psicologia, academias e bem-estar",
    "Finanças e Negócios": "Consultorias financeiras, contabilidade, bancos digitais, investimentos e B2B",
    "Lançamentos e Lista VIP": "Lançamento de cursos, infoprodutos, eventos, aplicativos e listas de espera",
    "Marcas Elegantes e Editorial": "Marcas premium, arquitetura, advocacia, moda, gastronomia e estúdios",
    "Software (SaaS) e Empresas": "Sites de empresas, apresentação de serviços, plataformas e produtos digitais",
    "CRM, Vendas e Clientes": "Sistemas de gestão de clientes, funil de vendas, atendimento e faturamento",
    "Painéis Financeiros": "Controle financeiro, fluxo de caixa, carteiras e relatórios de receita",
    "Métricas e Gráficos": "Painéis de indicadores (KPIs), marketing, tráfego e relatórios visuais",
    "Sistemas Técnicos e Dev": "Monitoramento de servidores, segurança, logs e administração técnica",
    "Painéis Administrativos Gerais": "Áreas de membros, plataformas de cursos (EAD), gestão interna e portais",
    "Botões e Interruptores": "Destacar botões de compra, cadastro ou ações principais do site",
    "Menus e Navegação": "Deixar o menu do topo ou barra lateral mais moderno e fácil de usar",
    "Depoimentos e Avaliações": "Mostrar avaliações de clientes reais para gerar confiança na página",
    "Tabelas de Preços": "Apresentar planos mensais/anuais de forma clara para vender mais",
    "Login, Cadastro e Formulários": "Telas de entrada do sistema, cadastro de clientes e caixas de busca",
    "Cartões, Galerias e Blocos": "Organizar fotos, recursos ou serviços em cartões bonitos e interativos",
  };
  return map[classification.subcategory] || `Projetos de ${classification.subcategory.toLowerCase()} e páginas modernas`;
}

console.log("Reading raw prompts...");
const rawPrompts = JSON.parse(fs.readFileSync(RAW_PROMPTS_PATH, "utf8"));
console.log(`Loaded ${rawPrompts.length} prompts.`);

const CHUNK_SIZE = 100;
const catalogIndex = [];
const chunks = [];

for (let i = 0; i < rawPrompts.length; i++) {
  const item = rawPrompts[i];
  const chunkIndex = Math.floor(i / CHUNK_SIZE);
  if (!chunks[chunkIndex]) chunks[chunkIndex] = {};

  const structured = parseStructuredPrompt(item.prompt);
  const classification = classifyItem(item);
  const titlePt = translateTitleToPt(item.title);
  const summaryPt = buildFriendlyPtSummary(item, classification, structured);
  const idealForPt = buildIdealForPt(classification);

  const sectionNames = structured?.layout_and_structure?.prompts?.map((p) => p.part) || [];
  const sectionNamesPt = sectionNames.map(translateSectionName);
  const componentNames = structured?.special_ui_components?.map((c) => c.component) || [];

  const uniqueTagsPt = Array.from(
    new Set((item.tags || []).filter((t) => t !== "skill").slice(0, 8).map(translateTag))
  );

  const thumbUrl = item.thumbnail?.url ? optimizeImageUrl(item.thumbnail.url, 600) : "";
  const thumbType = item.thumbnail?.type || (thumbUrl.endsWith(".mp4") ? "video" : "image");

  const rawDesc = item.description || structured?.summary || "";
  const shortDesc = rawDesc.length > 220 ? rawDesc.slice(0, 217) + "..." : rawDesc;

  catalogIndex.push({
    id: item.id,
    slug: item.slug || item.id,
    title: item.title,
    titlePt,
    description: shortDesc,
    summaryPt,
    idealForPt,
    category: classification.category,
    categoryLabelPt: classification.categoryLabelPt,
    subcategory: classification.subcategory,
    theme: classification.theme,
    themeLabelPt: classification.themeLabelPt,
    tags: (item.tags || []).slice(0, 10),
    tagsPt: uniqueTagsPt,
    previewUrl: item.previewUrl || "",
    thumbnailUrl: thumbUrl,
    thumbnailType: thumbType,
    previewDevice: item.previewDevice || "desktop",
    isStructured: !!structured,
    hasStyle: !!structured?.style?.prompt,
    hasLayout: sectionNames.length > 0,
    hasComponents: componentNames.length > 0,
    sectionCount: sectionNames.length,
    componentCount: componentNames.length,
    sectionNamesPt,
    stats: {
      views: (item.stats?.previewViewCount || 0) + (item.stats?.detailViewCount || 0),
      copies: item.stats?.copyCount || item.copyCount || 0,
      remixes: item.stats?.remixCount || (item.copyCount || 0) + (item.tryCount || 0),
    },
    creatorName: item.creator?.name || "Superdesign",
    createdAt: item.createdAt,
    chunkIndex,
  });

  chunks[chunkIndex][item.id] = {
    id: item.id,
    slug: item.slug || item.id,
    fullDescription: rawDesc,
    prompt: structured ? null : item.prompt,
    structured: structured
      ? {
          summary: structured.summary,
          style: structured.style,
          layout_and_structure: {
            description: structured.layout_and_structure?.description || "",
            prompts: (structured.layout_and_structure?.prompts || []).map((p) => ({
              part: p.part,
              partPt: translateSectionName(p.part),
              prompt: p.prompt,
            })),
          },
          special_ui_components: structured.special_ui_components || [],
          special_notes: structured.special_notes || "",
        }
      : null,
    images: (item.images || []).map((img) => ({ url: img.url })),
  };
}

// Write one file per prompt (loaded on demand)
fs.rmSync(CHUNKS_DIR, { recursive: true, force: true });
const PER_PROMPT_DIR = path.join(PUBLIC_DATA_DIR, "p");
fs.rmSync(PER_PROMPT_DIR, { recursive: true, force: true });
fs.mkdirSync(PER_PROMPT_DIR, { recursive: true });
let written = 0;
for (const chunk of chunks) {
  for (const [id, detail] of Object.entries(chunk)) {
    fs.writeFileSync(path.join(PER_PROMPT_DIR, `${id}.json`), JSON.stringify(detail), "utf8");
    written++;
  }
}
console.log(`Wrote ${written} per-prompt files to public/data/p/`);

// Write catalog-index.json
const indexPath = path.join(PUBLIC_DATA_DIR, "catalog-index.json");
fs.writeFileSync(
  indexPath,
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalPrompts: catalogIndex.length,
    categories: Object.values(CATEGORIES_META),
    items: catalogIndex,
  }),
  "utf8"
);
console.log(`Wrote catalog-index.json (${(fs.statSync(indexPath).size / 1024).toFixed(1)} KB)`);

// Also process design.md systems
const rawDesignMd = JSON.parse(fs.readFileSync(RAW_DESIGN_MD_PATH, "utf8"));
const designSystems = rawDesignMd.map((d) => ({
  id: d.id,
  slug: d.slug,
  name: d.name,
  namePt: translateTitleToPt(d.name),
  description: d.description || d.frontmatterSummary?.description || "",
  mode: d.frontmatterSummary?.mode || "light",
  modeLabelPt: d.frontmatterSummary?.mode === "dark" ? "Modo Escuro (Dark)" : "Modo Claro (Light)",
  colors: d.frontmatterSummary?.colors || {},
  typography: d.frontmatterSummary?.typography || {},
  rounded: d.frontmatterSummary?.rounded || {},
  spacing: d.frontmatterSummary?.spacing || {},
  sourceDomain: d.sourceRef?.domain || "",
  sourceUrl: d.sourceRef?.url || "",
  tokenPreviewUrl: d.tokenPreviewUrl || "",
  designMdUrl: d.designMdUrl || "",
  thumbnailUrl: d.thumbnail?.url ? optimizeImageUrl(d.thumbnail.url, 600) : "",
  creatorName: d.creator?.name || "Comunidade",
  createdAt: d.createdAt,
}));

const designSystemsPath = path.join(PUBLIC_DATA_DIR, "design-systems.json");
fs.writeFileSync(
  designSystemsPath,
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    total: designSystems.length,
    items: designSystems,
  }),
  "utf8"
);
console.log(`Wrote design-systems.json (${(fs.statSync(designSystemsPath).size / 1024).toFixed(1)} KB)`);
