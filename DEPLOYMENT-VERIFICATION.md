# Verificação do site publicado

Resultado: **SUCESSO**

- Data UTC: 2026-07-12 16:19:52
- Commit verificado: 02b734cb83bbd188e42109443931da90ae5831b7
- Auditoria HTTP: código 0
- Arquivos index.html gerados: 22
- Canonical inicial: https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/"
- Canonical interno: https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/sobre/"
- URLs no sitemap demonstrativo: 0

## robots.txt

```text
User-agent: *
Allow: /
```

## Amostra do HTML pré-renderizado

```html
<div id="root" data-prerendered="true"><div class="ssg-shell" data-prerendered="true"> <a class="ssg-skip" href="#main-content">Pular para o conteúdo</a> <header class="ssg-header"><div><a href="/almeida-castro-advocacia/"><strong>Almeida &amp; Castro</strong><span>Advocacia</span></a><nav aria-label="Menu principal"><a href="/almeida-castro-advocacia/sobre/">O Escritório</a><a href="/almeida-castro-advocacia/areas-de-atuacao/">Áreas de atuação</a><a href="/almeida-castro-advocacia/equipe/">Equipe</a><a href="/almeida-castro-advocacia/artigos/">Artigos</a><a href="/almeida-castro-advocacia/contato/">Contato</a></nav></div></header> <main id="main-content" class="ssg-main"><header class="ssg-page-header"><p class="ssg-eyebrow">Almeida &amp; Castro Advocacia</p><h1>Atuação jurídica ética, estratégica e próxima de você.</h1><p>Orientação responsável para pessoas, famílias e empresas, com linguagem clara e análise cui
```

## Resultado da auditoria HTTP

```text

> almeida-castro-advocacia@2.1.0 audit:deployed
> node scripts/audit-deployed-site.mjs

Auditoria HTTP concluída com sucesso.
- 8 páginas institucionais responderam com HTML próprio
- 5 arquivos CSS/JavaScript responderam com sucesso
- um artigo publicado e a página 404 foram conferidos
- canonicals, títulos, H1, noindex, pré-renderização, robots e sitemap conferidos
```
