import { ArrowLeft, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <section className="not-found">
      <Seo
        title="Página não encontrada | Almeida & Castro Advocacia"
        description="A página solicitada não foi encontrada."
        path="/404"
        noIndex
      />
      <SearchX size={58} aria-hidden="true" />
      <span>Erro 404</span>
      <h1>Página não encontrada</h1>
      <p>O endereço pode ter sido digitado incorretamente ou o conteúdo não está mais disponível.</p>
      <div className="not-found__actions">
        <Link className="button button--primary" to="/"><ArrowLeft size={18} aria-hidden="true" /> Voltar para o início</Link>
        <Link className="button button--outline" to="/areas-de-atuacao">Áreas de atuação</Link>
        <Link className="text-link" to="/contato">Entrar em contato</Link>
      </div>
    </section>
  )
}
