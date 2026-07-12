import React, { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import './styles/premium.css'
import './styles/brand-logo.css'
import './styles/accessibility.css'

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
const staticRoot = document.getElementById('root')

if (!staticRoot) {
  throw new Error('Elemento #root não encontrado.')
}

const clientRoot = document.createElement('div')
let interfaceActivated = false

function activateClientInterface() {
  if (interfaceActivated) return
  interfaceActivated = true

  const scrollX = window.scrollX
  const scrollY = window.scrollY
  const activeElement = document.activeElement
  const focusDescriptor = activeElement && staticRoot.contains(activeElement)
    ? {
        id: activeElement.id,
        href: activeElement.getAttribute?.('href'),
        name: activeElement.getAttribute?.('name'),
      }
    : null

  clientRoot.id = 'root'
  clientRoot.dataset.reactReady = 'true'
  staticRoot.replaceWith(clientRoot)

  requestAnimationFrame(() => {
    window.scrollTo(scrollX, scrollY)

    if (!focusDescriptor) return
    const escapedId = focusDescriptor.id && CSS.escape(focusDescriptor.id)
    const escapedName = focusDescriptor.name && CSS.escape(focusDescriptor.name)
    const selector = escapedId
      ? `#${escapedId}`
      : focusDescriptor.href
        ? `a[href="${CSS.escape(focusDescriptor.href)}"]`
        : escapedName
          ? `[name="${escapedName}"]`
          : ''
    const replacement = selector ? clientRoot.querySelector(selector) : null
    replacement?.focus({ preventScroll: true })
  })
}

function ApplicationBootstrap() {
  useLayoutEffect(() => {
    activateClientInterface()
  }, [])

  return (
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  )
}

createRoot(clientRoot).render(
  <React.StrictMode>
    <ApplicationBootstrap />
  </React.StrictMode>,
)
