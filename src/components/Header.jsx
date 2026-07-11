import { ChevronDown, Menu, MessageCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { practiceAreas } from '../data/practiceAreas'
import { getWhatsAppUrl, SITE_SHORT_NAME } from '../utils/constants'

const navItems = [
  { label: 'Início', to: '/' },
  { label: 'O Escritório', to: '/sobre' },
  { label: 'Equipe', to: '/equipe' },
  { label: 'Artigos', to: '/artigos' },
  { label: 'Contato', to: '/contato' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [areasOpen, setAreasOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    setAreasOpen(false)
  }, [location.pathname])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" to="/" aria-label={`${SITE_SHORT_NAME} - página inicial`}>
          <span className="brand__mark">A<span>&</span>C</span>
          <span className="brand__text">
            <strong>Almeida & Castro</strong>
            <small>Advocacia</small>
          </span>
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav id="main-navigation" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Menu principal">
          <div className="main-nav__links">
            {navItems.slice(0, 2).map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}

            <div className={`nav-dropdown ${areasOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                onClick={() => setAreasOpen((value) => !value)}
                aria-expanded={areasOpen}
              >
                Áreas de Atuação <ChevronDown size={15} />
              </button>
              <div className="nav-dropdown__menu">
                <Link className="nav-dropdown__all" to="/areas-de-atuacao">Ver todas as áreas</Link>
                {practiceAreas.map((area) => (
                  <Link key={area.slug} to={`/areas-de-atuacao/${area.slug}`}>
                    {area.title}
                  </Link>
                ))}
              </div>
            </div>

            {navItems.slice(2).map((item) => (
              <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
            ))}
          </div>
          <a className="button button--gold button--small header-cta" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} /> Fale conosco
          </a>
        </nav>
      </div>
    </header>
  )
}
