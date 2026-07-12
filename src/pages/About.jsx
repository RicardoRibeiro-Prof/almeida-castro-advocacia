import { Check, Compass, Eye, HeartHandshake, Scale } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'

const ABOUT_IMAGE = `${import.meta.env.BASE_URL}images/hero-office.svg`

const timeline = [
  { year: '2018', title: 'Início da atuação', text: 'Formação de uma proposta de atendimento jurídico próximo, ético e organizado.' },
  { year: '2020', title: 'Atuação integrada', text: 'Ampliação do atendimento em questões cíveis, previdenciárias, trabalhistas e familiares.' },
  { year: '2023', title: 'Canais digitais', text: 'Adoção de ferramentas para facilitar a comunicação, o agendamento e o acesso à informação.' },
  { year: 'Hoje', title: 'Evolução contínua', text: 'Aperfeiçoamento constante da estrutura, do atendimento e da produção de conteúdo jurídico.' },
]

export default function About() {
  return (
    <>
      <Seo
        title="Sobre o Escritório | Almeida & Castro Advocacia"
        description="Conheça a proposta institucional, os valores e a forma de atendimento da Almeida & Castro Advocacia em São Raimundo Nonato."
        path="/sobre"
      />
      <PageHero
        eyebrow="Institucional"
        title="O Escritório"
        description="Atuação jurídica organizada, responsável e próxima da realidade de cada pessoa atendida."
        breadcrumbs={[{ label: 'O Escritório' }]}
      />

      <section className="section">
        <div className="container split-layout split-layout--reverse-mobile">
          <div>
            <SectionHeading eyebrow="Nossa essência" title="Seriedade jurídica com comunicação acessível" />
            <p>A Almeida & Castro Advocacia foi estruturada para oferecer atendimento jurídico com organização, escuta e clareza. O escritório está sediado em São Raimundo Nonato, Piauí, e utiliza também canais digitais para facilitar a comunicação com o público.</p>
            <p>Cada atendimento começa com a compreensão dos fatos e a conferência dos documentos relevantes. As possibilidades são explicadas de maneira responsável, considerando riscos, procedimentos e particularidades da situação apresentada.</p>
            <p>O compromisso institucional é manter uma atuação ética, discreta e tecnicamente cuidadosa, com comunicação clara durante todas as etapas do trabalho.</p>
          </div>
          <div className="image-frame image-frame--tall image-frame--premium">
            <img src={ABOUT_IMAGE} alt="Ambiente jurídico moderno em madeira, azul-marinho e detalhes dourados" width="800" height="600" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading eyebrow="Direcionamento" title="Missão, visão e valores" align="center" />
          <div className="mission-grid">
            <article><span><Compass aria-hidden="true" /></span><h2>Missão</h2><p>Prestar orientação jurídica responsável, com atendimento próximo, linguagem clara e respeito às normas profissionais.</p></article>
            <article><span><Eye aria-hidden="true" /></span><h2>Visão</h2><p>Consolidar uma presença jurídica reconhecida pela organização, confiança institucional e qualidade da comunicação.</p></article>
            <article><span><HeartHandshake aria-hidden="true" /></span><h2>Valores</h2><p>Ética, respeito, discrição, clareza, responsabilidade, atualização e atenção às particularidades de cada demanda.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container service-method-grid">
          <div className="service-method-card"><Scale size={42} aria-hidden="true" /><span className="eyebrow">Forma de atendimento</span><h2>Um processo simples, claro e organizado</h2><p>O primeiro contato tem finalidade informativa e de organização. A orientação jurídica depende da compreensão dos fatos e da análise dos documentos relevantes.</p></div>
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
          <SectionHeading eyebrow="Trajetória" title="Uma estrutura em constante evolução" description="A organização do escritório acompanha as mudanças na comunicação e nas necessidades de quem busca orientação jurídica." align="center" />
          <div className="timeline">
            {timeline.map((item) => <article key={item.year}><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}
          </div>
          <p className="demo-note"><Check size={17} aria-hidden="true" /> Atendimento pautado por ética, responsabilidade e respeito às normas profissionais.</p>
        </div>
      </section>
    </>
  )
}
