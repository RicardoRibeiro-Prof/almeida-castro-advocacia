;(() => {
  'use strict'

  const OWNER = 'RicardoRibeiro-Prof'
  const REPO = 'almeida-castro-advocacia'
  const BRANCH = 'main'
  const ARTICLE_DIR = 'src/content/articles'
  const UPLOAD_DIR = 'public/uploads'
  const API = `https://api.github.com/repos/${OWNER}/${REPO}`
  const TOKEN_KEY = 'almeida-castro-github-token'
  const CATEGORIES = [
    'Direito Civil',
    'Direito Previdenciário',
    'Direito Trabalhista',
    'Direito de Família',
    'Direito do Consumidor',
    'Direito Empresarial',
    'Informações Gerais',
  ]

  const siteBase = (() => {
    const marker = '/admin/'
    const index = window.location.pathname.indexOf(marker)
    return index >= 0 ? `${window.location.pathname.slice(0, index)}/` : '/'
  })()

  const state = {
    token: sessionStorage.getItem(TOKEN_KEY) || '',
    user: null,
    articles: [],
    articleMap: new Map(),
    pendingDelete: null,
    slugTouched: false,
  }

  const $ = (id) => document.getElementById(id)
  const loginView = $('loginView')
  const appView = $('appView')
  const listView = $('listView')
  const editorView = $('editorView')
  const articleList = $('articleList')
  const loadingState = $('loadingState')
  const emptyState = $('emptyState')
  const form = $('articleForm')

  function showToast(message, type = '') {
    const toast = $('toast')
    toast.textContent = message
    toast.className = `toast is-visible ${type ? `is-${type}` : ''}`
    clearTimeout(showToast.timer)
    showToast.timer = setTimeout(() => { toast.className = 'toast' }, 4300)
  }

  function setBusy(button, busy, label) {
    if (!button) return
    if (busy) {
      button.dataset.originalText = button.textContent
      button.textContent = label || 'Aguarde…'
      button.disabled = true
    } else {
      button.textContent = button.dataset.originalText || button.textContent
      button.disabled = false
    }
  }

  async function github(path, options = {}) {
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    }
    if (state.token) headers.Authorization = `Bearer ${state.token}`

    const response = await fetch(path.startsWith('http') ? path : `${API}${path}`, {
      ...options,
      headers,
    })

    if (response.status === 204) return null
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error = new Error(payload.message || `Erro ${response.status} ao acessar o GitHub.`)
      error.status = response.status
      throw error
    }
    return payload
  }

  function encodeText(value) {
    const bytes = new TextEncoder().encode(value)
    let binary = ''
    bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
    return btoa(binary)
  }

  function decodeText(value) {
    const binary = atob(value.replace(/\n/g, ''))
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }

  function encodeBytes(buffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    const chunk = 0x8000
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
    }
    return btoa(binary)
  }

  function cleanYamlString(value = '') {
    const trimmed = String(value).trim()
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      try { return JSON.parse(trimmed) } catch { return trimmed.slice(1, -1) }
    }
    return trimmed
  }

  function parseMarkdown(raw, path, sha) {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
    const meta = {}
    if (match) {
      match[1].split('\n').forEach((line) => {
        const separator = line.indexOf(':')
        if (separator < 0) return
        const key = line.slice(0, separator).trim()
        const rawValue = line.slice(separator + 1).trim()
        if (rawValue === 'true' || rawValue === 'false') meta[key] = rawValue === 'true'
        else if (/^-?\d+(\.\d+)?$/.test(rawValue)) meta[key] = Number(rawValue)
        else meta[key] = cleanYamlString(rawValue)
      })
    }
    const filename = path.split('/').pop().replace(/\.md$/, '')
    return {
      path,
      sha,
      title: meta.title || 'Artigo sem título',
      slug: meta.slug || filename,
      category: meta.category || 'Informações Gerais',
      summary: meta.summary || '',
      cover: meta.cover || '',
      author: meta.author || 'Almeida & Castro Advocacia',
      date: meta.date || new Date().toISOString(),
      readingTime: Number(meta.readingTime || 4),
      featured: Boolean(meta.featured),
      published: meta.published !== false,
      body: match ? match[2].trim() : raw.trim(),
    }
  }

  function yaml(value) {
    return JSON.stringify(String(value ?? ''))
  }

  function serializeArticle(article) {
    return `---\ntitle: ${yaml(article.title)}\nslug: ${yaml(article.slug)}\ncategory: ${yaml(article.category)}\nsummary: ${yaml(article.summary)}\ncover: ${yaml(article.cover)}\nauthor: ${yaml(article.author)}\ndate: ${yaml(article.date)}\nreadingTime: ${Number(article.readingTime) || 4}\nfeatured: ${Boolean(article.featured)}\npublished: ${Boolean(article.published)}\n---\n${article.body.trim()}\n`
  }

  function slugify(value = '') {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' e ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100)
  }

  function toLocalDateTime(value) {
    const date = value ? new Date(value) : new Date()
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]))
  }

  function publicAssetUrl(value = '') {
    if (!value) return ''
    if (/^https?:/i.test(value)) return value
    return `${window.location.origin}${siteBase}${value.replace(/^\//, '')}`
  }

  function articleUrl(slug) {
    return `${window.location.origin}${siteBase}artigos/${slug}`
  }

  async function connect(token) {
    state.token = token.trim()
    if (!state.token) throw new Error('Informe um token do GitHub.')
    const [user, repo] = await Promise.all([
      github('https://api.github.com/user'),
      github(''),
    ])
    if (!repo.permissions?.push) throw new Error('Este token não possui permissão de escrita no repositório.')
    state.user = user
    sessionStorage.setItem(TOKEN_KEY, state.token)
    $('userBadge').textContent = user.name || user.login
    $('siteLink').href = siteBase
    loginView.hidden = true
    appView.hidden = false
    await loadArticles()
  }

  async function loadArticles() {
    loadingState.hidden = false
    emptyState.hidden = true
    articleList.innerHTML = ''
    try {
      const files = await github(`/contents/${ARTICLE_DIR}?ref=${encodeURIComponent(BRANCH)}`)
      const markdownFiles = files.filter((file) => file.type === 'file' && file.name.endsWith('.md'))
      const articles = await Promise.all(markdownFiles.map(async (file) => {
        const data = await github(`/contents/${file.path}?ref=${encodeURIComponent(BRANCH)}`)
        return parseMarkdown(decodeText(data.content), data.path, data.sha)
      }))
      state.articles = articles.sort((a, b) => new Date(b.date) - new Date(a.date))
      state.articleMap = new Map(state.articles.map((article) => [article.path, article]))
      updateStats()
      renderArticles()
    } catch (error) {
      if (error.status === 404) {
        state.articles = []
        updateStats()
        renderArticles()
      } else {
        showToast(error.message, 'error')
      }
    } finally {
      loadingState.hidden = true
    }
  }

  function updateStats() {
    $('totalCount').textContent = state.articles.length
    $('publishedCount').textContent = state.articles.filter((item) => item.published).length
    $('draftCount').textContent = state.articles.filter((item) => !item.published).length
    $('featuredCount').textContent = state.articles.filter((item) => item.featured).length
  }

  function renderArticles() {
    const query = $('searchInput').value.trim().toLowerCase()
    const filter = $('statusFilter').value
    const visible = state.articles.filter((article) => {
      const matchesQuery = !query || `${article.title} ${article.category}`.toLowerCase().includes(query)
      const matchesStatus = filter === 'all' || (filter === 'published' ? article.published : !article.published)
      return matchesQuery && matchesStatus
    })

    articleList.innerHTML = visible.map((article) => `
      <article class="article-row" data-path="${escapeHtml(article.path)}">
        <div>
          <h2>${escapeHtml(article.title)}</h2>
          <div class="article-row__meta">
            <span class="status ${article.published ? 'status--published' : 'status--draft'}">${article.published ? 'Publicado' : 'Oculto'}</span>
            <span>${escapeHtml(article.category)}</span>
            <span>${new Date(article.date).toLocaleDateString('pt-BR')}</span>
            ${article.featured ? '<span>Destaque</span>' : ''}
          </div>
        </div>
        <div class="article-row__actions">
          <a class="mini-button" href="${articleUrl(article.slug)}" target="_blank" rel="noopener noreferrer">Ver</a>
          <button class="mini-button" data-action="edit" type="button">Editar</button>
          <button class="mini-button mini-button--danger" data-action="delete" type="button">Excluir</button>
        </div>
      </article>
    `).join('')
    emptyState.hidden = visible.length > 0
  }

  function showList() {
    editorView.hidden = true
    listView.hidden = false
  }

  function resetForm() {
    form.reset()
    $('originalPath').value = ''
    $('originalSha').value = ''
    $('author').value = 'Almeida & Castro Advocacia'
    $('date').value = toLocalDateTime(new Date())
    $('readingTime').value = 4
    $('published').checked = true
    $('featured').checked = false
    $('deleteEditorButton').hidden = true
    state.slugTouched = false
    updateCoverPreview()
  }

  function openNewArticle() {
    resetForm()
    $('editorTitle').textContent = 'Novo artigo'
    listView.hidden = true
    editorView.hidden = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openEditor(article) {
    resetForm()
    $('originalPath').value = article.path
    $('originalSha').value = article.sha
    $('title').value = article.title
    $('slug').value = article.slug
    $('category').value = article.category
    $('summary').value = article.summary
    $('cover').value = article.cover
    $('author').value = article.author
    $('date').value = toLocalDateTime(article.date)
    $('readingTime').value = article.readingTime
    $('published').checked = article.published
    $('featured').checked = article.featured
    $('body').value = article.body
    $('editorTitle').textContent = 'Editar artigo'
    $('deleteEditorButton').hidden = false
    state.slugTouched = true
    updateCoverPreview()
    listView.hidden = true
    editorView.hidden = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function readForm() {
    const dateValue = $('date').value
    return {
      title: $('title').value.trim(),
      slug: slugify($('slug').value),
      category: $('category').value,
      summary: $('summary').value.trim(),
      cover: $('cover').value.trim(),
      author: $('author').value.trim(),
      date: dateValue ? new Date(dateValue).toISOString() : new Date().toISOString(),
      readingTime: Number($('readingTime').value) || 4,
      featured: $('featured').checked,
      published: $('published').checked,
      body: $('body').value.trim(),
    }
  }

  async function saveArticle(event) {
    event?.preventDefault()
    if (!form.reportValidity()) return
    const article = readForm()
    if (!article.slug || !article.body) {
      showToast('Preencha o endereço e o conteúdo do artigo.', 'error')
      return
    }

    const oldPath = $('originalPath').value
    const oldSha = $('originalSha').value
    const newPath = `${ARTICLE_DIR}/${article.slug}.md`
    const isEditing = Boolean(oldPath)
    const samePath = oldPath === newPath
    const saveButtons = [$('saveButton'), $('saveButtonTop')]
    saveButtons.forEach((button) => setBusy(button, true, 'Salvando…'))

    try {
      const body = {
        message: `${isEditing ? 'Atualizar' : 'Criar'} artigo “${article.slug}”`,
        content: encodeText(serializeArticle(article)),
        branch: BRANCH,
        ...(samePath && oldSha ? { sha: oldSha } : {}),
      }
      await github(`/contents/${newPath}`, { method: 'PUT', body: JSON.stringify(body) })
      if (isEditing && !samePath) {
        await github(`/contents/${oldPath}`, {
          method: 'DELETE',
          body: JSON.stringify({ message: `Renomear artigo para “${article.slug}”`, sha: oldSha, branch: BRANCH }),
        })
      }
      showToast('Artigo salvo. A publicação no GitHub Pages foi iniciada.', 'success')
      showList()
      await loadArticles()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      saveButtons.forEach((button) => setBusy(button, false))
    }
  }

  function requestDelete(article) {
    state.pendingDelete = article
    $('confirmText').textContent = `“${article.title}” será removido do repositório e do site após a nova publicação.`
    $('confirmDialog').showModal()
  }

  async function deleteArticle(article) {
    if (!article) return
    setBusy($('confirmDeleteButton'), true, 'Excluindo…')
    try {
      await github(`/contents/${article.path}`, {
        method: 'DELETE',
        body: JSON.stringify({ message: `Excluir artigo “${article.slug}”`, sha: article.sha, branch: BRANCH }),
      })
      showToast('Artigo excluído. O site será atualizado automaticamente.', 'success')
      state.pendingDelete = null
      showList()
      await loadArticles()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setBusy($('confirmDeleteButton'), false)
    }
  }

  async function compressImage(file) {
    if (!file.type.startsWith('image/')) throw new Error('Selecione uma imagem válida.')
    const bitmap = await createImageBitmap(file)
    const maxDimension = 1600
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const context = canvas.getContext('2d')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    let quality = 0.84
    let blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    while (blob && blob.size > 950000 && quality > 0.48) {
      quality -= 0.1
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    }
    if (!blob) throw new Error('Não foi possível preparar a imagem.')
    if (blob.size > 1000000) throw new Error('A imagem continuou muito grande. Escolha outra imagem.')
    return blob
  }

  async function uploadCover(file) {
    const progress = $('uploadProgress')
    progress.hidden = false
    progress.textContent = 'Comprimindo imagem…'
    try {
      const blob = await compressImage(file)
      progress.textContent = 'Enviando para o GitHub…'
      const filename = `${slugify($('slug').value || $('title').value || 'capa')}-${Date.now()}.jpg`
      const path = `${UPLOAD_DIR}/${filename}`
      const buffer = await blob.arrayBuffer()
      await github(`/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Enviar imagem “${filename}”`,
          content: encodeBytes(buffer),
          branch: BRANCH,
        }),
      })
      $('cover').value = `/uploads/${filename}`
      updateCoverPreview()
      showToast('Imagem enviada com sucesso.', 'success')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      progress.hidden = true
      $('coverFile').value = ''
    }
  }

  function updateCoverPreview() {
    const preview = $('coverPreview')
    const value = $('cover').value.trim()
    preview.innerHTML = value
      ? `<img src="${escapeHtml(publicAssetUrl(value))}" alt="Prévia da capa" onerror="this.parentElement.innerHTML='<span>Não foi possível carregar a imagem</span>'">`
      : '<span>Prévia da capa</span>'
  }

  CATEGORIES.forEach((category) => {
    const option = document.createElement('option')
    option.value = category
    option.textContent = category
    $('category').appendChild(option)
  })

  $('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault()
    const button = $('loginButton')
    setBusy(button, true, 'Conectando…')
    try {
      await connect($('token').value)
      $('token').value = ''
    } catch (error) {
      sessionStorage.removeItem(TOKEN_KEY)
      state.token = ''
      showToast(error.status === 401 ? 'Token inválido ou expirado.' : error.message, 'error')
    } finally {
      setBusy(button, false)
    }
  })

  $('toggleToken').addEventListener('click', () => {
    const input = $('token')
    input.type = input.type === 'password' ? 'text' : 'password'
    $('toggleToken').textContent = input.type === 'password' ? 'Mostrar' : 'Ocultar'
  })

  $('logoutButton').addEventListener('click', () => {
    sessionStorage.removeItem(TOKEN_KEY)
    state.token = ''
    state.user = null
    appView.hidden = true
    loginView.hidden = false
    showToast('Sessão encerrada.', 'success')
  })

  $('newArticleButton').addEventListener('click', openNewArticle)
  $('newArticleAside').addEventListener('click', openNewArticle)
  $('backButton').addEventListener('click', showList)
  $('refreshButton').addEventListener('click', loadArticles)
  $('searchInput').addEventListener('input', renderArticles)
  $('statusFilter').addEventListener('change', renderArticles)
  $('title').addEventListener('input', () => {
    if (!state.slugTouched) $('slug').value = slugify($('title').value)
  })
  $('slug').addEventListener('input', () => {
    state.slugTouched = true
    $('slug').value = slugify($('slug').value)
  })
  $('cover').addEventListener('input', updateCoverPreview)
  $('coverFile').addEventListener('change', (event) => {
    const [file] = event.target.files
    if (file) uploadCover(file)
  })
  form.addEventListener('submit', saveArticle)
  $('saveButtonTop').addEventListener('click', saveArticle)

  articleList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]')
    if (!button) return
    const row = button.closest('.article-row')
    const article = state.articleMap.get(row.dataset.path)
    if (!article) return
    if (button.dataset.action === 'edit') openEditor(article)
    if (button.dataset.action === 'delete') requestDelete(article)
  })

  $('deleteEditorButton').addEventListener('click', () => {
    const article = state.articleMap.get($('originalPath').value)
    if (article) requestDelete(article)
  })

  $('confirmDialog').addEventListener('close', () => {
    if ($('confirmDialog').returnValue === 'confirm') deleteArticle(state.pendingDelete)
    else state.pendingDelete = null
  })

  if (state.token) {
    connect(state.token).catch((error) => {
      sessionStorage.removeItem(TOKEN_KEY)
      state.token = ''
      showToast(error.status === 401 ? 'Sua sessão expirou. Entre novamente.' : error.message, 'error')
    })
  }
})()
