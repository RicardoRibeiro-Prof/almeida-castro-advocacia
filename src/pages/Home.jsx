import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Quote,
  Scale,
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

const HERO_IMAGE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=88'
const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1500&q=88'

const differences = [
  'Atendimento personalizado e respeitoso',
  'Comunicação clara sobre procedimentos e documentos',
  'Análise responsável das circunstâncias apresentadas',
  'Atuação ética e alinhada às normas profissionais',
  'Acompanhamento próximo durante o atendimento',
]

const highlights = [
  { icon: MapPin, title: 'Atendimento local', text: 'São Raimundo Nonato e região' },
  { icon: MonitorSmartphone, title: 'Canais digitais', text: 'Contato organizado e acessível' },
  { icon: LockKeyhole, title: 'Sigilo profissional', text: 'Discrição em todas as etapas' },
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

      <section className="hero hero--premium">
        <div className="hero__pattern" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow eyebrow--light">Advocacia em São Raimundo Nonato – PI</span>
            <h1>Atuação jurídica ética, estratégica e próxima de você.</h1>
            <p>
              Orientação responsável para pessoas, famílias e empresas, com análise cuidadosa, linguagem clara e atenção às particularidades de cada situação.
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
              <span>Atendimento orientado por ética, discrição, clareza e responsabilidade profissional.</span>
            </div>
          </div>

          <div className="hero__visual hero__visual--photo">
            <img src={HERO_IMAGE} alt="Escritório moderno e acolhedor" />
            <div className="hero__visual-card">
              <Quote size={22} />
              <p>Informação clara para decisões jurídicas mais conscientes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="institutional-strip" aria-label="Diferenciais de atendimento">
        <div className="container institutional-strip__grid">
          {highlights.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span><Icon size={23} /></span>
              <div><strong>{title}</strong><small>{text}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section about-preview">
        <div className="container split-layout">
          <div className="image-frame image-frame--office image-frame--premium">
            <img src={ABOUT_IMAGE} alt="Sala de reunião contemporânea" loading="lazy" />
            <span className="image-frame__detail">Atendimento presencial e digital</span>
          </div>
          <div>
            <SectionHeading
              eyebrow="O Escritório"
              title="Seriedade jurídica com atendimento humano e organizado"
              description="A Almeida & Castro Advocacia atua com escuta cuidadosa, análise técnica e comunicação acessível, respeitando o contexto e as necessidades de cada atendimento."
            />
            <p>
              O trabalho começa pela compreensão dos fatos e pela conferência dos documentos. A partir dessa análise, as alternativas jurídicas são apresentadas com objetividade, sem promessas de resultado e com atenção aos riscos envolvidos.
            </p>
            <p>
              Nosso propósito é oferecer um atendimento profissional, discreto e próximo, mantendo o cliente informado sobre os procedimentos e as etapas relevantes.
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

      <section className="section section--soft areas-showcase">
        <div className="container">
          <SectionHeading
            eyebrow="Áreas de atuação"
            title="Orientação jurídica em diferentes momentos"
            description="Atuação consultiva, preventiva e contenciosa, sempre definida após a análise individual dos fatos, documentos e objetivos envolvidos."
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
          <div className="principles-card principles-card--premium">
            <Scale size={34} />
            <span className="principles-card__number">05</span>
            <h3>Princípios do atendimento</h3>
            <p>Escutar, analisar, explicar, orientar e acompanhar. Uma sequência que mantém o atendimento claro, responsável e transparente.</p>
            <Link className="text-link text-link--light" to="/contato">Solicitar informações <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="section team-showcase">
        <div className="container">
          <SectionHeading
            eyebrow="Equipe"
            title="Experiência, escuta e atuação integrada"
            description="Conheça os profissionais responsáveis pelo atendimento e as principais áreas de atuação do escritório."
            align="center"
          />
          <div className="team-grid team-grid--home">
            {teamMembers.map((member) => <TeamCard key={member.name} member={member} />)}
          </div>
          <div className="center-action"><Link className="button button--outline" to="/equipe">Conheça a equipe <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <section className="section section--soft articles-showcase">
        <div className="container">
          <SectionHeading
            eyebrow="Conteúdo jurídico"
            title="Informação para compreender seus direitos"
            description="Artigos produzidos em linguagem acessível sobre temas jurídicos do cotidiano. Os conteúdos são informativos e não substituem uma análise individualizada."
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

      <section className="cta-section cta-section--premium">
        <div className="container cta-section__inner">
          <div><span className="eyebrow eyebrow--light">Contato institucional</span><h2>Precisa de orientação sobre uma questão jurídica?</h2><p>Envie uma mensagem com uma breve descrição do tema para receber informações sobre o atendimento.</p></div>
          <a className="button button--gold" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Entrar em contato</a>
        </div>
      </section>
    </>
  )
}
