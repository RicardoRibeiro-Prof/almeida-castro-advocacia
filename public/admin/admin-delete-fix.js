;(() => {
  'use strict'

  const OWNER = 'RicardoRibeiro-Prof'
  const REPO = 'almeida-castro-advocacia'
  const BRANCH = 'main'
  const TOKEN_KEY = 'almeida-castro-github-token'
  const API = `https://api.github.com/repos/${OWNER}/${REPO}`
  let deleting = false

  function showMessage(message, type = 'success') {
    const toast = document.getElementById('toast')
    if (!toast) {
      window.alert(message)
      return
    }
    toast.textContent = message
    toast.className = `toast is-visible is-${type}`
    window.clearTimeout(showMessage.timer)
    showMessage.timer = window.setTimeout(() => {
      toast.className = 'toast'
    }, 6500)
  }

  function encodedPath(path) {
    return path.split('/').map(encodeURIComponent).join('/')
  }

  function hardRefreshPanel() {
    const url = new URL(window.location.href)
    url.searchParams.set('refresh', Date.now().toString())
    window.location.replace(url.toString())
  }

  async function request(url, token, options = {}) {
    const method = (options.method || 'GET').toUpperCase()
    const separator = url.includes('?') ? '&' : '?'
    const requestUrl = method === 'GET' ? `${url}${separator}_=${Date.now()}` : url
    const response = await fetch(requestUrl, {
      ...options,
      method,
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        ...(options.headers || {}),
      },
    })

    const payload = response.status === 204
      ? null
      : await response.json().catch(() => ({}))

    if (!response.ok) {
      const error = new Error(payload?.message || `Erro ${response.status} ao acessar o GitHub.`)
      error.status = response.status
      throw error
    }

    return payload
  }

  async function getCurrentFile(path, token) {
    return request(`${API}/contents/${encodedPath(path)}?ref=${encodeURIComponent(BRANCH)}`, token)
  }

  async function removeFile(path, title, token) {
    let file
    try {
      file = await getCurrentFile(path, token)
    } catch (error) {
      if (error.status === 404) return
      throw error
    }

    try {
      await request(`${API}/contents/${encodedPath(path)}`, token, {
        method: 'DELETE',
        body: JSON.stringify({
          message: `Excluir artigo “${title}”`,
          sha: file.sha,
          branch: BRANCH,
        }),
      })
    } catch (error) {
      if (error.status !== 409 && error.status !== 422) throw error

      const refreshedFile = await getCurrentFile(path, token)
      await request(`${API}/contents/${encodedPath(path)}`, token, {
        method: 'DELETE',
        body: JSON.stringify({
          message: `Excluir artigo “${title}”`,
          sha: refreshedFile.sha,
          branch: BRANCH,
        }),
      })
    }
  }

  function getDeleteTarget(button) {
    if (button.id === 'deleteEditorButton') {
      const path = document.getElementById('originalPath')?.value
      const title = document.getElementById('title')?.value || 'artigo'
      return path ? { path, title, row: null } : null
    }

    if (button.dataset.action !== 'delete') return null
    const row = button.closest('.article-row')
    const path = row?.dataset.path
    const title = row?.querySelector('h2')?.textContent?.trim() || 'artigo'
    return path ? { path, title, row } : null
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) hardRefreshPanel()
  })

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('button')
    if (!button) return

    const target = getDeleteTarget(button)
    if (!target) return

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()

    if (deleting) return
    if (!window.confirm(`Excluir definitivamente “${target.title}”?\n\nO arquivo será removido do GitHub e desaparecerá do site após a publicação automática.`)) return

    const token = sessionStorage.getItem(TOKEN_KEY)
    if (!token) {
      showMessage('Sua sessão expirou. Entre novamente no painel.', 'error')
      return
    }

    deleting = true
    const previousText = button.textContent
    button.disabled = true
    button.textContent = 'Excluindo…'

    try {
      await removeFile(target.path, target.title, token)
      target.row?.remove()
      showMessage('Artigo excluído do GitHub. Atualizando a lista…', 'success')
      window.setTimeout(hardRefreshPanel, 350)
    } catch (error) {
      let message = error.message
      if (error.status === 401) message = 'Token inválido ou expirado. Gere outro token e entre novamente.'
      if (error.status === 403) message = 'O token não possui permissão Contents: Read and write para este repositório.'
      showMessage(message, 'error')
      button.disabled = false
      button.textContent = previousText
    } finally {
      deleting = false
    }
  }, true)
})()
