import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85'

export default function ArticleCard({ article, compact = false }) {
  return (
    <article className={`article-card ${compact ? 'article-card--compact' : ''}`}>
      <Link className="article-card__image" to={`/artigos/${article.slug}`} tabIndex={-1} aria-hidden="true">
        <img
          src={article.cover_image_url || FALLBACK_IMAGE}
          alt=""
          loading="lazy"
          onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }}
        />
      </Link>
      <div className="article-card__body">
        <span className="category-badge">{article.categories?.name || 'Informações Gerais'}</span>
        <h3>
          <Link to={`/artigos/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.summary}</p>
        <div className="article-card__meta">
          <span><CalendarDays size={15} /> {formatDate(article.published_at, { month: 'short' })}</span>
          <span><Clock3 size={15} /> {article.reading_time || 3} min</span>
        </div>
        <Link className="text-link" to={`/artigos/${article.slug}`}>
          Continuar lendo <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  )
}
