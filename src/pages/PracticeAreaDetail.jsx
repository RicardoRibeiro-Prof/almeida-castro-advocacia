import { ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import { practiceAreas } from '../data/practiceAreas'
import { getWhatsAppUrl } from '../utils/constants'
import NotFound from './NotFound'

export default function PracticeAreaDetail() {
  const { slug } = useParams()
  const area = practiceAreas.find((item) => item.slug === slug)

  if (!area) return <NotFound />

  const Icon = area.icon

  return (
    <>
      <Seo title={area.title} description={`${area.shortDescription} Atendimento institucional em São Raimundo Nonato, Piauí.`} />
      <PageHero
        eyebrow="Área de atuação"
        title={area.title}
        description={area.intro}
        breadcrumbs={[{ label: 'Áreas de Atuação', to: '/areas-de-atuacao' }, { label: area.title }]}
      />
      <section className="section">
        <div className="container area-detail-layout">
          <article className="area-detail-main">
            <div className="area-detail-intro"><span><Icon size={34} /></span><div><h2>Quando esta área pode ser necessária?</h2><p>Os exemplos abaixo são informativos e não substituem a avaliação dos documentos e circunstâncias concretas.</p></div></div>
            <ul className="situation-list">
              {area.situations.map((situation) => <li key={situation}><CheckCircle2 size={20} /> {situation}</li>)}
            </ul>

            <div className="content-section"><h2>Forma de atuação do escritório</h2><p>{area.approach}</p></div>

            <div className="content-section"><h2>Perguntas frequentes</h2><div className="faq-list">
              {area.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
            </div></div>

            <div className="informative-box"><strong>Aviso informativo</strong><p>O conteúdo desta página possui caráter geral. Prazos, documentos, requisitos e alternativas podem variar conforme o caso e a legislação aplicável.</p></div>
          </article>

          <aside className="area-detail-sidebar">
            <div className="contact-aside"><h2>Solicite informações</h2><p>Entre em contato para entender como funciona o atendimento inicial e quais documentos podem ser necessários.</p><a className="button button--gold" href={getWhatsAppUrl(`Olá! Acessei a página de ${area.title} e gostaria de solicitar mais informações.`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Falar pelo WhatsApp</a></div>
            <div className="areas-aside"><h2>Outras áreas</h2>{practiceAreas.filter((item) => item.slug !== area.slug).map((item) => <Link key={item.slug} to={`/areas-de-atuacao/${item.slug}`}>{item.title}</Link>)}</div>
          </aside>
        </div>
        <div className="container back-row"><Link className="text-link" to="/areas-de-atuacao"><ArrowLeft size={17} /> Voltar para todas as áreas</Link></div>
      </section>
    </>
  )
}
