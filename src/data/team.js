const asset = (file) => `${import.meta.env.BASE_URL}images/${file}`

export const teamMembers = [
  {
    name: 'Dr. Rafael Almeida',
    role: 'Advogado sócio',
    oab: 'OAB/PI 00.000',
    image: asset('team-rafael.jpg'),
    imageAlt: 'Retrato profissional demonstrativo de Rafael Almeida',
    bio: 'Atuação consultiva e contenciosa em questões cíveis, empresariais e contratuais, com atenção à prevenção de riscos e à organização documental.',
    education: 'Bacharel em Direito e especialista em Direito Civil e Processual Civil.',
    areas: ['Direito Civil', 'Direito Empresarial', 'Contratos'],
  },
  {
    name: 'Dra. Marina Castro',
    role: 'Advogada sócia',
    oab: 'OAB/PI 00.001',
    image: asset('team-marina.jpg'),
    imageAlt: 'Retrato profissional demonstrativo de Marina Castro',
    bio: 'Atendimento humanizado em questões previdenciárias, trabalhistas e familiares, com escuta cuidadosa e comunicação acessível.',
    education: 'Bacharel em Direito e especialista em Direito Previdenciário e do Trabalho.',
    areas: ['Direito Previdenciário', 'Direito Trabalhista', 'Direito de Família'],
  },
]
