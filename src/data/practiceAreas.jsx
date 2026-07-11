import {
  BriefcaseBusiness,
  Building2,
  FileText,
  HeartHandshake,
  Landmark,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react'

export const practiceAreas = [
  {
    slug: 'direito-civil',
    title: 'Direito Civil',
    shortDescription:
      'Orientação em relações contratuais, obrigações, responsabilidade civil e questões patrimoniais.',
    icon: Scale,
    intro:
      'O Direito Civil está presente em diversas relações do cotidiano, desde contratos e cobranças até conflitos relacionados a bens, obrigações e reparação de danos.',
    situations: [
      'Elaboração, análise ou revisão de contratos',
      'Cobranças e cumprimento de obrigações',
      'Responsabilidade civil e pedidos de reparação',
      'Questões relacionadas a posse e propriedade',
      'Negociações e prevenção de conflitos',
    ],
    approach:
      'O escritório realiza análise documental e jurídica individualizada, explica as alternativas disponíveis e conduz a atuação de maneira técnica, responsável e compatível com as circunstâncias de cada caso.',
    faqs: [
      {
        question: 'Todo conflito civil precisa chegar ao Judiciário?',
        answer:
          'Não. Dependendo da situação, podem existir caminhos de negociação, mediação ou formalização extrajudicial. A escolha depende dos documentos, dos riscos e dos objetivos envolvidos.',
      },
      {
        question: 'Por que revisar um contrato antes da assinatura?',
        answer:
          'A revisão pode ajudar a identificar obrigações, prazos, multas, garantias e pontos que precisam ser esclarecidos antes de assumir um compromisso.',
      },
    ],
  },
  {
    slug: 'direito-previdenciario',
    title: 'Direito Previdenciário',
    shortDescription:
      'Análise de benefícios, histórico contributivo e planejamento previdenciário de forma responsável.',
    icon: Landmark,
    intro:
      'O Direito Previdenciário envolve benefícios e obrigações relacionados ao INSS, considerando contribuições, qualidade de segurado, carência e requisitos previstos na legislação.',
    situations: [
      'Análise de aposentadorias e benefícios',
      'Benefício por incapacidade temporária ou permanente',
      'Pensão por morte e benefícios para dependentes',
      'Revisão do histórico contributivo',
      'Planejamento previdenciário',
    ],
    approach:
      'A atuação começa pela conferência de documentos, vínculos e contribuições. Após essa análise, o cliente recebe uma explicação clara sobre requisitos, pendências e possíveis providências administrativas ou judiciais.',
    faqs: [
      {
        question: 'Planejamento previdenciário garante aposentadoria?',
        answer:
          'Não. O planejamento organiza informações e projeta cenários com base nas regras vigentes, mas não representa garantia de concessão ou de valor futuro.',
      },
      {
        question: 'É importante conferir o CNIS?',
        answer:
          'Sim. O cadastro pode conter vínculos, remunerações ou contribuições que precisam de correção ou comprovação antes de um requerimento.',
      },
    ],
  },
  {
    slug: 'direito-trabalhista',
    title: 'Direito Trabalhista',
    shortDescription:
      'Orientação para trabalhadores e empregadores sobre direitos, deveres e relações de trabalho.',
    icon: BriefcaseBusiness,
    intro:
      'As relações de trabalho envolvem direitos e deveres de empregados e empregadores, além de documentos, jornadas, verbas e procedimentos que devem ser avaliados com atenção.',
    situations: [
      'Dúvidas sobre rescisão e verbas trabalhistas',
      'Jornada, horas extras e intervalos',
      'Análise de vínculo de emprego',
      'Orientação preventiva para empresas',
      'Acompanhamento de reclamações trabalhistas',
    ],
    approach:
      'O escritório examina documentos e fatos, esclarece os direitos e deveres aplicáveis e define a estratégia adequada, sempre sem antecipar conclusões antes da análise completa.',
    faqs: [
      {
        question: 'Quais documentos ajudam na análise trabalhista?',
        answer:
          'Carteira de trabalho, contrato, recibos, comprovantes de pagamento, mensagens, controles de jornada e documentos de rescisão podem ser relevantes.',
      },
      {
        question: 'Empresas também podem buscar orientação preventiva?',
        answer:
          'Sim. A orientação preventiva pode contribuir para organizar documentos, rotinas e procedimentos internos de acordo com a legislação.',
      },
    ],
  },
  {
    slug: 'direito-de-familia',
    title: 'Direito de Família',
    shortDescription:
      'Atendimento cuidadoso em divórcio, guarda, alimentos, união estável e outras relações familiares.',
    icon: HeartHandshake,
    intro:
      'Questões familiares exigem atenção técnica, escuta e discrição, pois normalmente envolvem vínculos pessoais, patrimônio e interesses de crianças ou dependentes.',
    situations: [
      'Divórcio consensual ou litigioso',
      'Guarda e convivência familiar',
      'Pensão alimentícia',
      'Reconhecimento e dissolução de união estável',
      'Partilha de bens e inventário',
    ],
    approach:
      'A atuação busca oferecer orientação clara e respeitosa, avaliando possibilidades consensuais e medidas judiciais quando necessárias, sempre considerando as particularidades familiares.',
    faqs: [
      {
        question: 'O divórcio pode ser feito em cartório?',
        answer:
          'Em algumas situações, sim. É necessário verificar os requisitos legais, a existência de consenso e outras circunstâncias do caso.',
      },
      {
        question: 'Guarda compartilhada significa divisão exata do tempo?',
        answer:
          'Não necessariamente. A guarda compartilhada se relaciona à participação conjunta nas decisões, enquanto a rotina de convivência é definida conforme a realidade da família.',
      },
    ],
  },
  {
    slug: 'direito-do-consumidor',
    title: 'Direito do Consumidor',
    shortDescription:
      'Orientação em relações de consumo, contratos, cobranças, produtos e prestação de serviços.',
    icon: ShieldCheck,
    intro:
      'O Direito do Consumidor protege relações entre consumidores e fornecedores e estabelece regras sobre informação, qualidade, contratos, cobrança e responsabilidade.',
    situations: [
      'Cobranças e inscrições em cadastros restritivos',
      'Problemas com produtos ou serviços',
      'Compras realizadas pela internet',
      'Contratos bancários e de consumo',
      'Atendimento e negociação com fornecedores',
    ],
    approach:
      'O escritório avalia comprovantes, contratos, comunicações e demais documentos para orientar sobre medidas administrativas, negociação ou atuação judicial quando cabível.',
    faqs: [
      {
        question: 'Toda compra pode ser cancelada em sete dias?',
        answer:
          'A regra do arrependimento possui aplicação específica, especialmente em contratações fora do estabelecimento comercial. É necessário verificar como e onde a compra ocorreu.',
      },
      {
        question: 'É importante guardar protocolos e comprovantes?',
        answer:
          'Sim. Registros de atendimento, notas fiscais, contratos, telas e mensagens podem ajudar a demonstrar o ocorrido.',
      },
    ],
  },
  {
    slug: 'direito-empresarial',
    title: 'Direito Empresarial',
    shortDescription:
      'Apoio jurídico preventivo e consultivo para organização das relações empresariais.',
    icon: Building2,
    intro:
      'A atividade empresarial envolve contratos, relações societárias, cobranças, responsabilidades e decisões que podem ser melhor estruturadas com acompanhamento jurídico preventivo.',
    situations: [
      'Elaboração e revisão de contratos empresariais',
      'Organização de relações entre sócios',
      'Cobranças e negociação de obrigações',
      'Orientação jurídica preventiva',
      'Análise de riscos em operações comerciais',
    ],
    approach:
      'O trabalho é desenvolvido com compreensão da atividade e dos documentos da empresa, oferecendo orientação jurídica compatível com a operação e com os limites legais aplicáveis.',
    faqs: [
      {
        question: 'Pequenas empresas também precisam de contratos escritos?',
        answer:
          'Contratos claros ajudam a registrar responsabilidades, prazos, valores e condições, independentemente do porte da empresa.',
      },
      {
        question: 'A consultoria preventiva substitui a contabilidade?',
        answer:
          'Não. As áreas são complementares e possuem atribuições diferentes. Em muitos temas, a integração entre profissionais é importante.',
      },
    ],
  },
]

export const institutionalValues = [
  { title: 'Atuação ética', description: 'Conduta responsável e respeito às normas profissionais.', icon: Scale },
  { title: 'Comunicação clara', description: 'Orientações compreensíveis em todas as etapas do atendimento.', icon: FileText },
  { title: 'Atendimento próximo', description: 'Escuta cuidadosa e acompanhamento compatível com cada demanda.', icon: Users },
  { title: 'Organização', description: 'Análise documental e condução técnica dos procedimentos.', icon: Building2 },
]
