import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import SITE from '../config/site'
import { CONTACT_INFO } from '../utils/constants'

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Política de Privacidade | Almeida & Castro Advocacia"
        description="Saiba como este site demonstrativo prepara mensagens para o WhatsApp sem manter banco de dados próprio para o formulário."
        path="/politica-de-privacidade"
      />
      <PageHero eyebrow="Privacidade" title="Política de Privacidade" description="Informações gerais sobre o tratamento de dados neste site demonstrativo." breadcrumbs={[{ label: 'Política de Privacidade' }]} />
      <section className="section">
        <article className="container legal-content">
          <p><strong>Última atualização:</strong> <time dateTime="2026-07-12">12 de julho de 2026</time>.</p>
          {SITE.isDemo && <p className="informative-box"><strong>Aviso:</strong> este projeto utiliza dados fictícios e esta política deverá ser revisada antes da publicação por um escritório real.</p>}
          <h2>1. Finalidade desta política</h2><p>Esta política explica, de forma geral, como as informações são tratadas durante a navegação e o contato. O site não mantém banco de dados próprio para os dados preenchidos no formulário de contato.</p>
          <h2>2. Dados informados pelo visitante</h2><p>O formulário pode receber nome, telefone, assunto e uma breve mensagem. Esses dados são utilizados somente para preparar o texto que será aberto no WhatsApp. Não envie documentos, senhas, dados bancários ou informações sensíveis.</p>
          <h2>3. Envio pelo WhatsApp</h2><p>O visitante revisa a mensagem antes do envio. Ao prosseguir, o tratamento das informações também passa a seguir os termos e as políticas do WhatsApp.</p>
          <h2>4. Serviços de terceiros</h2><p>A hospedagem e outros serviços técnicos podem registrar informações necessárias para segurança e funcionamento, como endereço IP, navegador, horário de acesso e páginas visitadas.</p>
          <h2>5. Cookies e armazenamento local</h2><p>O site público não utiliza cookies próprios de publicidade. O painel administrativo utiliza armazenamento local apenas no navegador autorizado, conforme sua configuração de acesso.</p>
          <h2>6. Segurança</h2><p>São adotadas práticas como conexão HTTPS, ausência de credenciais no código público, sanitização do conteúdo dos artigos e permissões restritas no painel administrativo.</p>
          <h2>7. Direitos e contato</h2><p>Em uma publicação real, solicitações relacionadas a dados pessoais deverão ser tratadas pelo responsável informado pelo escritório. Neste projeto demonstrativo, o e-mail exibido é fictício: <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>.</p>
        </article>
      </section>
    </>
  )
}
