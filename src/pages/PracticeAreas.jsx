import AreaCard from '../components/AreaCard'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import { practiceAreas } from '../data/practiceAreas'

export default function PracticeAreas() {
  return (
    <>
      <Seo
        title="Áreas de Atuação | Almeida & Castro Advocacia"
        description="Conheça as áreas jurídicas atendidas pela Almeida & Castro Advocacia, com orientação informativa e responsável."
        path="/areas-de-atuacao"
      />
      <PageHero
        eyebrow="Atuação jurídica"
        title="Áreas de Atuação"
        description="Informações gerais sobre os temas atendidos. A definição da medida adequada depende da análise individual de cada situação."
        breadcrumbs={[{ label: 'Áreas de Atuação' }]}
      />
      <section className="section">
        <div className="container">
          <SectionHeading title="Conheça as áreas atendidas pelo escritório" description="Selecione uma área para entender situações frequentes, forma de atuação e perguntas comuns." align="center" />
          <div className="area-grid area-grid--large">
            {practiceAreas.map((area) => <AreaCard key={area.slug} area={area} />)}
          </div>
          <div className="informative-box">
            <strong>Importante</strong>
            <p>As informações apresentadas neste site são gerais e educativas. Nenhuma página representa análise de caso, recomendação individual ou promessa de resultado.</p>
          </div>
        </div>
      </section>
    </>
  )
}
