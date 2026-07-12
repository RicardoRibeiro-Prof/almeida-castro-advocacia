;(() => {
  'use strict'

  const VAULT_KEY = 'almeida-castro-admin-vault-v1'
  const TOKEN_KEY = 'almeida-castro-github-token'
  const ITERATIONS = 250000
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const $ = (id) => document.getElementById(id)

  function showMessage(message, type = 'error') {
    const toast = $('toast')
    if (!toast) {
      window.alert(message)
      return
    }
    toast.textContent = message
    toast.className = `toast is-visible is-${type}`
    window.clearTimeout(showMessage.timer)
    showMessage.timer = window.setTimeout(() => { toast.className = 'toast' }, 6000)
  }

  function bytesToBase64(bytes) {
    let binary = ''
    const chunk = 0x8000
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
    }
    return btoa(binary)
  }

  function base64ToBytes(value) {
    const binary = atob(value)
    return Uint8Array.from(binary, (char) => char.charCodeAt(0))
  }

  async function deriveKey(password, salt) {
    const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey'])
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    )
  }

  async function encryptSecret(secret, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const key = await deriveKey(password, salt)
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(secret))
    return JSON.stringify({
      version: 1,
      salt: bytesToBase64(salt),
      iv: bytesToBase64(iv),
      data: bytesToBase64(new Uint8Array(encrypted)),
    })
  }

  async function decryptSecret(vaultText, password) {
    const vault = JSON.parse(vaultText)
    if (vault.version !== 1 || !vault.salt || !vault.iv || !vault.data) throw new Error('Dados salvos inválidos.')
    const salt = base64ToBytes(vault.salt)
    const iv = base64ToBytes(vault.iv)
    const encrypted = base64ToBytes(vault.data)
    const key = await deriveKey(password, salt)
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
    return decoder.decode(decrypted)
  }

  function hasVault() {
    return Boolean(localStorage.getItem(VAULT_KEY))
  }

  function setMode() {
    const saved = hasVault()
    $('tokenGroup').hidden = saved
    $('confirmPasswordGroup').hidden = saved
    $('savedLoginNotice').hidden = !saved
    $('resetAccessButton').hidden = !saved
    $('token').required = !saved
    $('confirmPassword').required = !saved
    $('password').value = ''
    $('confirmPassword').value = ''
    $('token').value = ''

    if (saved) {
      $('loginTitle').textContent = 'Entre com a senha do painel.'
      $('loginDescription').textContent = 'O acesso está protegido neste navegador. Digite somente sua senha.'
      $('loginButton').textContent = 'Entrar no painel'
      $('password').autocomplete = 'current-password'
      window.setTimeout(() => $('password').focus(), 50)
    } else {
      $('loginTitle').textContent = 'Configure o acesso por senha.'
      $('loginDescription').textContent = 'No primeiro acesso, informe o token e crie uma senha. Depois, neste navegador, você usará somente a senha.'
      $('loginButton').textContent = 'Salvar acesso e entrar'
      $('password').autocomplete = 'new-password'
    }
  }

  async function prepareLogin(event) {
    const form = event.currentTarget
    if (form.dataset.passwordReady === 'true') {
      delete form.dataset.passwordReady
      return
    }

    event.preventDefault()
    event.stopImmediatePropagation()

    const button = $('loginButton')
    const password = $('password').value
    const saved = hasVault()

    if (password.length < 8) {
      showMessage('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    const previousText = button.textContent
    button.disabled = true
    button.textContent = saved ? 'Desbloqueando…' : 'Protegendo acesso…'

    try {
      let secret
      if (saved) {
        try {
          secret = await decryptSecret(localStorage.getItem(VAULT_KEY), password)
        } catch {
          throw new Error('Senha incorreta. Tente novamente.')
        }
      } else {
        secret = $('token').value.trim()
        if (!secret) throw new Error('Informe o token do GitHub.')
        if (password !== $('confirmPassword').value) throw new Error('As senhas não são iguais.')
        localStorage.setItem(VAULT_KEY, await encryptSecret(secret, password))
      }

      $('token').value = secret
      sessionStorage.setItem(TOKEN_KEY, secret)
      form.dataset.passwordReady = 'true'
      form.requestSubmit()
    } catch (error) {
      showMessage(error.message || 'Não foi possível entrar no painel.')
      button.disabled = false
      button.textContent = previousText
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!window.crypto?.subtle) {
      showMessage('Atualize o navegador para usar o acesso protegido.')
      return
    }

    $('loginForm').addEventListener('submit', prepareLogin, true)

    $('resetAccessButton').addEventListener('click', () => {
      if (!window.confirm('Esquecer a senha salva? Será necessário informar o token novamente.')) return
      localStorage.removeItem(VAULT_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
      setMode()
      showMessage('Acesso salvo removido. Crie uma nova senha.', 'success')
    })

    $('logoutButton').addEventListener('click', () => window.setTimeout(setMode, 0))
    setMode()
  })
})()
