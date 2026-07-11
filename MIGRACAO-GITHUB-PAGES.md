# Publicação pelo GitHub Pages

Este projeto está preparado para ser construído e publicado automaticamente pelo GitHub Actions.

## Site público

Endereço inicial esperado:

`https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/`

## Painel administrativo

Endereço inicial esperado:

`https://ricardoribeiro-prof.github.io/almeida-castro-advocacia/admin/`

O painel não depende de Netlify, Supabase ou servidor externo. Ele usa a API oficial do GitHub para criar, editar e excluir os arquivos Markdown dos artigos.

### Token necessário

Crie um token de acesso detalhado com estas configurações:

- Acesso somente ao repositório `almeida-castro-advocacia`;
- Permissão do repositório: `Contents — Read and write`;
- Prazo de validade definido pelo proprietário.

O token é guardado em `sessionStorage`, portanto é apagado ao encerrar a sessão do navegador. Ele nunca deve ser adicionado aos arquivos do repositório.

## Domínio próprio

Quando o domínio for comprado, configure-o em **Settings → Pages → Custom domain**. O workflow utiliza os metadados do próprio GitHub Pages, portanto o caminho base do Vite será ajustado automaticamente na próxima publicação.
