# Almeida & Castro Advocacia

Site institucional demonstrativo desenvolvido com **React, Vite e JavaScript**, com páginas públicas pré-renderizadas, blog em Markdown, painel administrativo próprio e publicação automatizada.

> **Projeto demonstrativo:** o escritório, os profissionais, os números de OAB, os contatos, o endereço e parte das imagens e textos são fictícios. A indexação permanece bloqueada até que todos os dados reais sejam substituídos e confirmados.

## Recursos implementados

- layout responsivo preservado em React;
- rotas públicas com `BrowserRouter` e suporte a caminho-base;
- exportação estática para arquivos reais em `dist`;
- HTML pré-renderizado dentro de `#root`;
- fallback legível sem JavaScript;
- metadados específicos por rota;
- canonical, Open Graph e Twitter Cards;
- sitemap e robots gerados automaticamente;
- artigos publicados pré-renderizados;
- artigos futuros e ocultos excluídos do build público;
- dados estruturados somente em produção confirmada e indexável;
- validação de configuração, importações, build, HTML, assets e caminhos-base;
- auditoria opcional do site já publicado;
- painel administrativo em `/admin/`, com gravação direta no GitHub;
- workflow oficial do GitHub Pages publicando exclusivamente `dist`.

## Estrutura principal

```text
almeida-castro-advocacia/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── public/
│   ├── admin/
│   │   ├── index.html
│   │   ├── admin.css
│   │   ├── admin.js
│   │   └── admin-password.js
│   ├── icons/
│   ├── images/
│   └── uploads/
├── scripts/
│   ├── audit-deployed-site.mjs
│   ├── audit-dist.mjs
│   ├── check-config.mjs
│   ├── check-imports.mjs
│   ├── generate-manifest.mjs
│   ├── generate-robots.mjs
│   ├── generate-sitemap.mjs
│   ├── site-routes.mjs
│   ├── static-export.mjs
│   └── validate-build.mjs
├── src/
│   ├── components/
│   ├── config/
│   │   └── site.js
│   ├── content/
│   │   └── articles/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── main.jsx
├── .env.example
├── BUILD-VERIFICATION.md
├── index.html
├── netlify.toml
├── package.json
└── vite.config.js
```

## Instalação local

Requisitos:

- Node.js `20.19.5` ou outra versão compatível com `>=20.19.0 <21`;
- npm instalado com o Node.js.

```bash
npm ci
npm run lint:imports
npm run dev
```

O endereço local costuma ser `http://localhost:5173`.

## Build completo

```bash
npm run build
```

O comando executa, em ordem:

1. validação das variáveis e das proteções de indexação;
2. conferência das fotografias necessárias;
3. build do Vite;
4. exportação estática de todas as rotas públicas;
5. geração do sitemap;
6. geração do robots.txt;
7. geração do manifest;
8. validação estrutural do build;
9. auditoria completa da pasta `dist`.

O build falha quando uma rota não possui HTML pré-renderizado, H1, metadados, canonical, CSS, JavaScript, conteúdo textual ou assets válidos.

## Como funciona a exportação estática

O Vite gera inicialmente o aplicativo e seus bundles. Em seguida, `scripts/static-export.mjs` cria arquivos HTML reais para cada rota.

Exemplos:

```text
dist/index.html
dist/sobre/index.html
dist/areas-de-atuacao/index.html
dist/areas-de-atuacao/direito-previdenciario/index.html
dist/equipe/index.html
dist/artigos/index.html
dist/artigos/nome-do-artigo/index.html
dist/contato/index.html
dist/politica-de-privacidade/index.html
dist/404.html
```

Cada documento contém `data-prerendered="true"`, cabeçalho, navegação, breadcrumbs, conteúdo, links e rodapé dentro de `#root`.

O React é montado primeiro em um elemento separado e ainda não anexado ao documento. O conteúdo estático só é substituído depois da primeira renderização funcional. Assim, uma falha anterior à inicialização não apaga o HTML disponível.

## Funcionamento sem JavaScript

Com JavaScript desativado, as páginas continuam exibindo:

- cabeçalho e menu;
- títulos e conteúdo principal;
- breadcrumbs;
- áreas de atuação;
- equipe demonstrativa;
- artigos completos;
- informações de contato;
- política de privacidade;
- links internos e rodapé.

O `<noscript>` informa que busca, formulário e painel administrativo exigem JavaScript. Na página de contato, canais diretos permanecem disponíveis como alternativa ao formulário interativo.

## Configuração central dos dados

Os dados institucionais são centralizados em:

```text
src/config/site.js
```

Também podem ser substituídos por variáveis de ambiente, conforme `.env.example`.

Não altere `src/utils/constants.js` para configurar os dados principais do escritório. Esse arquivo utiliza a configuração central.

Principais variáveis:

```text
VITE_SITE_URL
VITE_BASE_PATH
VITE_IS_DEMO
VITE_ALLOW_INDEXING
VITE_PRODUCTION_DATA_CONFIRMED
VITE_SITE_NAME
VITE_SITE_SHORT_NAME
VITE_SITE_DESCRIPTION
VITE_SITE_AUTHOR
VITE_SITE_ADDRESS
VITE_SITE_PHONE
VITE_SITE_WHATSAPP
VITE_SITE_EMAIL
VITE_SITE_LOGO
VITE_SITE_SHARE_IMAGE
VITE_INSTAGRAM_URL
VITE_LINKEDIN_URL
```

## Modo demonstração

Configuração atual do GitHub Pages:

```env
VITE_SITE_URL=https://ricardoribeiro-prof.github.io/almeida-castro-advocacia
VITE_BASE_PATH=/almeida-castro-advocacia/
VITE_IS_DEMO=true
VITE_ALLOW_INDEXING=false
VITE_PRODUCTION_DATA_CONFIRMED=false
```

Neste modo:

- todas as páginas recebem `noindex, nofollow` para `robots` e `googlebot`;
- o robots.txt permite rastreamento com `Allow: /`;
- o sitemap é um XML válido e vazio;
- o robots.txt não referencia o sitemap;
- dados estruturados de empresa não são publicados;
- o build impede a ativação acidental da indexação.

## Sitemap e robots.txt

Não edite manualmente arquivos em `public/robots.txt` ou `public/sitemap.xml`.

Eles são gerados durante o build por:

```text
scripts/generate-robots.mjs
scripts/generate-sitemap.mjs
```

Em demonstração, o sitemap não contém URLs indexáveis.

Em produção confirmada, o sitemap inclui:

- páginas institucionais;
- todas as áreas jurídicas;
- apenas artigos publicados;
- nenhum artigo futuro;
- nenhum artigo marcado com `noIndex`;
- datas de atualização válidas;
- canonicals no domínio oficial.

## Canonicals e caminho-base

No GitHub Pages, o domínio e a subpasta fazem parte de `VITE_SITE_URL`:

```text
https://ricardoribeiro-prof.github.io/almeida-castro-advocacia
```

Exemplos gerados:

```text
https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/
https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/sobre/
https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/areas-de-atuacao/
https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/artigos/
```

As funções em `src/config/site.js` removem um caminho-base já presente antes de montar URLs. As auditorias bloqueiam URLs sem a subpasta e caminhos duplicados.

## Assets no GitHub Pages

O Vite utiliza:

```env
VITE_BASE_PATH=/almeida-castro-advocacia/
```

Isso é aplicado a:

- bundles JavaScript e CSS;
- favicon e manifest;
- ícones;
- fotografias institucionais;
- capas dos artigos;
- imagem Open Graph;
- uploads em `public/uploads`;
- painel em `public/admin`.

Caminhos armazenados nos artigos podem continuar no formato `/uploads/arquivo.jpg` ou `/images/arquivo.jpg`; o site resolve esses caminhos sob a subpasta configurada.

## Criar e editar artigos

Os artigos ficam em:

```text
src/content/articles/*.md
```

Exemplo de frontmatter:

```yaml
---
title: "Título do artigo"
slug: "titulo-do-artigo"
category: "Direito Civil"
summary: "Resumo do conteúdo."
cover: "/uploads/capa.jpg"
coverAlt: "Descrição acessível da imagem"
author: "Nome do autor"
date: "2026-07-12T12:00:00.000Z"
updatedAt: "2026-07-12T12:00:00.000Z"
readingTime: 5
featured: false
published: true
noIndex: false
---
```

Também é possível usar o painel:

```text
https://endereco-do-site/admin/
```

O painel utiliza um token fine-grained do GitHub limitado a este repositório, com permissão `Contents: Read and write`. No primeiro acesso, o token pode ser protegido no navegador com uma senha. Ele é criptografado localmente com Web Crypto e não é gravado no código ou enviado a um servidor próprio.

Cada artigo ou imagem salvo gera um commit na branch `main`, iniciando uma nova publicação.

## Publicação no GitHub Pages

O workflow permanente está em:

```text
.github/workflows/deploy-pages.yml
```

Ele executa em cada push para `main` e também aceita execução manual.

Etapas principais:

1. checkout do repositório;
2. configuração oficial do GitHub Pages;
3. Node.js `20.19.5`;
4. `npm ci`;
5. `npm run lint:imports`;
6. `npm run build`;
7. upload exclusivo da pasta `dist`;
8. deploy do artifact no ambiente `github-pages`;
9. auditoria HTTP do site publicado.

No repositório, acesse **Settings > Pages** e selecione **GitHub Actions** como fonte de publicação. Depois disso, qualquer push em `main` inicia o deploy.

Para executar manualmente, abra **Actions > Publicar site pré-renderizado > Run workflow**.

## Publicação no Netlify

O `netlify.toml` já define:

```text
Build command: npm run build
Publish directory: dist
Node: 20.19.5
```

Para uma demonstração hospedada na raiz:

```env
VITE_SITE_URL=https://nome-do-site.netlify.app
VITE_BASE_PATH=/
VITE_IS_DEMO=true
VITE_ALLOW_INDEXING=false
VITE_PRODUCTION_DATA_CONFIRMED=false
```

A regra SPA possui `force = false`. Portanto, arquivos reais como `/sobre/index.html`, páginas de áreas e artigos são entregues antes do fallback para `/index.html`.

O cache está configurado para:

- HTML e rotas: revalidação imediata;
- bundles com hash em `/assets/*`: um ano e `immutable`;
- imagens e ícones: cache intermediário;
- uploads: cache de 30 dias com revalidação;
- robots e sitemap: revalidação imediata;
- painel administrativo: `no-store` e `noindex`.

## Domínio próprio

Depois de configurar o domínio no provedor de hospedagem:

1. confirme HTTPS ativo;
2. altere `VITE_SITE_URL` para o domínio oficial, sem barra final;
3. use `VITE_BASE_PATH=/` quando o site estiver na raiz;
4. substitua todos os dados demonstrativos;
5. execute o build ainda com indexação desativada;
6. revise o HTML publicado;
7. somente depois ative a produção indexável.

Não é necessário editar robots.txt ou sitemap.xml: ambos serão regenerados.

## Transformar o projeto demonstrativo em site real

Antes de habilitar a indexação, é obrigatório substituir e conferir:

- nome do escritório;
- profissionais;
- números de OAB;
- telefone;
- WhatsApp;
- e-mail;
- endereço;
- redes sociais;
- domínio;
- logotipo;
- imagens;
- textos demonstrativos;
- política de privacidade;
- dados estruturados.

Também revise áreas de atuação, horários, autores dos artigos, avisos jurídicos e conformidade ética aplicável.

Configuração esperada para produção no domínio oficial:

```env
VITE_SITE_URL=https://dominio-oficial.com.br
VITE_BASE_PATH=/
VITE_IS_DEMO=false
VITE_ALLOW_INDEXING=true
VITE_PRODUCTION_DATA_CONFIRMED=true
```

Proteções aplicadas:

- `VITE_IS_DEMO=true` impede a indexação;
- solicitar indexação com `VITE_IS_DEMO=true` faz o build falhar;
- solicitar indexação com `VITE_PRODUCTION_DATA_CONFIRMED=false` faz o build falhar;
- dados demonstrativos conhecidos fazem o build falhar quando a produção é confirmada;
- dados estruturados só são incluídos quando a produção está confirmada e indexável.

Antes da indexação, execute:

```bash
npm ci
npm run lint:imports
npm run build
npm run preview
```

## Auditorias

Auditar a pasta gerada:

```bash
npm run audit:dist
```

Auditar uma publicação existente, sem alterar o site:

```bash
AUDIT_SITE_URL=https://ricardoribeiro-prof.github.io/almeida-castro-advocacia npm run audit:deployed
```

A auditoria publicada verifica status HTTP, títulos, H1, canonicals, conteúdo pré-renderizado, noindex, CSS, JavaScript, robots, sitemap, artigo e página 404.

## Registro de verificação

`BUILD-VERIFICATION.md` registra o resultado da última validação automatizada executada no ambiente de CI, incluindo versões do Node e npm, quantidade de páginas exportadas e saída das auditorias.

## Cuidados de segurança e manutenção

- nunca publique ou envie o token do GitHub para terceiros;
- limite o token ao repositório e à permissão `Contents: Read and write`;
- revogue tokens que tenham sido expostos;
- não envie `node_modules` nem `dist` ao repositório;
- mantenha imagens otimizadas;
- revise artigos e datas antes de publicar;
- mantenha o modo demonstração enquanto os dados forem fictícios;
- verifique o workflow após alterações em dependências, rotas ou scripts de build.
