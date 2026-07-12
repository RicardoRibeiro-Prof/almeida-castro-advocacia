import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import TeamCard from '../components/TeamCard'
import { teamMembers } from '../data/team'

export default function Team() {
  return (
    <>
      <Seo
        title="Equipe | Almeida & Castro Advocacia"
        description="Conheça a equipe demonstrativa da Almeida & Castro Advocacia e suas principais áreas de atuação jurídica."
        path="/equipe"
      />
      <PageHero
        eyebrow="Profissionais"
        title="Nossa Equipe"
        description="Atuação integrada, formação contínua e atendimento conduzido com ética, discrição e responsabilidade."
        breadcrumbs={[{ label: 'Equipe' }]}
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            title="Profissionais comprometidos com clareza e responsabilidade"
            description="A definição do profissional responsável considera a natureza da demanda, os documentos apresentados e as necessidades específicas do atendimento."
            align="center"
          />
          <div className="team-grid team-grid--detailed">
            {teamMembers.map((member) => <TeamCard key={member.name} member={member} detailed />)}
          </div>
          <p className="team-image-note" role="note">Os nomes, registros, formações e biografias são fictícios. As fotografias são meramente ilustrativas e não representam os profissionais descritos.</p>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container professional-note">
          <div><span className="eyebrow">Atuação integrada</span><h2>Análise jurídica com diferentes perspectivas</h2></div>
          <p>A organização interna permite que temas relacionados sejam avaliados com atenção às suas diferentes implicações. A definição do profissional responsável depende da natureza e das necessidades do atendimento.</p>
        </div>
      </section>
    </>
  )
}
