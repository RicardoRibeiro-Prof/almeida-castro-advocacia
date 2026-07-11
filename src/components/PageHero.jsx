import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function PageHero({ eyebrow, title, description, breadcrumbs = [] }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <nav className="breadcrumbs" aria-label="Navegação estrutural">
          <Link to="/" aria-label="Página inicial">
            <Home size={15} />
          </Link>
          {breadcrumbs.map((item) => (
            <span key={`${item.label}-${item.to || 'current'}`}>
              <ChevronRight size={14} aria-hidden="true" />
              {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
            </span>
          ))}
        </nav>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  )
}
