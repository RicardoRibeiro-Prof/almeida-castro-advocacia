# Arquitetura do projeto

## Tecnologias

- Vite e React para a interface pública;
- React Router para rotas públicas;
- JavaScript, CSS e Lucide React;
- Markdown para os artigos;
- `js-yaml` para ler o frontmatter;
- `marked` para transformar Markdown em HTML;
- DOMPurify para sanitizar o HTML renderizado;
- Decap CMS como painel de conteúdo;
- Netlify Identity para autenticação;
- Netlify Git Gateway para gravação no GitHub;
- Netlify para build e hospedagem.

## Fluxo do conteúdo

1. O administrador acessa `/admin/`;
2. Netlify Identity valida o usuário convidado;
3. Decap CMS cria ou altera arquivos em `src/content/articles`;
4. Imagens são gravadas em `public/uploads`;
5. Git Gateway envia as alterações ao GitHub;
6. A publicação dispara um novo build na Netlify;
7. O Vite incorpora os arquivos Markdown ao bundle;
8. O site lista apenas artigos publicados e com data válida.

## Segurança

- Registro configurado como `Invite only`;
- Sem chave `service_role`, banco ou credenciais no projeto;
- Rascunhos do fluxo editorial ficam fora da branch principal até a publicação;
- HTML dos artigos é sanitizado antes de ser inserido na página;
- `/admin/` recebe `noindex,nofollow`.

## Limitação intencional

O conteúdo não é atualizado em tempo real. Cada publicação exige um novo deploy, o que é adequado para um blog jurídico institucional e reduz a complexidade operacional.
