# Verificação do site publicado

Resultado: **SUCESSO**

- Data UTC: 2026-07-12 21:11:19
- Commit verificado: `a46edc0a71aeed1af7368f2710cced96b31cfd1e`
- Auditoria HTTP: código `0`
- Arquivos `index.html` gerados: `22`
- Páginas públicas pré-renderizadas: `21`, além de `404.html`
- Artigos pré-renderizados: `8`
- Páginas conferidas por HTTP: `14`
- Assets conferidos por HTTP: `16`
- Canonical inicial: `https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/`
- Canonical interno: `https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/sobre/`
- URLs no sitemap demonstrativo: `0`

## robots.txt

```text
User-agent: *
Allow: /
```

## Amostra do HTML pré-renderizado

```html
<div id="root" data-prerendered="true">
  <div class="ssg-shell" data-prerendered="true">
    <a class="ssg-skip" href="#main-content">Pular para o conteúdo</a>
    <header class="ssg-header">
      <a href="/almeida-castro-advocacia/">Almeida &amp; Castro Advocacia</a>
      <nav aria-label="Menu principal">
        <a href="/almeida-castro-advocacia/sobre/">O Escritório</a>
        <a href="/almeida-castro-advocacia/areas-de-atuacao/">Áreas de atuação</a>
        <a href="/almeida-castro-advocacia/equipe/">Equipe</a>
        <a href="/almeida-castro-advocacia/artigos/">Artigos</a>
        <a href="/almeida-castro-advocacia/contato/">Contato</a>
      </nav>
    </header>
    <main id="main-content" class="ssg-main">
      <h1>Atuação jurídica ética, estratégica e próxima de você.</h1>
```

## Resultado da auditoria HTTP

```text
> almeida-castro-advocacia@2.1.0 audit:deployed
> node scripts/audit-deployed-site.mjs

Auditoria HTTP concluída com sucesso.
- 14 páginas públicas responderam com HTML próprio
- 16 assets, incluindo CSS, JavaScript, imagens, ícones, manifest e painel, responderam com sucesso
- títulos, descriptions, robots, googlebot, canonicals, Open Graph, Twitter Cards, H1 e conteúdo pré-renderizado conferidos
- um artigo publicado, página 404, robots.txt e sitemap.xml conferidos
- modo: demonstração/não indexável
```
