import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AreaCard({ area }) {
  const Icon = area.icon
  return (
    <article className="area-card">
      <div className="area-card__icon">
        <Icon size={27} aria-hidden="true" />
      </div>
      <h3>{area.title}</h3>
      <p>{area.shortDescription}</p>
      <Link className="text-link" to={`/areas-de-atuacao/${area.slug}`}>
        Saiba mais <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </article>
  )
}
