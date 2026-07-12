import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PageHero({ eyebrow, title, description, breadcrumbs = [] }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <nav className="breadcrumbs" aria-label="Navegação estrutural">
          <ol>
            <li>
              <Link to="/" aria-label="Página inicial">
                <Home size={15} aria-hidden="true" />
                <span className="sr-only">Início</span>
              </Link>
            </li>
            {breadcrumbs.map((item, index) => {
              const current = !item.to || index === breadcrumbs.length - 1
              return (
                <li key={`${item.label}-${item.to || 'current'}`}>
                  <ChevronRight size={14} aria-hidden="true" />
                  {current ? <span aria-current="page">{item.label}</span> : <Link to={item.to}>{item.label}</Link>}
                </li>
              )
            })}
          </ol>
        </nav>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  )
}
