# SEO, renderização estática e publicação

Este documento descreve a configuração técnica do projeto **Almeida & Castro Advocacia** após a refatoração de SEO. O visual e os componentes React continuam sendo a interface principal quando o JavaScript está ativo. Durante o build, cada rota pública também recebe um HTML rastreável e acessível antes da execução do React.

## 1. Modos de demonstração e produção

A configuração central está em `src/config/site.js` e utiliza variáveis de ambiente.

### Demonstração

```env
VITE_IS_DEMO=true
VITE_ALLOW_INDEXING=false
VITE_PRODUCTION_DATA_CONFIRMED=false
```

Nesse modo:

- as páginas recebem `noindex, nofollow`;
- o `robots.txt` bloqueia o rastreamento;
- o sitemap é válido, porém não solicita indexação de URLs;
- dados estruturados locais não são publicados;
- o rodapé e o topo identificam que o projeto é demonstrativo;
- dados de contato, equipe e registros profissionais são tratados como fictícios.

### Produção

Primeiro, substitua todos os dados demonstrativos pelos dados reais e confirmados. Depois utilize:

```env
VITE_IS_DEMO=false
VITE_ALLOW_INDEXING=true
VITE_PRODUCTION_DATA_CONFIRMED=true
```

O build falhará se o modo produção ainda contiver os principais dados de contato demonstrativos ou se a confirmação não tiver sido ativada.

## 2. Configurar domínio próprio

Para um domínio como `https://www.exemplo.com.br`:

```env
VITE_SITE_URL=https://www.exemplo.com.br
VITE_BASE_PATH=/
```

Também atualize os dados institucionais no ambiente de hospedagem. No GitHub Pages, configure o domínio em **Settings → Pages → Custom domain**. O DNS deve seguir as orientações apresentadas pelo próprio GitHub para o domínio utilizado.

Com domínio próprio e `VITE_BASE_PATH=/`, `robots.txt`, `sitemap.xml`, manifest, canonicals e imagens sociais passam a usar a raiz do domínio automaticamente.

## 3. Limitação do robots.txt no GitHub Pages

Em um projeto publicado em uma subpasta, o arquivo fica disponível em:

```text
https://usuario.github.io/nome-do-repositorio/robots.txt
```

Mecanismos de busca procuram normalmente o arquivo na raiz do host, por exemplo `https://usuario.github.io/robots.txt`. Portanto, o `robots.txt` do repositório não controla todo o domínio `github.io`. Para controle completo, utilize domínio próprio ou publique em uma plataforma onde o projeto ocupe a raiz do domínio, como Netlify, Vercel ou Cloudflare Pages.

Enquanto o projeto for demonstrativo, a proteção principal também é aplicada por meio da meta `robots` presente em cada HTML pré-renderizado.

## 4. Atualizar telefone, endereço e e-mail

Utilize variáveis de ambiente, sem alterar componentes:

```env
VITE_SITE_ADDRESS=Endereço real confirmado
VITE_SITE_POSTAL_CODE=00000-000
VITE_SITE_PHONE=(00) 00000-0000
VITE_SITE_WHATSAPP=5500000000000
VITE_SITE_EMAIL=contato@dominio.com.br
VITE_SITE_OPENING_HOURS=Segunda a sexta, das 8h às 18h
```

Também estão disponíveis:

```env
VITE_SITE_NAME=
VITE_SITE_SHORT_NAME=
VITE_SITE_DESCRIPTION=
VITE_SITE_AUTHOR=
VITE_SITE_CITY=
VITE_SITE_STATE=
VITE_SITE_STATE_NAME=
VITE_INSTAGRAM_URL=
VITE_LINKEDIN_URL=
```

Redes sociais vazias não são renderizadas.

## 5. Criar um novo artigo

Pelo painel administrativo, crie o artigo normalmente. O painel salva um arquivo Markdown em `src/content/articles` e inicia uma nova publicação.

Também é possível criar manualmente:

```md
---
title: "Título do artigo"
slug: "titulo-do-artigo"
category: "Direito Civil"
summary: "Descrição curta e natural para listagens e mecanismos de busca."
excerpt: "Resumo opcional."
cover: "/images/articles/default.svg"
coverAlt: "Descrição acessível da imagem"
author: "Nome do autor"
date: "2026-07-12T12:00:00.000Z"
updatedAt: "2026-07-12T12:00:00.000Z"
keywords: ["palavra-chave", "tema jurídico"]
readingTime: 5
featured: false
published: true
noIndex: false
---

Conteúdo em Markdown.
```

Artigos com `published: false`, `noIndex: true` ou data futura não entram no sitemap. Artigos em rascunho ou futuros também não são exibidos ao público.

## 6. Executar localmente

Requisitos:

- Node.js `>=20.19.0 <21`;
- npm compatível com a versão do Node.

Comandos:

```bash
npm ci
npm run lint:imports
npm run dev
```

Para testar o resultado final com geração estática:

```bash
npm run build
npm run preview
```

O comando `npm run build` executa automaticamente:

1. validação da configuração;
2. build Vite;
3. geração dos HTMLs estáticos;
4. geração do sitemap;
5. geração do robots.txt;
6. geração do manifest;
7. validação das rotas e metadados.

## 7. Publicar no GitHub Pages

O workflow está em `.github/workflows/pages.yml`. Um push na branch `main` executa:

```text
npm ci
npm run lint:imports
npm run build
publicação da pasta dist
```

O ambiente atual está deliberadamente configurado como demonstração e sem indexação. Para produção, altere as variáveis do workflow ou use variáveis do ambiente de implantação com dados reais.

As rotas públicas são exportadas como diretórios contendo `index.html`, por exemplo:

```text
dist/sobre/index.html
dist/areas-de-atuacao/direito-civil/index.html
dist/artigos/titulo-do-artigo/index.html
```

Assim, páginas válidas não dependem mais do `404.html` para serem abertas diretamente.

## 8. Publicar no Netlify

Configuração recomendada:

```text
Build command: npm run build
Publish directory: dist
Node: 20.19.x
```

Variáveis principais:

```env
VITE_SITE_URL=https://dominio.netlify.app
VITE_BASE_PATH=/
VITE_IS_DEMO=true
VITE_ALLOW_INDEXING=false
VITE_PRODUCTION_DATA_CONFIRMED=false
```

Como as rotas válidas possuem arquivos HTML próprios, não é necessário usar um redirecionamento geral para `index.html`. Uma regra de fallback pode ser mantida somente para URLs inexistentes, desde que não substitua as páginas geradas.

## 9. Publicar no Vercel

Configuração recomendada:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
Node: 20.x
```

Use `VITE_BASE_PATH=/` e defina `VITE_SITE_URL` com o domínio da implantação. As mesmas regras de demonstração e produção se aplicam.

## 10. Exemplo de HTML pré-renderizado

Cada página gerada contém conteúdo antes do JavaScript:

```html
<title>Advogado Civil em São Raimundo Nonato | Almeida & Castro</title>
<meta name="description" content="Orientação em contratos, obrigações e responsabilidade civil...">
<link rel="canonical" href="https://dominio/areas-de-atuacao/direito-civil/">
<meta property="og:title" content="Advogado Civil em São Raimundo Nonato | Almeida & Castro">
<meta name="twitter:card" content="summary_large_image">

<div id="root">
  <div class="ssg-shell" data-prerendered="true">
    <main id="main-content">
      <nav aria-label="Navegação estrutural">...</nav>
      <h1>Direito Civil</h1>
      <p>O Direito Civil está presente em diversas relações do cotidiano...</p>
      <a href="/areas-de-atuacao/">Conheça outras áreas</a>
    </main>
  </div>
</div>
```

Em produção, os HTMLs também recebem `LegalService`, `Organization`, `BreadcrumbList` e `BlogPosting`, conforme a rota. Em demonstração, os schemas locais são omitidos para não representar a empresa fictícia como real.

## 11. Imagens e fontes

- imagens institucionais e da equipe utilizam arquivos locais;
- artigos com capas antigas do Unsplash utilizam uma capa local;
- imagens possuem dimensões, texto alternativo, `decoding="async"` e carregamento tardio abaixo da primeira dobra;
- a imagem principal recebe prioridade alta e não utiliza lazy loading;
- a imagem social possui proporção 1200 × 630;
- os pesos solicitados ao Google Fonts foram reduzidos para evitar downloads desnecessários.

Para uma etapa futura de otimização visual, os JPEGs institucionais podem receber variantes WebP e AVIF específicas para cada largura sem alterar a arquitetura atual.

## 12. Segurança

- nenhuma chave privada ou token é incluído no frontend;
- o painel administrativo mantém o token criptografado somente no navegador configurado;
- artigos são sanitizados com DOMPurify;
- links externos utilizam `noopener noreferrer`;
- o build bloqueia domínio fictício no sitemap e produção com dados demonstrativos;
- uma Content Security Policy deve ser definida preferencialmente pelos cabeçalhos da hospedagem, pois GitHub Pages não oferece configuração completa de cabeçalhos por repositório.
