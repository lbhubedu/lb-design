# 🎨 LB Design — Biblioteca Aberta (REA) de Prompts & Design Systems

> **Recurso Educacional Aberto (REA), 100% em Português.**
> Criado sob medida para leigos e profissionais transformarem ideias em páginas de vendas, painéis e aplicativos completos em minutos.

---

## 🌟 O que é este projeto?

O **LB Design** é uma biblioteca aberta de prompts de UI/UX e sistemas de design em português. Ele nasce do catálogo público do [Superdesign.dev](https://superdesign.dev/library) — enriquecido com fontes abertas curadas — e remove travas de cópia, limites de visualização e o jargão técnico em inglês.

- **1.317 Prompts Completos de UI/UX** organizados em 10 categorias, incluindo 140 prompts curados do repositório oficial [superdesign-prompts](https://github.com/superdesigndev/superdesign-prompts) (conteúdo CC0) e 41 componentes open source do registro [Kibo UI](https://www.kibo-ui.com) (MIT).
- **148 Sistemas de Design (`design.md`)** com paletas de cores interativas (clique para copiar HEX) e regras de tipografia.
- **✨ Personalizador Mágico**: digite o nome do seu negócio e o nicho (ex: "Clínica Vida, Odontologia"), e o prompt é transformado instantaneamente em português pronto para ser usado.
- **Pré-visualização Interativa**: teste o site em tempo real nos modos Computador (Desktop), Tablet e Celular (Mobile).
- **Formatado para as melhores IAs**:
  - ⚡ **Arena.AI**
  - 💻 **Codex Desktop**
  - 🚀 **Antigravity (Google)**
  - 🤖 **ChatGPT**
- **100% Grátis & Sem Bloqueios**: Zero paywalls, zero cadastro obrigatório.
- **Favoritos Salvos Localmente**: Guarde os modelos que mais gostar no seu próprio navegador.

---

## 🗂️ Categorias

| Ícone | Categoria | Descrição | Prompts |
|---|---|---|:---:|
| 💻 | **Aplicativos (Mobile & Desktop)** | Interfaces completas para celulares e telas desktop de alta fidelidade | 109 |
| 🤝 | **CRMs & Gestão Comercial** | CRM, funis de vendas, faturamento, invoices e suporte | 5 |
| 📊 | **Dashboards & Painéis de Controle** | Gráficos de receita, métricas analíticas e consoles administrativos | 81 |
| 🪄 | **Ferramentas de IA & Agentes** | Chatbots, agentes, geradores de imagem/vídeo e skills para IA | 89 |
| 💼 | **Sistemas Web & Plataformas SaaS** | Plataformas web completas, áreas de membros e portais | 7 |
| 🔥 | **Páginas de Vendas & Landing Pages** | Landing pages de alta conversão, lançamentos, lojas e portfólios | 292 |
| 🧱 | **Componentes & Peças de UI** | Menus, botões, tabelas de preço, formulários e blocos open source | 224 |
| 🎨 | **Estilos Visuais & Design Systems** | Dark Mode, Neumorphism, Efeito Vidro, Luxo e Minimalismo | 418 |
| ⚡ | **Efeitos Visuais & Animações 3D** | Fundos com shaders, simulações 3D e cursores interativos | 80 |
| 📑 | **Apresentações & Pitch Decks** | Slides e decks para investidores e vendas | 12 |
| 📐 | **Sistemas de Cores (`design.md`)** | Paletas hexadecimais prontas, tipografia e tokens de design | 148 |

> As contagens acima são calculadas automaticamente pelo `scripts/build-catalog.mjs`.

---

## 🚀 Como Usar em 3 Passos Simples

1. **Escolha o Modelo**: Navegue pelas categorias ou busque pelo seu nicho na barra de busca (ex: *"barbearia"*, *"odontologia"*, *"dashboard financeiro"*).
2. **Abra o Personalizador Mágico**: Clique no card para abrir o estúdio. Digite o nome da sua empresa e o que ela faz.
3. **Copie e Cole**: Clique em **Copiar Prompt Personalizado** e cole no [Arena.AI](https://arena.ai), Codex Desktop, Antigravity ou ChatGPT!

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite 6**
- **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide Icons**
- **Vercel** (Deploy e Hospedagem Edge)

---

## 💻 Desenvolvimento Local

```bash
# 1. Clone o repositório
git clone https://github.com/lbhubedu/superdesign-biblioteca-pt.git
cd superdesign-biblioteca-pt

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Atualize os dados do catálogo (opcional)
node scripts/fetch-data.mjs        # catálogo público do Superdesign
node scripts/fetch-community.mjs   # fontes abertas (superdesign-prompts + Kibo UI)
node scripts/build-catalog.mjs     # regenera public/data/

# 5. Gere o build de produção
npm run build
```

---

## 📄 Licença & Créditos (REA)

Este projeto é um **Recurso Educacional Aberto**. Veja o [LICENSE.md](LICENSE.md) completo:

- **Código-fonte**: MIT © 2026 LB Hub Educação.
- **Conteúdo do catálogo**: prompts do catálogo público do [Superdesign.dev](https://superdesign.dev/library); prompts curados de [superdesign-prompts](https://github.com/superdesigndev/superdesign-prompts) (**CC0**); componentes [Kibo UI](https://www.kibo-ui.com) (**MIT**).
- **Organização, traduções e resumos LB Design**: **CC BY 4.0**.

Crédito obrigatório ao catálogo original: [superdesign.dev](https://superdesign.dev).
