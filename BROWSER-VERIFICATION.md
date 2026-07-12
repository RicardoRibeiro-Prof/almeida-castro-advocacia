# Verificação em navegador real

Resultado: **FALHA**

- Data UTC: 2026-07-12 16:24:41
- Commit verificado: 9d79347be1440d27bb42581790381485fdf27044
- Auditoria Playwright/Chromium: código 1

```text
/: HTTP 200, H1="Atuação jurídica ética, estratégica e próxima de você.", erros=0
/sobre/: HTTP 200, H1="O Escritório", erros=0
/areas-de-atuacao/: HTTP 200, H1="Áreas de Atuação", erros=0
/areas-de-atuacao/direito-previdenciario/: HTTP 200, H1="Direito Previdenciário", erros=0
/equipe/: HTTP 200, H1="Nossa Equipe", erros=0
/artigos/: HTTP 200, H1="Artigos e informações jurídicas", erros=0
/contato/: HTTP 200, H1="Contato", erros=0
/politica-de-privacidade/: HTTP 200, H1="Política de Privacidade", erros=0
/admin/: HTTP 200, H1="Configure o acesso por senha.", erros=1

Falhas encontradas (1):
- /admin/: #root ausente
```
