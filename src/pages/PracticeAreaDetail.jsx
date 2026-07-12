import { ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import SITE, { buildCanonicalUrl } from '../config/site'
import { practiceAreas } from '../data/practiceAreas'
import { getWhatsAppUrl } from '../utils/constants'
import NotFound from './NotFound'

const seoBySlug = {
  'direito-civil': {
    title: 'Advogado Civil em São Raimundo Nonato | Almeida & Castro',
    description: 'Orientação em contratos, obrigações, responsabilidade civil e questões patrimoniais em São Raimundo Nonato e região.',
  },
  'direito-previdenciario': {
    title: 'Advogado Previdenciário em São Raimundo Nonato | Almeida & Castro',
    description: 'Informações sobre benefícios do INSS, histórico contributivo e planejamento previdenciário em São Raimundo Nonato.',
  },
  'direito-trabalhista': {
    title: 'Advogado Trabalhista em São Raimundo Nonato | Almeida & Castro',
    description: 'Orientação sobre direitos, deveres, jornada e encerramento das relações de trabalho em São Raimundo Nonato.',
  },
  'direito-de-familia': {
    title: 'Advogado de Família em São Raimundo Nonato | Almeida & Castro',
    description: 'Atendimento informativo em divórcio, guarda, alimentos, união estável e partilha de bens em São Raimundo Nonato.',
  },
  'direito-do-consumidor': {
    title: 'Advogado do Consumidor em São Raimundo Nonato | Almeida & Castro',
    description: 'Orientação sobre compras, cobranças, contratos, produtos e prestação de serviços em São Raimundo Nonato e região.',
  },
  'direito-empresarial': {
    title: 'Advocacia Empresarial em São Raimundo Nonato | Almeida & Castro',
    description: 'Apoio jurídico preventivo em contratos, relações societárias e operações empresariais em São Raimundo Nonato.',
  },
}

export default function PracticeAreaDetail() {
  const { slug } = useParams()
  const area = practiceAreas.find((item) => item.slug === slug)

  if (!area) return <NotFound />

  const Icon = area.icon
  const routePath = `/areas-de-atuacao/${area.slug}`
  const seo = seoBySlug[area.slug] || {
    title: `${area.title} | ${SITE.name}`,
    description: `${area.shortDescription} Atendimento institucional em ${SITE.city}, ${SITE.stateName}.`,
  }
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: buildCanonicalUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Áreas de Atuação', item: buildCanonicalUrl('/areas-de-atuacao') },
      { '@type': 'ListItem', position: 3, name: area.title, item: buildCanonicalUrl(routePath) },
    ],
  }

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={routePath}
        structuredData={structuredData}
      />
      <PageHero
        eyebrow="Área de atuação"
        title={area.title}
        description={area.intro}
        breadcrumbs={[{ label: 'Áreas de Atuação', to: '/areas-de-atuacao' }, { label: area.title }]}
      />
      <section className="section">
        <div className="container area-detail-layout">
          <article className="area-detail-main">
            <div className="area-detail-intro"><span><Icon size={34} aria-hidden="true" /></span><div><h2>Quando esta área pode ser necessária?</h2><p>Os exemplos abaixo são informativos e não substituem a avaliação dos documentos e circunstâncias concretas.</p></div></div>
            <ul className="situation-list">
              {area.situations.map((situation) => <li key={situation}><CheckCircle2 size={20} aria-hidden="true" /> {situation}</li>)}
            </ul>

            <div className="content-section"><h2>Forma de atuação do escritório</h2><p>{area.approach}</p><p>O atendimento pode ser realizado para pessoas de São Raimundo Nonato e região, conforme a natureza da demanda e a documentação disponível.</p></div>

            <div className="content-section"><h2>Perguntas frequentes</h2><div className="faq-list">
              {area.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
            </div></div>

            <div className="informative-box"><strong>Aviso informativo</strong><p>O conteúdo desta página possui caráter geral. Prazos, documentos, requisitos e alternativas podem variar conforme o caso e a legislação aplicável.</p></div>
          </article>

          <aside className="area-detail-sidebar" aria-label="Contato e outras áreas de atuação">
            <div className="contact-aside"><h2>Solicite informações</h2><p>Entre em contato para entender como funciona o atendimento inicial e quais documentos podem ser necessários.</p><a className="button button--gold" href={getWhatsAppUrl(`Olá! Acessei a página de ${area.title} e gostaria de solicitar mais informações.`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> Falar pelo WhatsApp</a></div>
            <div className="areas-aside"><h2>Outras áreas</h2>{practiceAreas.filter((item) => item.slug !== area.slug).map((item) => <Link key={item.slug} to={`/areas-de-atuacao/${item.slug}`}>{item.title}</Link>)}</div>
          </aside>
        </div>
        <div className="container back-row"><Link className="text-link" to="/areas-de-atuacao"><ArrowLeft size={17} aria-hidden="true" /> Voltar para todas as áreas</Link></div>
      </section>
    </>
  )
}
