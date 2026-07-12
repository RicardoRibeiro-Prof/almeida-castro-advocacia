# Verificação automatizada do build e da publicação

Resultado: **SUCESSO**

- Data UTC: 2026-07-12 21:11:19
- Commit verificado: a46edc0a71aeed1af7368f2710cced96b31cfd1e
- Node: v20.19.5
- npm: 10.8.2
- npm ci: código 0
- lint:imports: código 0
- build, pré-renderização e auditoria de dist: código 0
- auditoria HTTP da publicação: código 0
- arquivos index.html em dist: 22
- artigos pré-renderizados: 8
- canonical inicial: https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/
- canonical interno: https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/sobre/
- URLs no sitemap demonstrativo: 0

## robots.txt gerado

```text
User-agent: *
Allow: /
```

## Saída das verificações

```text

added 76 packages, and audited 77 packages in 2s

11 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

> almeida-castro-advocacia@2.1.0 lint:imports
> node scripts/check-imports.mjs

Importações locais verificadas em 37 arquivos.

> almeida-castro-advocacia@2.1.0 prebuild
> node scripts/check-config.mjs && node scripts/download-site-images.mjs

Configuração validada: https://ricardoribeiro-prof.github.io/almeida-castro-advocacia | base /almeida-castro-advocacia/ | modo demonstração | indexação bloqueada
Imagem existente preservada: images/hero-office.jpg
Imagem existente preservada: images/about-office.jpg
Imagem existente preservada: images/team-rafael.jpg
Imagem existente preservada: images/team-marina.jpg
Imagem existente preservada: images/articles/previdenciario.jpg
Imagem existente preservada: images/articles/familia.jpg
Imagem existente preservada: images/articles/trabalhista.jpg
Imagem existente preservada: images/articles/consumidor.jpg
Imagem existente preservada: images/articles/civil.jpg
Imagem existente preservada: images/articles/empresarial.jpg
Imagem existente preservada: images/articles/general.jpg
11 fotografias verificadas para o site.

> almeida-castro-advocacia@2.1.0 build
> vite build

[36mvite v6.4.3 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1640 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                             [39m[1m[2m  2.29 kB[22m[1m[22m[2m │ gzip:  0.97 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-Dq9-3_eA.css              [39m[1m[2m 54.23 kB[22m[1m[22m[2m │ gzip: 11.30 kB[22m
[2mdist/[22m[2massets/[22m[36mSectionHeading-BXY3S0I6.js      [39m[1m[2m  0.33 kB[22m[1m[22m[2m │ gzip:  0.24 kB[22m
[2mdist/[22m[2massets/[22m[36mAreaCard-CIQJZFbk.js            [39m[1m[2m  0.54 kB[22m[1m[22m[2m │ gzip:  0.33 kB[22m
[2mdist/[22m[2massets/[22m[36mPageHero-BmMuZvgy.js            [39m[1m[2m  0.97 kB[22m[1m[22m[2m │ gzip:  0.49 kB[22m
[2mdist/[22m[2massets/[22m[36mNotFound-W6qHSRYv.js            [39m[1m[2m  1.05 kB[22m[1m[22m[2m │ gzip:  0.57 kB[22m
[2mdist/[22m[2massets/[22m[36mPracticeAreas-BOWOn1a6.js       [39m[1m[2m  1.54 kB[22m[1m[22m[2m │ gzip:  0.79 kB[22m
[2mdist/[22m[2massets/[22m[36mTeam-ChqP3ctV.js                [39m[1m[2m  2.01 kB[22m[1m[22m[2m │ gzip:  0.94 kB[22m
[2mdist/[22m[2massets/[22m[36mContactSection-CIJ4z_Z5.js      [39m[1m[2m  2.18 kB[22m[1m[22m[2m │ gzip:  0.90 kB[22m
[2mdist/[22m[2massets/[22m[36mteam-DUw81s-b.js                [39m[1m[2m  2.43 kB[22m[1m[22m[2m │ gzip:  1.09 kB[22m
[2mdist/[22m[2massets/[22m[36mSeo-BNdDCDyc.js                 [39m[1m[2m  2.98 kB[22m[1m[22m[2m │ gzip:  1.09 kB[22m
[2mdist/[22m[2massets/[22m[36mPrivacyPolicy-BDxCE02M.js       [39m[1m[2m  3.19 kB[22m[1m[22m[2m │ gzip:  1.41 kB[22m
[2mdist/[22m[2massets/[22m[36mArticles-v2P3K3BM.js            [39m[1m[2m  4.66 kB[22m[1m[22m[2m │ gzip:  1.99 kB[22m
[2mdist/[22m[2massets/[22m[36mPracticeAreaDetail-CMqhLYMg.js  [39m[1m[2m  5.08 kB[22m[1m[22m[2m │ gzip:  1.93 kB[22m
[2mdist/[22m[2massets/[22m[36mContact-B7V9_kJU.js             [39m[1m[2m  5.16 kB[22m[1m[22m[2m │ gzip:  2.00 kB[22m
[2mdist/[22m[2massets/[22m[36mArticleDetail-SrrtHQ5D.js       [39m[1m[2m  5.63 kB[22m[1m[22m[2m │ gzip:  2.30 kB[22m
[2mdist/[22m[2massets/[22m[36mAbout-Cgpsqfml.js               [39m[1m[2m  5.94 kB[22m[1m[22m[2m │ gzip:  2.01 kB[22m
[2mdist/[22m[2massets/[22m[36mHome-Lp-4X75d.js                [39m[1m[2m  9.12 kB[22m[1m[22m[2m │ gzip:  3.03 kB[22m
[2mdist/[22m[2massets/[22m[36micons-Bb1zcrqR.js               [39m[1m[2m 15.11 kB[22m[1m[22m[2m │ gzip:  3.34 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-DLnR20Fy.js               [39m[1m[2m 22.54 kB[22m[1m[22m[2m │ gzip:  8.48 kB[22m
[2mdist/[22m[2massets/[22m[36marticleService-gxeJCaNp.js      [39m[1m[2m 23.64 kB[22m[1m[22m[2m │ gzip:  8.21 kB[22m
[2mdist/[22m[2massets/[22m[36msanitizer-bRchjNq8.js           [39m[1m[2m 28.91 kB[22m[1m[22m[2m │ gzip: 10.89 kB[22m
[2mdist/[22m[2massets/[22m[36mrouter-DWooJzlf.js              [39m[1m[2m 36.94 kB[22m[1m[22m[2m │ gzip: 13.40 kB[22m
[2mdist/[22m[2massets/[22m[36mcontent-CIBh7jNU.js             [39m[1m[2m 83.28 kB[22m[1m[22m[2m │ gzip: 26.80 kB[22m
[2mdist/[22m[2massets/[22m[36mreact-vendor-DyvKcWQ1.js        [39m[1m[2m142.90 kB[22m[1m[22m[2m │ gzip: 45.77 kB[22m
[32m✓ built in 3.02s[39m

> almeida-castro-advocacia@2.1.0 postbuild
> node scripts/static-export.mjs && node scripts/generate-sitemap.mjs && node scripts/generate-robots.mjs && node scripts/generate-manifest.mjs && node scripts/validate-build.mjs && node scripts/audit-dist.mjs

Exportação estática concluída: 21 páginas públicas e página 404.
Sitemap demonstrativo gerado sem URLs indexáveis.
robots.txt de demonstração gerado: rastreamento permitido e indexação bloqueada pelos metadados.
Manifest gerado.
Build validado: 13 rotas estáticas, 8 artigos, página 404, SEO, assets e rastreamento conferidos.
Auditoria da pasta dist concluída com sucesso.
- 13 páginas estáticas conferidas
- 8 artigos publicados pré-renderizados
- 0 artigos futuros ou ocultos ausentes
- página 404, canonicals, metadados, conteúdo, assets, manifest, robots e sitemap conferidos
- canonical inicial: https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/
- canonical interno: https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/sobre/

> almeida-castro-advocacia@2.1.0 audit:deployed
> node scripts/audit-deployed-site.mjs

Auditoria HTTP concluída com sucesso.
- 14 páginas públicas responderam com HTML próprio
- 16 assets, incluindo CSS, JavaScript, imagens, ícones, manifest e painel, responderam com sucesso
- títulos, descriptions, robots, googlebot, canonicals, Open Graph, Twitter Cards, H1 e conteúdo pré-renderizado conferidos
- um artigo publicado, página 404, robots.txt e sitemap.xml conferidos
- modo: demonstração/não indexável
```
