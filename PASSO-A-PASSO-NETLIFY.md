# Publicação na Netlify — passo a passo simples

## Antes de começar

Você precisará de uma conta gratuita no GitHub e uma conta na Netlify.

Não use apenas o recurso de arrastar a pasta `dist`, porque o painel do blog precisa de um repositório conectado para salvar artigos e imagens.

## 1. Enviar o projeto ao GitHub

1. Extraia o ZIP do projeto.
2. Crie um repositório novo no GitHub.
3. Envie todos os arquivos da pasta do projeto.
4. Confirme que `package.json`, `netlify.toml`, `src` e `public` ficaram na raiz.
5. Confirme que a branch principal se chama `main`.

## 2. Conectar o projeto à Netlify

1. Na Netlify, clique em **Add new project**.
2. Escolha **Import an existing project**.
3. Selecione o GitHub.
4. Escolha o repositório do site.
5. Use as configurações:

```text
Build command: npm run build
Publish directory: dist
```

6. Cadastre a variável:

```text
VITE_SITE_URL=https://nome-do-site.netlify.app
```

7. Clique para publicar.

## 3. Ativar o acesso ao painel

Depois que o site estiver publicado:

1. Abra **Project configuration > Identity**.
2. Clique em **Enable Identity**.
3. Em registro de usuários, escolha **Invite only**.
4. Em **Services**, ative **Git Gateway**.

## 4. Convidar o administrador

1. Abra **Identity > Users**.
2. Clique em **Invite users**.
3. Digite o e-mail do advogado ou administrador.
4. A pessoa deverá abrir o convite recebido por e-mail e criar a senha.

## 5. Acessar o painel

Use:

```text
https://nome-do-site.netlify.app/admin/
```

No painel será possível:

- Criar artigos;
- Salvar rascunhos;
- Enviar para revisão;
- Publicar;
- Editar ou excluir matérias;
- Enviar imagens;
- Administrar categorias.

Ao publicar, a Netlify fará um novo deploy. O artigo aparecerá no site depois que esse deploy for concluído.
