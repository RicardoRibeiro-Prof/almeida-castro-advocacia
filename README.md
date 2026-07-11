# Almeida & Castro Advocacia — versão sem Supabase

Site institucional desenvolvido com **Vite, React e JavaScript**, com blog administrável por meio do **Decap CMS**, autenticação pelo **Netlify Identity** e armazenamento dos conteúdos no **GitHub**.

Esta versão não utiliza Supabase, banco de dados ou servidor próprio. Os artigos são arquivos Markdown salvos no repositório e as imagens enviadas pelo painel ficam em `public/uploads`.

> Todos os nomes, números de OAB, contatos, profissionais e textos do projeto são fictícios. Revise o conteúdo antes de utilizar em um escritório real.

## 1. Como funciona

- O site público é construído pelo Vite;
- Os artigos ficam em `src/content/articles`;
- O painel está em `/admin`;
- O Decap CMS edita os arquivos no GitHub usando o Git Gateway;
- O Netlify Identity controla quem pode entrar;
- Ao publicar um artigo, a Netlify faz um novo deploy automaticamente;
- Rascunhos são gerenciados pelo fluxo editorial do CMS e não aparecem no site enquanto não forem publicados.

## 2. Estrutura principal

```text
almeida-castro-advocacia-decap/
├── public/
│   ├── admin/
│   │   ├── index.html
│   │   └── config.yml
│   ├── images/
│   ├── uploads/
│   ├── _redirects
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   ├── check-imports.mjs
│   └── generate-sitemap.mjs
├── src/
│   ├── components/
│   ├── content/
│   │   └── articles/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── utils/
├── .env.example
├── netlify.toml
├── package.json
└── vite.config.js
```

## 3. Instalar e executar no computador

1. Instale a versão LTS do Node.js.
2. Extraia o ZIP.
3. Abra a pasta no VS Code.
4. Abra o terminal e execute:

```bash
npm install
npm run dev
```

Acesse o endereço exibido no terminal, normalmente:

```text
http://localhost:5173
```

O site público funciona localmente. O painel `/admin` precisa do site conectado ao GitHub e publicado na Netlify para autenticação e gravação dos artigos.

## 4. Criar o repositório no GitHub

1. Entre no GitHub e crie um repositório novo.
2. O nome pode ser `almeida-castro-advocacia`.
3. Envie todo o conteúdo deste projeto para a raiz do repositório.
4. Confirme que `package.json`, `netlify.toml`, `src` e `public` aparecem na página inicial do repositório.
5. Use a branch principal chamada `main`.

Não envie as pastas `node_modules` e `dist`.

## 5. Publicar na Netlify

1. Entre na Netlify.
2. Escolha **Add new project**.
3. Clique em **Import an existing project**.
4. Conecte o GitHub.
5. Escolha o repositório.
6. Confirme:

```text
Build command: npm run build
Publish directory: dist
```

7. Em variáveis de ambiente, cadastre:

```text
VITE_SITE_URL=https://nome-do-site.netlify.app
```

8. Publique o projeto.

O arquivo `netlify.toml` já contém as configurações de build e os redirecionamentos necessários.

## 6. Ativar o Netlify Identity

Depois da primeira publicação:

1. Abra o projeto na Netlify.
2. Entre em **Project configuration > Identity**.
3. Clique em **Enable Identity**.
4. Em configurações de registro, escolha **Invite only**.

Não deixe o cadastro aberto, pois somente pessoas autorizadas devem acessar o painel.

## 7. Ativar o Git Gateway

1. Ainda nas configurações de Identity, localize **Services**.
2. Entre em **Git Gateway**.
3. Clique em **Enable Git Gateway**.
4. Confirme que o Gateway está ligado ao mesmo repositório do site.

O Git Gateway permite que o painel grave artigos e imagens no GitHub sem entregar ao advogado acesso direto ao repositório.

## 8. Criar o primeiro administrador

1. Na Netlify, abra **Project configuration > Identity > Users**.
2. Clique em **Invite users**.
3. Informe o e-mail do administrador.
4. O administrador receberá um convite.
5. Ao abrir o convite, ele deverá cadastrar uma senha.

Depois, o painel estará disponível em:

```text
https://nome-do-site.netlify.app/admin/
```

O endereço antigo `/admin/login` redireciona automaticamente para `/admin/`.

## 9. Publicar um artigo

1. Acesse `/admin/`.
2. Entre com o e-mail convidado.
3. Clique em **Artigos > Novo Artigo**.
4. Preencha título, slug, categoria, resumo, imagem, autor e conteúdo.
5. Clique em **Salvar** para manter como rascunho.
6. Use o fluxo editorial para enviar para revisão ou publicar.
7. Quando o artigo for publicado, o CMS cria uma alteração no GitHub e a Netlify inicia um novo deploy.

O artigo aparecerá no site depois que o deploy terminar.

## 10. Editar ou excluir artigos

No painel:

- Abra um artigo para alterar o conteúdo;
- Salve e publique novamente;
- Use a opção de excluir quando precisar removê-lo;
- O histórico das alterações continuará disponível no GitHub.

## 11. Imagens

As imagens enviadas pelo painel são armazenadas em:

```text
public/uploads/
```

O endereço público é:

```text
/uploads/nome-da-imagem.jpg
```

Antes do upload, prefira imagens em JPG, PNG ou WEBP, otimizadas e com até aproximadamente 2 MB. O Decap CMS não aplica sozinho um limite rígido de 5 MB nesta configuração; portanto, a equipe deve evitar arquivos grandes.

## 12. Categorias

As categorias também podem ser administradas sem alterar o código:

1. Acesse `/admin/`;
2. Entre em **Configurações > Categorias**;
3. Adicione, edite ou remova itens;
4. Use um slug com letras minúsculas, números e hífens;
5. Salve e publique a alteração.

As categorias são armazenadas em:

```text
src/content/settings/categories.yml
```

Evite excluir uma categoria que ainda esteja sendo utilizada por artigos publicados.

## 13. Alterar WhatsApp e dados do escritório

Abra:

```text
src/utils/constants.js
```

Altere número do WhatsApp, telefone, endereço, e-mail, horários e redes sociais. Use o número com código do país e DDD, sem espaços ou símbolos.

## 14. Alterar equipe, áreas e textos

- Equipe: `src/data/team.js`
- Áreas de atuação: `src/data/practiceAreas.jsx`
- Contatos: `src/utils/constants.js`
- Textos institucionais: arquivos em `src/pages`
- Imagens institucionais: `public/images`
- Artigos: `src/content/articles`

## 15. Domínio próprio

1. Na Netlify, abra **Domain management**.
2. Clique em **Add a domain**.
3. Informe o domínio.
4. Siga as orientações de DNS mostradas pela Netlify.
5. Depois que o domínio funcionar, altere a variável `VITE_SITE_URL` para o domínio oficial.
6. Faça um novo deploy.
7. Atualize a URL do sitemap dentro de `public/robots.txt`.

## 16. Backup

O GitHub já mantém o histórico de todos os artigos e alterações. Como cópia adicional:

1. Abra o repositório no GitHub.
2. Clique em **Code > Download ZIP**.
3. Guarde o arquivo em local seguro.

Também é possível clonar o repositório no computador com Git.

## 17. Verificações antes de publicar

```bash
npm install
npm run lint:imports
npm run build
npm run preview
```

Confira:

- Página inicial;
- Menus e rotas;
- Busca e filtros do blog;
- Página individual de artigo;
- Responsividade;
- Botão do WhatsApp;
- `/admin/` após ativar Identity e Git Gateway;
- Criação de rascunho;
- Upload de imagem;
- Publicação e novo deploy.

## 18. Observações importantes

- Não há cadastro público de administradores;
- Não há banco de dados externo;
- Não há chaves secretas no frontend;
- O conteúdo só muda no site após o novo deploy;
- O painel depende da Netlify, GitHub, Identity e Git Gateway;
- Revise os textos e as regras éticas da advocacia antes do uso real.
