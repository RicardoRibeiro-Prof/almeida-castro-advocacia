import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHero from '../components/PageHero'
import Pagination from '../components/Pagination'
import Seo from '../components/Seo'
import { getPublishedArticles } from '../services/articleService'
import { getCategories } from '../services/categoryService'
import { stripHtml } from '../utils/format'

const PER_PAGE = 6

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getPublishedArticles(), getCategories()])
      .then(([articleData, categoryData]) => {
        setArticles(articleData)
        setCategories(categoryData)
      })
      .catch(() => setError('Não foi possível carregar os artigos. Tente novamente mais tarde.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return articles.filter((article) => {
      const matchesCategory = category === 'all' || article.categories?.slug === category
      const searchable = `${article.title} ${article.summary} ${stripHtml(article.content)}`.toLowerCase()
      return matchesCategory && (!query || searchable.includes(query))
    })
  }, [articles, search, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  function updateSearch(value) {
    setSearch(value)
    setCurrentPage(1)
  }

  function updateCategory(value) {
    setCategory(value)
    setCurrentPage(1)
  }

  return (
    <>
      <Seo
        title="Artigos Jurídicos | Almeida & Castro Advocacia"
        description="Conteúdos informativos sobre Direito Civil, Previdenciário, Trabalhista, de Família, do Consumidor e Empresarial."
        path="/artigos"
      />
      <PageHero
        eyebrow="Conteúdo informativo"
        title="Artigos e informações jurídicas"
        description="Conteúdos gerais para tornar temas jurídicos mais compreensíveis. As publicações não substituem orientação individualizada."
        breadcrumbs={[{ label: 'Artigos' }]}
      />
      <section className="section" aria-labelledby="articles-filter-title">
        <div className="container">
          <h2 id="articles-filter-title" className="sr-only">Pesquisar e filtrar artigos</h2>
          <div className="article-filters">
            <label className="search-field" htmlFor="article-search">
              <span className="sr-only">Buscar por título ou conteúdo</span>
              <Search size={19} aria-hidden="true" />
              <input
                id="article-search"
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por título ou conteúdo..."
                maxLength="100"
                autoComplete="off"
              />
            </label>
            <label htmlFor="article-category">
              <span className="sr-only">Filtrar por categoria</span>
              <select id="article-category" value={category} onChange={(event) => updateCategory(event.target.value)}>
                <option value="all">Todas as categorias</option>
                {categories.map((item) => <option key={item.id || item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </label>
          </div>

          {loading ? (
            <LoadingSpinner label="Carregando publicações..." />
          ) : error ? (
            <p className="status-message status-message--error" role="alert">{error}</p>
          ) : paginated.length ? (
            <>
              <p className="results-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}</p>
              <div className="article-grid article-grid--archive">
                {paginated.map((article) => <ArticleCard key={article.id} article={article} />)}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          ) : (
            <EmptyState title="Nenhum artigo encontrado" description="Altere a busca ou selecione outra categoria para visualizar mais conteúdos." />
          )}
        </div>
      </section>
    </>
  )
}
