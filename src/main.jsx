import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import './styles/premium.css'
import './styles/brand-logo.css'
import './styles/accessibility.css'

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
const rootElement = document.getElementById('root')

if (rootElement.hasChildNodes()) rootElement.replaceChildren()

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
