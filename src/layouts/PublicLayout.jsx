import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import WhatsAppButton from '../components/WhatsAppButton'
import SITE from '../config/site'

export default function PublicLayout() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Pular para o conteúdo principal</a>
      {SITE.isDemo && (
        <div className="demo-banner" role="note">
          Projeto demonstrativo: escritório, profissionais e dados de contato são fictícios.
        </div>
      )}
      <Header />
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
