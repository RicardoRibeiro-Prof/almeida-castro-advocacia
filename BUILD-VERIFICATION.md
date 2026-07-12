# Verificação automatizada do build

Resultado: **SUCESSO**

- Node: v20.19.5
- npm: 10.8.2
- npm ci: código 0
- lint:imports: código 0
- build completo: código 0
- rotas e HTMLs essenciais: código 0

## Saída do npm ci
```text

added 76 packages in 1s
```

## Saída do lint
```text

> almeida-castro-advocacia@2.1.0 lint:imports
> node scripts/check-imports.mjs

Importações locais verificadas em 37 arquivos.
```

## Saída do build
```text

> almeida-castro-advocacia@2.1.0 prebuild
> node scripts/check-config.mjs

Configuração validada: https://ricardoribeiro-prof.github.io/almeida-castro-advocacia | base /almeida-castro-advocacia/ | modo demonstração

> almeida-castro-advocacia@2.1.0 build
> vite build

[36mvite v6.4.3 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1640 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                             [39m[1m[2m  1.89 kB[22m[1m[22m[2m │ gzip:  0.74 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-C_GUVnhD.css              [39m[1m[2m 53.35 kB[22m[1m[22m[2m │ gzip: 11.19 kB[22m
[2mdist/[22m[2massets/[22m[36mSectionHeading-D2jciUYV.js      [39m[1m[2m  0.33 kB[22m[1m[22m[2m │ gzip:  0.24 kB[22m
[2mdist/[22m[2massets/[22m[36mAreaCard-CxpfNDI2.js            [39m[1m[2m  0.54 kB[22m[1m[22m[2m │ gzip:  0.33 kB[22m
[2mdist/[22m[2massets/[22m[36mPageHero-t6QETJMG.js            [39m[1m[2m  0.97 kB[22m[1m[22m[2m │ gzip:  0.49 kB[22m
[2mdist/[22m[2massets/[22m[36mNotFound-C9RUr0q6.js            [39m[1m[2m  1.05 kB[22m[1m[22m[2m │ gzip:  0.57 kB[22m
[2mdist/[22m[2massets/[22m[36mPracticeAreas-BFeZBIgf.js       [39m[1m[2m  1.54 kB[22m[1m[22m[2m │ gzip:  0.79 kB[22m
[2mdist/[22m[2massets/[22m[36mTeam-ByELaXVc.js                [39m[1m[2m  1.99 kB[22m[1m[22m[2m │ gzip:  0.92 kB[22m
[2mdist/[22m[2massets/[22m[36mContactSection-Ecqj-sL8.js      [39m[1m[2m  2.18 kB[22m[1m[22m[2m │ gzip:  0.90 kB[22m
[2mdist/[22m[2massets/[22m[36mteam-DCgGmOSG.js                [39m[1m[2m  2.41 kB[22m[1m[22m[2m │ gzip:  1.07 kB[22m
[2mdist/[22m[2massets/[22m[36mSeo-su5wgePI.js                 [39m[1m[2m  2.98 kB[22m[1m[22m[2m │ gzip:  1.09 kB[22m
[2mdist/[22m[2massets/[22m[36mPrivacyPolicy-CqZNRYT0.js       [39m[1m[2m  3.19 kB[22m[1m[22m[2m │ gzip:  1.41 kB[22m
[2mdist/[22m[2massets/[22m[36mArticles-C7Qe5OKD.js            [39m[1m[2m  4.66 kB[22m[1m[22m[2m │ gzip:  2.00 kB[22m
[2mdist/[22m[2massets/[22m[36mPracticeAreaDetail-C2f3GeCX.js  [39m[1m[2m  5.08 kB[22m[1m[22m[2m │ gzip:  1.93 kB[22m
[2mdist/[22m[2massets/[22m[36mContact-CkTSCabf.js             [39m[1m[2m  5.16 kB[22m[1m[22m[2m │ gzip:  2.00 kB[22m
[2mdist/[22m[2massets/[22m[36mArticleDetail-D7rXCAbY.js       [39m[1m[2m  5.62 kB[22m[1m[22m[2m │ gzip:  2.29 kB[22m
[2mdist/[22m[2massets/[22m[36mAbout-DP4eym6i.js               [39m[1m[2m  5.92 kB[22m[1m[22m[2m │ gzip:  2.01 kB[22m
[2mdist/[22m[2massets/[22m[36mHome-C54ct8zC.js                [39m[1m[2m  9.12 kB[22m[1m[22m[2m │ gzip:  3.03 kB[22m
[2mdist/[22m[2massets/[22m[36micons-DVsL92tH.js               [39m[1m[2m 15.11 kB[22m[1m[22m[2m │ gzip:  3.34 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-DPxGAEne.js               [39m[1m[2m 21.74 kB[22m[1m[22m[2m │ gzip:  8.12 kB[22m
[2mdist/[22m[2massets/[22m[36marticleService-CJEhjbsc.js      [39m[1m[2m 23.77 kB[22m[1m[22m[2m │ gzip:  8.16 kB[22m
[2mdist/[22m[2massets/[22m[36msanitizer-bRchjNq8.js           [39m[1m[2m 28.91 kB[22m[1m[22m[2m │ gzip: 10.89 kB[22m
[2mdist/[22m[2massets/[22m[36mrouter-C2EwdcZZ.js              [39m[1m[2m 36.94 kB[22m[1m[22m[2m │ gzip: 13.40 kB[22m
[2mdist/[22m[2massets/[22m[36mcontent-CIBh7jNU.js             [39m[1m[2m 83.28 kB[22m[1m[22m[2m │ gzip: 26.80 kB[22m
[2mdist/[22m[2massets/[22m[36mreact-vendor-WaWdzvzX.js        [39m[1m[2m142.92 kB[22m[1m[22m[2m │ gzip: 45.78 kB[22m
[32m✓ built in 2.21s[39m

> almeida-castro-advocacia@2.1.0 postbuild
> node scripts/static-export.mjs && node scripts/generate-sitemap.mjs && node scripts/generate-robots.mjs && node scripts/generate-manifest.mjs && node scripts/validate-build.mjs

Exportação estática concluída: 21 páginas públicas e página 404.
Sitemap demonstrativo gerado sem URLs indexáveis.
robots.txt de demonstração gerado com bloqueio total.
Manifest gerado.
Build validado: 13 rotas estáticas, SEO e arquivos essenciais conferidos.
```
