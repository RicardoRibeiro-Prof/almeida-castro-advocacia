# Verificação automatizada do build

Resultado: **SUCESSO**

- Data UTC: 2026-07-12 16:15:05
- Commit verificado: 2b19166a2242c7c9b5472b2c6ab4dbc69b2cf8a9
- Node: v20.19.5
- npm: 10.8.2
- npm ci: código 0
- lint:imports: código 0
- build, pré-renderização e auditorias: código 0
- Arquivos index.html gerados: 22

```text

added 76 packages in 1s

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
[2mdist/[22m[2massets/[22m[35mindex-C_GUVnhD.css              [39m[1m[2m 53.35 kB[22m[1m[22m[2m │ gzip: 11.19 kB[22m
[2mdist/[22m[2massets/[22m[36mSectionHeading-BXY3S0I6.js      [39m[1m[2m  0.33 kB[22m[1m[22m[2m │ gzip:  0.24 kB[22m
[2mdist/[22m[2massets/[22m[36mAreaCard-CIQJZFbk.js            [39m[1m[2m  0.54 kB[22m[1m[22m[2m │ gzip:  0.33 kB[22m
[2mdist/[22m[2massets/[22m[36mPageHero-BmMuZvgy.js            [39m[1m[2m  0.97 kB[22m[1m[22m[2m │ gzip:  0.49 kB[22m
[2mdist/[22m[2massets/[22m[36mNotFound-DkIfbG6W.js            [39m[1m[2m  1.05 kB[22m[1m[22m[2m │ gzip:  0.57 kB[22m
[2mdist/[22m[2massets/[22m[36mPracticeAreas-BiIrvtj0.js       [39m[1m[2m  1.54 kB[22m[1m[22m[2m │ gzip:  0.79 kB[22m
[2mdist/[22m[2massets/[22m[36mTeam-BLdxFs38.js                [39m[1m[2m  2.01 kB[22m[1m[22m[2m │ gzip:  0.94 kB[22m
[2mdist/[22m[2massets/[22m[36mContactSection-wEb-58aA.js      [39m[1m[2m  2.18 kB[22m[1m[22m[2m │ gzip:  0.90 kB[22m
[2mdist/[22m[2massets/[22m[36mteam-CXaFXqJV.js                [39m[1m[2m  2.43 kB[22m[1m[22m[2m │ gzip:  1.09 kB[22m
[2mdist/[22m[2massets/[22m[36mSeo-BwReewir.js                 [39m[1m[2m  2.98 kB[22m[1m[22m[2m │ gzip:  1.09 kB[22m
[2mdist/[22m[2massets/[22m[36mPrivacyPolicy-DeAjCyad.js       [39m[1m[2m  3.19 kB[22m[1m[22m[2m │ gzip:  1.40 kB[22m
[2mdist/[22m[2massets/[22m[36mArticles-Bl53H-q8.js            [39m[1m[2m  4.66 kB[22m[1m[22m[2m │ gzip:  1.99 kB[22m
[2mdist/[22m[2massets/[22m[36mPracticeAreaDetail-BL2FR1Bs.js  [39m[1m[2m  5.08 kB[22m[1m[22m[2m │ gzip:  1.93 kB[22m
[2mdist/[22m[2massets/[22m[36mContact-DnppeBLU.js             [39m[1m[2m  5.16 kB[22m[1m[22m[2m │ gzip:  2.00 kB[22m
[2mdist/[22m[2massets/[22m[36mArticleDetail-CCXA_SLF.js       [39m[1m[2m  5.63 kB[22m[1m[22m[2m │ gzip:  2.30 kB[22m
[2mdist/[22m[2massets/[22m[36mAbout-iUxgZpeN.js               [39m[1m[2m  5.94 kB[22m[1m[22m[2m │ gzip:  2.01 kB[22m
[2mdist/[22m[2massets/[22m[36mHome-C-dIXRKm.js                [39m[1m[2m  9.12 kB[22m[1m[22m[2m │ gzip:  3.03 kB[22m
[2mdist/[22m[2massets/[22m[36micons-Bb1zcrqR.js               [39m[1m[2m 15.11 kB[22m[1m[22m[2m │ gzip:  3.34 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-BuZ2kQjN.js               [39m[1m[2m 22.54 kB[22m[1m[22m[2m │ gzip:  8.47 kB[22m
[2mdist/[22m[2massets/[22m[36marticleService-gxeJCaNp.js      [39m[1m[2m 23.64 kB[22m[1m[22m[2m │ gzip:  8.21 kB[22m
[2mdist/[22m[2massets/[22m[36msanitizer-bRchjNq8.js           [39m[1m[2m 28.91 kB[22m[1m[22m[2m │ gzip: 10.89 kB[22m
[2mdist/[22m[2massets/[22m[36mrouter-DWooJzlf.js              [39m[1m[2m 36.94 kB[22m[1m[22m[2m │ gzip: 13.40 kB[22m
[2mdist/[22m[2massets/[22m[36mcontent-CIBh7jNU.js             [39m[1m[2m 83.28 kB[22m[1m[22m[2m │ gzip: 26.80 kB[22m
[2mdist/[22m[2massets/[22m[36mreact-vendor-DyvKcWQ1.js        [39m[1m[2m142.90 kB[22m[1m[22m[2m │ gzip: 45.77 kB[22m
[32m✓ built in 2.35s[39m

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
```
