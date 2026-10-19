import type { L } from '~/i18n/utils';

export const profile = {
  name: 'Isaac Ferraz de Oliveira',
  short: 'Isaac Ferraz',
  email: 'isaac.ferraz1311@gmail.com',
  linkedin: 'https://www.linkedin.com/in/isaacferraz1311/',
  github: 'https://github.com/isaac-ferraz',
  cv: 'cv/isaac-ferraz-curriculo.pdf',
  city: 'São José dos Campos, SP',
};

export type JourneyStep = { when: L; title: string; text: L; tag: L };

export const journey: JourneyStep[] = [
  {
    when: { pt: '2022 – 2024', en: '2022 – 2024' },
    title: 'Colégio Fonte',
    tag: { pt: 'Ensino médio', en: 'High school' },
    text: {
      pt: 'Ensino médio em São José dos Campos, com medalhas na Canguru de Matemática, na OBA e na Matemática sem Fronteiras.',
      en: 'High school in São José dos Campos, with medals in the Kangaroo Math, Brazilian Astronomy (OBA) and Mathematics Without Borders olympiads.',
    },
  },
  {
    when: { pt: '2026 · 1º sem.', en: '2026 · 1st sem.' },
    title: 'FATEC São José dos Campos',
    tag: { pt: 'Faculdade', en: 'College' },
    text: {
      pt: 'Começo de Análise e Desenvolvimento de Sistemas. No primeiro projeto integrado, o BotGotinha: um assistente de vacinação com IA local e voz.',
      en: 'Started Systems Analysis and Development. First integrated project: BotGotinha, a vaccination assistant with local AI and voice.',
    },
  },
  {
    when: { pt: 'Mai 2026', en: 'May 2026' },
    title: 'Cobratec',
    tag: { pt: 'Estágio', en: 'Internship' },
    text: {
      pt: 'Estágio em desenvolvimento. O primeiro sistema foi o inventário de hardware do TI — que cresceu e virou o Cobratec 360.',
      en: 'Software development internship. My first system was the IT hardware inventory — which grew into Cobratec 360.',
    },
  },
  {
    when: { pt: 'Jul 2026', en: 'Jul 2026' },
    title: 'ENTARDECER',
    tag: { pt: 'Ao vivo', en: 'Live' },
    text: {
      pt: 'Uma rede social que aguentou um casamento inteiro em tempo real: feed, enquetes, telão e um museu de memórias depois da festa.',
      en: 'A social network that handled a whole wedding in real time: feed, polls, a projector mode and a memory museum after the party.',
    },
  },
  {
    when: { pt: 'Ago – Out 2026', en: 'Aug – Oct 2026' },
    title: 'Product Owner',
    tag: { pt: 'Produção', en: 'Production' },
    text: {
      pt: 'Site institucional no ar, portal de negociação, negociação pelo WhatsApp e a plataforma interna — do levantamento de requisitos à entrega.',
      en: 'Corporate website live, a debt-negotiation portal, WhatsApp negotiation and the internal platform — from requirements to delivery.',
    },
  },
  {
    when: { pt: 'Agora', en: 'Now' },
    title: 'Próximo capítulo',
    tag: { pt: 'Em construção', en: 'In progress' },
    text: {
      pt: 'API com a DM na FATEC, rumo à Feira de Soluções de dezembro — e a meta de seguir como desenvolvedor júnior num time experiente.',
      en: 'The DM project at FATEC, heading to the December Solutions Fair — and the goal of growing as a junior developer in an experienced team.',
    },
  },
];

export type SkillGroup = { title: L; items: string[] };

export const skills: SkillGroup[] = [
  { title: { pt: 'Linguagens', en: 'Languages' }, items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Java', 'PHP', 'Bash'] },
  { title: { pt: 'Front-end', en: 'Front-end' }, items: ['React', 'Next.js', 'Astro', 'Tailwind CSS', 'HTML & CSS', 'Acessibilidade'] },
  {
    title: { pt: 'Back-end & dados', en: 'Back-end & data' },
    items: ['Node.js', 'FastAPI', 'Flask', 'APIs REST', 'PostgreSQL', 'MySQL', 'SQLite', 'Prisma', 'Supabase', 'Polars / pandas'],
  },
  {
    title: { pt: 'IA & automação', en: 'AI & automation' },
    items: ['n8n', 'Ollama (LLMs locais)', 'Engenharia de prompts', 'Chatbots', 'faster-whisper', 'WhatsApp Cloud API'],
  },
  {
    title: { pt: 'Infra & qualidade', en: 'Infra & quality' },
    items: ['Linux', 'Git / GitHub', 'Docker', 'GitHub Actions', 'Vercel', 'Vitest', 'Playwright', 'Lighthouse CI'],
  },
  {
    title: { pt: 'Métodos', en: 'Methods' },
    items: ['Scrum', 'Product Owner', 'Clean Architecture', 'ADRs', 'LGPD by design'],
  },
];

/** Linhas dos marquees (decorativas — o conteúdo acessível é a grade de habilidades). */
export const marqueeRows = [
  ['Next.js', 'TypeScript', 'Python', 'PostgreSQL', 'React', 'FastAPI', 'Prisma', 'Docker', 'n8n', 'Astro'],
  ['Polars', 'Supabase', 'Tailwind', 'GSAP', 'Linux', 'Playwright', 'Ollama', 'Flask', 'MySQL', 'Vitest'],
];

export const education = {
  degrees: [
    {
      when: { pt: '2026 – cursando', en: '2026 – ongoing' },
      title: { pt: 'Tecnólogo em Análise e Desenvolvimento de Sistemas', en: 'Associate degree in Systems Analysis and Development' },
      where: 'FATEC São José dos Campos — Prof. Jessen Vidal',
    },
    {
      when: { pt: '2022 – 2024', en: '2022 – 2024' },
      title: { pt: 'Ensino Médio completo', en: 'High school diploma' },
      where: 'Colégio Fonte — São José dos Campos, SP',
    },
  ],
  courses: [
    { name: 'IT Essentials', by: 'Cisco Networking Academy', done: true },
    { name: 'Linux Essentials', by: 'Cisco Networking Academy', done: false },
    { name: { pt: 'Formação em Machine Learning', en: 'Machine Learning track' }, by: 'Alura', done: false },
    { name: { pt: 'Java Orientado a Objetos', en: 'Object-Oriented Java' }, by: 'Alura', done: false },
    { name: 'AWS Academy Learner Lab', by: 'Amazon Web Services', done: false },
  ] as { name: string | L; by: string; done: boolean }[],
  awards: [
    { name: { pt: 'Olimpíada Canguru de Matemática', en: 'Kangaroo Math Olympiad' }, short: 'MAT' },
    { name: { pt: 'Olimpíada Brasileira de Astronomia e Astronáutica', en: 'Brazilian Astronomy & Astronautics Olympiad' }, short: 'OBA' },
    { name: { pt: 'Olimpíada Matemática sem Fronteiras', en: 'Mathematics Without Borders' }, short: 'MSF' },
  ],
  languages: [
    { name: { pt: 'Português', en: 'Portuguese' }, level: { pt: 'Nativo', en: 'Native' }, value: 100 },
    { name: { pt: 'Inglês', en: 'English' }, level: { pt: 'Intermediário', en: 'Intermediate' }, value: 62 },
    { name: { pt: 'Espanhol', en: 'Spanish' }, level: { pt: 'Básico', en: 'Basic' }, value: 30 },
  ],
  soft: {
    pt: ['Trabalho em equipe', 'Proatividade', 'Atenção aos detalhes', 'Raciocínio analítico', 'Organização', 'Responsabilidade'],
    en: ['Teamwork', 'Proactivity', 'Attention to detail', 'Analytical thinking', 'Organization', 'Accountability'],
  },
};
