import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items = [] }) {
  if (!Array.isArray(items) || items.length < 2) return null

  return (
    <nav className="breadcrumbs" aria-label="Navegação estrutural">
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`}>
              {current || !item.to ? (
                <span aria-current={current ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
