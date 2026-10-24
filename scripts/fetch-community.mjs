// Baixa fontes abertas de designs de qualidade para enriquecer o catálogo:
//  1. superdesign-prompts (github.com/superdesigndev/superdesign-prompts) — 140 prompts
//     curados por uso, conteúdo CC0 (domínio público), previews no próprio repositório.
//  2. Kibo UI (kibo-ui.com) — registro shadcn/ui open source (MIT) com componentes completos.
// Uso: node scripts/fetch-community.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_DIR = path.join(__dirname, "raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const PROMPTS_REPO_RAW = "https://raw.githubusercontent.com/superdesigndev/superdesign-prompts/main";
const KIBO_REGISTRY = "https://www.kibo-ui.com/r/registry.json";

// Mapeamento das categorias do repositório de prompts para o catálogo local
const CATEGORY_MAP = {
  "Landing Pages": { category: "sites-vendas", subcategory: "Software (SaaS) & Empresas" },
  "Dashboards": { category: "dashboards-paineis", subcategory: "Painéis Administrativos Gerais" },
  "Animations & Backgrounds": { category: "efeitos-animacoes", subcategory: "Fundos Animados & Shaders 3D" },
  "Components": { category: "pecas-componentes", subcategory: "Cartões, Bento Grids & Blocos" },
  "Mobile Apps": { category: "apps-aplicativos", subcategory: "Apps de Produtividade & Utilidades" },
  "E-commerce": { category: "sites-vendas", subcategory: "Lojas & E-commerce" },
  "Portfolios": { category: "sites-vendas", subcategory: "Portfólios & Criadores" },
  "Auth & Login": { category: "pecas-componentes", subcategory: "Login, Cadastro & Formulários" },
  "Forms & Contact": { category: "pecas-componentes", subcategory: "Login, Cadastro & Formulários" },
  "Pricing Pages": { category: "pecas-componentes", subcategory: "Tabelas de Preços & Planos" },
  "AI Chat": { category: "ferramentas-ia", subcategory: "Chatbots & Playgrounds de Prompts" },
  "Email & Newsletter": { category: "pecas-componentes", subcategory: "E-mails & Newsletters" },
  "Design Systems & Styles": { category: "identidades-design-systems", subcategory: "Identidades Visuais & Estilos" },
  "Waitlist & Coming Soon": { category: "sites-vendas", subcategory: "Lançamentos & Lista de Espera" },
  "Blog & Editorial": { category: "sites-vendas", subcategory: "Blogs & Editoriais" },
  "Onboarding": { category: "apps-aplicativos", subcategory: "Boas-Vindas & Onboarding" },
  "Calendar": { category: "apps-aplicativos", subcategory: "Apps de Produtividade & Utilidades" },
};

// --- 1. Prompts curados do repositório oficial (CC0) ---
const promptsRes = await fetch(`${PROMPTS_REPO_RAW}/prompts.json`);
if (!promptsRes.ok) throw new Error(`prompts.json HTTP ${promptsRes.status}`);
const communityPrompts = await promptsRes.json();

// Resolve a extensão real de cada preview (png/jpg/webp/gif) via árvore do repositório
const treeRes = await fetch("https://api.github.com/repos/superdesigndev/superdesign-prompts/git/trees/main?recursive=1");
let previewExt = {};
if (treeRes.ok) {
  const tree = await treeRes.json();
  for (const f of tree.tree || []) {
    const m = f.path?.match(/^prompts\/([^/]+)\/preview\.(\w+)$/);
    if (m) previewExt[m[1]] = m[2];
  }
}

const community = communityPrompts.map((p) => ({
  ...p,
  source: "superdesign-prompts",
  mapping: CATEGORY_MAP[p.category] || null,
  thumbnailUrl: previewExt[p.slug]
    ? `${PROMPTS_REPO_RAW}/prompts/${p.slug}/preview.${previewExt[p.slug]}`
    : null,
}));

fs.writeFileSync(path.join(RAW_DIR, "community-prompts.json"), JSON.stringify(community, null, 1));
console.log(
  `community-prompts.json: ${community.length} itens | previews resolvidos: ${community.filter((c) => c.thumbnailUrl).length}`
);
console.log("categorias encontradas:", [...new Set(communityPrompts.map((p) => p.category))].join(" | "));

// --- 2. Kibo UI (MIT) ---
const kiboRes = await fetch(KIBO_REGISTRY);
if (!kiboRes.ok) throw new Error(`kibo registry HTTP ${kiboRes.status}`);
const kibo = await kiboRes.json();
fs.writeFileSync(path.join(RAW_DIR, "kibo-registry.json"), JSON.stringify(kibo));
console.log(`kibo-registry.json: ${kibo.items?.length ?? 0} componentes`);

// --- 3. Magic UI (MIT) — componentes animados de efeito ---
const magicuiRes = await fetch("https://magicui.design/r/registry.json");
if (!magicuiRes.ok) throw new Error(`magicui registry HTTP ${magicuiRes.status}`);
const magicui = await magicuiRes.json();
fs.writeFileSync(path.join(RAW_DIR, "magicui-registry.json"), JSON.stringify(magicui));
console.log(
  `magicui-registry.json: ${magicui.items?.filter((i) => i.type !== "registry:style").length ?? 0} componentes`
);

// --- 4. shadcn/ui oficial (MIT) — componentes base do registro padrão ---
const shadcnIndex = await (await fetch("https://ui.shadcn.com/r/index.json")).json();
const shadcnItems = [];
for (const item of shadcnIndex) {
  try {
    const res = await fetch(`https://ui.shadcn.com/r/styles/new-york-v4/${item.name}.json`);
    if (!res.ok) continue;
    const full = await res.json();
    shadcnItems.push({ ...full, name: item.name, meta: item.meta });
  } catch {
    // segue sem o item individual
  }
}
fs.writeFileSync(
  path.join(RAW_DIR, "shadcn-registry.json"),
  JSON.stringify({ items: shadcnItems })
);
console.log(`shadcn-registry.json: ${shadcnItems.length} componentes (com código)`);

// --- 5. tweakcn (MIT) — temas de design system com cssVars ---
const tweakcnRes = await fetch("https://tweakcn.com/r/registry.json");
if (!tweakcnRes.ok) throw new Error(`tweakcn registry HTTP ${tweakcnRes.status}`);
const tweakcn = await tweakcnRes.json();
fs.writeFileSync(path.join(RAW_DIR, "tweakcn-registry.json"), JSON.stringify(tweakcn));
console.log(`tweakcn-registry.json: ${tweakcn.items?.length ?? 0} temas`);
