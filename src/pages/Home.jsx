import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Quote,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AreaCard from '../components/AreaCard'
import ArticleCard from '../components/ArticleCard'
import ContactSection from '../components/ContactSection'
import LoadingSpinner from '../components/LoadingSpinner'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import TeamCard from '../components/TeamCard'
import { institutionalValues, practiceAreas } from '../data/practiceAreas'
import { teamMembers } from '../data/team'
import { getRecentPublishedArticles } from '../services/articleService'
import { getWhatsAppUrl } from '../utils/constants'

const differences = [
  'Atendimento personalizado e respeitoso',
  'Comunicação clara sobre procedimentos e documentos',
  'Análise responsável das circunstâncias apresentadas',
  'Atuação ética e alinhada às normas profissionais',
  'Acompanhamento próximo durante o atendimento',
]

export default function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getRecentPublishedArticles(3)
      .then(setArticles)
      .catch(() => setError('Não foi possível carregar os artigos neste momento.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Seo
        title="Advocacia em São Raimundo Nonato"
        description="Almeida & Castro Advocacia: atendimento jurídico institucional, ético e próximo em São Raimundo Nonato, Piauí."
      />

      <section className="hero">
        <div className="hero__pattern" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow eyebrow--light">Almeida & Castro Advocacia</span>
            <h1>Assessoria jurídica com seriedade, ética e atendimento próximo.</h1>
            <p>
              Orientação jurídica responsável para pessoas, famílias e empresas em São Raimundo Nonato e região, com comunicação clara e atenção às particularidades de cada demanda.
            </p>
            <div className="hero__actions">
              <Link className="button button--gold" to="/areas-de-atuacao">
                Conheça nossas áreas <ArrowRight size={18} />
              </Link>
              <a className="button button--light-outline" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} /> Fale pelo WhatsApp
              </a>
            </div>
            <div className="hero__trust">
              <ShieldCheck size={22} />
              <span>Atuação institucional orientada por ética, clareza e responsabilidade.</span>
            </div>
          </div>
          <div className="hero__visual">
            <img src="/images/hero-office.jpg" alt="Ambiente profissional de escritório de advocacia" />
            <div className="hero__visual-card">
              <Quote size={22} />
              <p>Informação clara para decisões jurídicas mais conscientes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-preview">
        <div className="container split-layout">
          <div className="image-frame image-frame--office">
            <img src="/images/about-office.jpg" alt="Sala de reunião do escritório Almeida & Castro" loading="lazy" />
            <span className="image-frame__detail">Atendimento em São Raimundo Nonato – PI</span>
          </div>
          <div>
            <SectionHeading
              eyebrow="O Escritório"
              title="Atuação jurídica com organização, escuta e responsabilidade"
              description="A Almeida & Castro Advocacia é um escritório fictício criado para demonstrar uma presença digital institucional, moderna e adequada à advocacia."
            />
            <p>
              Nosso atendimento parte da compreensão dos fatos, da conferência dos documentos e da explicação cuidadosa das alternativas jurídicas. Cada demanda é tratada com discrição, respeito e observância às normas profissionais.
            </p>
            <div className="value-mini-grid">
              {institutionalValues.slice(0, 2).map(({ title, description, icon: Icon }) => (
                <div key={title}><Icon size={22} /><div><strong>{title}</strong><span>{description}</span></div></div>
              ))}
            </div>
            <Link className="button button--primary" to="/sobre">Conheça o escritório <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="Áreas de atuação"
            title="Orientação jurídica em diferentes momentos"
            description="Conheça algumas das áreas atendidas pelo escritório. A definição da atuação adequada depende da análise individual dos fatos e documentos."
            align="center"
          />
          <div className="area-grid">
            {practiceAreas.map((area) => <AreaCard key={area.slug} area={area} />)}
          </div>
          <div className="center-action"><Link className="button button--outline" to="/areas-de-atuacao">Ver todas as áreas <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <section className="section differences-section">
        <div className="container differences-grid">
          <div>
            <SectionHeading
              eyebrow="Forma de atendimento"
              title="Proximidade sem perder a objetividade técnica"
              description="O atendimento jurídico deve ser compreensível, organizado e adequado à realidade de quem busca orientação."
            />
            <ul className="check-list">
              {differences.map((item) => <li key={item}><CheckCircle2 size={20} /> {item}</li>)}
            </ul>
          </div>
          <div className="principles-card">
            <span className="principles-card__number">05</span>
            <h3>Princípios do atendimento</h3>
            <p>Escutar, analisar, explicar, orientar e acompanhar. Uma sequência simples que ajuda a manter o atendimento claro e responsável.</p>
            <Link className="text-link text-link--light" to="/contato">Solicitar informações <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Equipe"
            title="Profissionais apresentados de forma transparente"
            description="Perfis fictícios utilizados exclusivamente para demonstração deste projeto de portfólio."
            align="center"
          />
          <div className="team-grid team-grid--home">
            {teamMembers.map((member) => <TeamCard key={member.name} member={member} />)}
          </div>
          <div className="center-action"><Link className="button button--outline" to="/equipe">Conheça a equipe <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="Conteúdo jurídico"
            title="Artigos recentes"
            description="Informações gerais para ajudar o público a compreender temas jurídicos. Os conteúdos não substituem uma análise individualizada."
            align="center"
          />
          {loading ? (
            <LoadingSpinner label="Carregando artigos..." />
          ) : error ? (
            <p className="status-message status-message--error">{error}</p>
          ) : (
            <div className="article-grid">
              {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>
          )}
          <div className="center-action"><Link className="button button--primary" to="/artigos">Ver todos os artigos <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <ContactSection />

      <section className="cta-section">
        <div className="container cta-section__inner">
          <div><span className="eyebrow eyebrow--light">Contato institucional</span><h2>Precisa de informações sobre atendimento jurídico?</h2><p>Envie uma mensagem e informe, de forma resumida, qual tema deseja esclarecer.</p></div>
          <a className="button button--gold" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Entrar em contato</a>
        </div>
      </section>
    </>
  )
}
