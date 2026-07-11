import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import { CONTACT_INFO } from '../utils/constants'

export default function PrivacyPolicy() {
  return (
    <>
      <Seo title="Política de Privacidade" description="Política de privacidade e tratamento de dados do site Almeida & Castro Advocacia." />
      <PageHero eyebrow="Privacidade" title="Política de Privacidade" description="Informações gerais sobre o tratamento de dados neste site demonstrativo." breadcrumbs={[{ label: 'Política de Privacidade' }]} />
      <section className="section">
        <article className="container legal-content">
          <p><strong>Última atualização:</strong> 11 de julho de 2026.</p>
          <h2>1. Finalidade desta política</h2><p>Esta política explica, de forma geral, como informações podem ser tratadas durante a navegação e o contato com o escritório. Este projeto utiliza dados fictícios e deve ser revisado antes da publicação por um escritório real.</p>
          <h2>2. Dados fornecidos pelo visitante</h2><p>Ao utilizar os canais de contato, o visitante pode informar nome, telefone, e-mail e uma breve descrição do assunto. Recomenda-se não enviar documentos, senhas, dados bancários ou informações sensíveis por formulários públicos.</p>
          <h2>3. Finalidades do tratamento</h2><p>As informações podem ser usadas para responder ao contato, organizar o atendimento inicial, cumprir obrigações legais e proteger a segurança dos canais digitais.</p>
          <h2>4. Serviços de terceiros</h2><p>O site pode utilizar serviços de hospedagem, banco de dados, mapas e WhatsApp. Cada serviço possui políticas e condições próprias.</p>
          <h2>5. Cookies e registros técnicos</h2><p>A infraestrutura de hospedagem pode registrar dados técnicos, como endereço IP, navegador, horário de acesso e páginas visitadas, para segurança e funcionamento.</p>
          <h2>6. Segurança</h2><p>São adotadas medidas técnicas compatíveis com o projeto, incluindo autenticação administrativa, políticas de acesso no banco de dados e uso de conexão segura.</p>
          <h2>7. Direitos do titular</h2><p>O titular pode solicitar informações, correção ou exclusão de dados quando aplicável, observadas as obrigações legais de conservação.</p>
          <h2>8. Contato</h2><p>Dúvidas sobre esta política podem ser enviadas para <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>.</p>
        </article>
      </section>
    </>
  )
}
