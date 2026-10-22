// Baixa todos os prompts públicos da API pública do Superdesign para scripts/raw/
// Uso: node scripts/fetch-data.mjs  (depois: node scripts/build-catalog.mjs)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_DIR = path.join(__dirname, "raw");
const API = "https://api.superdesign.dev/v1";
fs.mkdirSync(RAW_DIR, { recursive: true });

async function fetchAll(endpoint, limit) {
  const all = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    const res = await fetch(`${API}/${endpoint}?isPublic=true&limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error(`${endpoint} HTTP ${res.status}`);
    const data = await res.json();
    total = data.total ?? 0;
    const items = data.items ?? [];
    all.push(...items);
    console.log(`${endpoint}: ${all.length}/${total}`);
    if (items.length === 0) break;
    offset += limit;
  }
  return all;
}

const prompts = await fetchAll("prompt-library", 100);
fs.writeFileSync(path.join(RAW_DIR, "prompts.json"), JSON.stringify(prompts));
const designMd = await fetchAll("design-md-registry", 50);
fs.writeFileSync(path.join(RAW_DIR, "design-md.json"), JSON.stringify(designMd));
console.log("Pronto.");
