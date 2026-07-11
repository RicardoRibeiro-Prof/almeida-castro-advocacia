import { Check, Compass, Eye, HeartHandshake, Scale } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'

const timeline = [
  { year: '2018', title: 'Início do projeto', text: 'Estruturação de uma proposta de atendimento jurídico próximo e organizado.' },
  { year: '2020', title: 'Ampliação das áreas', text: 'Integração de atendimentos cíveis, previdenciários, trabalhistas e familiares.' },
  { year: '2023', title: 'Atendimento digital', text: 'Adoção de canais digitais para comunicação, agendamento e conteúdo informativo.' },
  { year: 'Hoje', title: 'Presença institucional', text: 'Atuação orientada por clareza, ética e aperfeiçoamento contínuo.' },
]

export default function About() {
  return (
    <>
      <Seo title="O Escritório" description="Conheça a história, os valores e a forma de atendimento da Almeida & Castro Advocacia em São Raimundo Nonato." />
      <PageHero
        eyebrow="Institucional"
        title="O Escritório"
        description="Uma proposta de atuação jurídica organizada, responsável e próxima da realidade de cada pessoa atendida."
        breadcrumbs={[{ label: 'O Escritório' }]}
      />

      <section className="section">
        <div className="container split-layout split-layout--reverse-mobile">
          <div>
            <SectionHeading eyebrow="Nossa história" title="Seriedade jurídica com comunicação acessível" />
            <p>A Almeida & Castro Advocacia é um escritório fictício sediado em São Raimundo Nonato, Piauí, desenvolvido para demonstrar uma presença digital profissional e adequada às normas de publicidade da advocacia.</p>
            <p>O projeto representa um escritório que valoriza a escuta cuidadosa, a análise documental e a explicação clara de procedimentos. A atuação é conduzida sem promessas de resultado e com respeito às particularidades de cada situação.</p>
            <p>Nosso propósito institucional é oferecer um ambiente de atendimento acolhedor, organizado e tecnicamente responsável.</p>
          </div>
          <div className="image-frame image-frame--tall"><img src="/images/about-office.jpg" alt="Ambiente interno do escritório Almeida & Castro" /></div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading eyebrow="Direcionamento" title="Missão, visão e valores" align="center" />
          <div className="mission-grid">
            <article><span><Compass /></span><h3>Missão</h3><p>Prestar orientação jurídica responsável, com atendimento próximo, linguagem clara e respeito às normas profissionais.</p></article>
            <article><span><Eye /></span><h3>Visão</h3><p>Ser reconhecido localmente pela organização, pela confiança institucional e pela qualidade da comunicação com o público.</p></article>
            <article><span><HeartHandshake /></span><h3>Valores</h3><p>Ética, respeito, discrição, clareza, responsabilidade, atualização e atenção às particularidades de cada demanda.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container service-method-grid">
          <div className="service-method-card"><Scale size={42} /><span className="eyebrow">Forma de atendimento</span><h2>Um processo simples, claro e organizado</h2><p>O primeiro contato tem finalidade informativa e de organização. A orientação jurídica depende da compreensão dos fatos e da análise dos documentos relevantes.</p></div>
          <ol className="service-steps">
            <li><span>01</span><div><h3>Contato inicial</h3><p>Identificação do tema e orientação sobre agendamento e documentos.</p></div></li>
            <li><span>02</span><div><h3>Escuta e análise</h3><p>Compreensão dos fatos e conferência das informações apresentadas.</p></div></li>
            <li><span>03</span><div><h3>Explicação das alternativas</h3><p>Apresentação clara dos possíveis caminhos e dos cuidados envolvidos.</p></div></li>
            <li><span>04</span><div><h3>Acompanhamento</h3><p>Comunicação organizada durante as etapas do trabalho contratado.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section section--navy timeline-section">
        <div className="container">
          <SectionHeading eyebrow="Trajetória demonstrativa" title="Linha do tempo" description="Datas e informações fictícias criadas apenas para apresentação do projeto." align="center" />
          <div className="timeline">
            {timeline.map((item) => <article key={item.year}><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}
          </div>
          <p className="demo-note"><Check size={17} /> Todo o conteúdo desta página é fictício e deve ser adaptado antes da publicação para um escritório real.</p>
        </div>
      </section>
    </>
  )
}
