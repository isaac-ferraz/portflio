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

export type JourneyStep = {
  when: L;
  title: string | L;
  text: L;
  tag: L;
  /** Painel clicável: âncora da página inicial e o texto do convite. */
  link?: { href: string; label: L };
  /** `offer` destaca o painel final, o convite. */
  variant?: 'offer';
};

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
    when: { pt: 'Hoje', en: 'Today' },
    title: { pt: 'Projetos em produção', en: 'Projects in production' },
    tag: { pt: 'No ar', en: 'Live' },
    text: {
      pt: 'Plataforma interna, site institucional, portfólios e painéis no ar — sistemas que pessoas de verdade usam todos os dias, que eu planejei, construí, publiquei e sigo mantendo.',
      en: 'An internal platform, a corporate website, portfolios and dashboards live — systems real people use every day, that I planned, built, shipped and keep maintaining.',
    },
    link: { href: '#projects', label: { pt: 'Ver os projetos', en: 'See the projects' } },
  },
  {
    when: { pt: 'Próximo capítulo', en: 'Next chapter' },
    title: { pt: 'Que tal ser com você?', en: 'How about with you?' },
    tag: { pt: 'Disponível', en: 'Available' },
    text: {
      pt: 'Procuro um time onde eu possa crescer e entregar desde o primeiro dia — do planejamento ao deploy, e o que vem depois. Se você tem uma vaga ou uma ideia para tirar do papel, o próximo capítulo a gente escreve junto.',
      en: "I'm looking for a team where I can grow and deliver from day one — from planning to deployment, and everything after. If you have an opening or an idea to get off the ground, we can write the next chapter together.",
    },
    link: { href: '#contact', label: { pt: 'Vamos conversar', en: "Let's talk" } },
    variant: 'offer',
  },
];

export type SkillGroup = { title: L; items: (string | L)[] };

export const skills: SkillGroup[] = [
  { title: { pt: 'Linguagens', en: 'Languages' }, items: ['Python', 'Java', 'TypeScript', 'JavaScript', 'SQL', 'PHP', 'Bash'] },
  {
    title: { pt: 'Front-end', en: 'Front-end' },
    items: ['React', 'Next.js', 'Tailwind CSS', 'HTML & CSS', { pt: 'Acessibilidade', en: 'Accessibility' }],
  },
  {
    title: { pt: 'Back-end & dados', en: 'Back-end & data' },
    items: ['API REST', 'Node.js', 'FastAPI', 'Flask', 'PostgreSQL', 'MySQL', 'SQLite', 'Prisma', 'pandas'],
  },
  {
    title: { pt: 'IA & automação', en: 'AI & automation' },
    items: ['Claude', 'n8n', { pt: 'Ollama (LLMs locais)', en: 'Ollama (local LLMs)' }, { pt: 'Engenharia de prompts', en: 'Prompt engineering' }, 'Chatbots', 'WhatsApp Cloud API'],
  },
  {
    title: { pt: 'DevOps & qualidade', en: 'DevOps & quality' },
    items: ['DevOps', 'Docker', 'Linux', 'CI/CD', 'GitHub Actions', 'Git / GitHub', 'Vercel', { pt: 'Testes automatizados', en: 'Automated testing' }, 'Lighthouse CI'],
  },
  {
    title: { pt: 'Métodos', en: 'Methods' },
    items: ['Scrum', 'Product Owner', 'Clean Architecture', 'ADRs', 'LGPD by design'],
  },
];

/** Linhas dos marquees (decorativas — o conteúdo acessível é a grade de habilidades). */
export const marqueeRows = [
  ['Next.js', 'TypeScript', 'Python', 'Java', 'PostgreSQL', 'React', 'FastAPI', 'Docker', 'n8n', 'Claude'],
  ['pandas', 'API REST', 'DevOps', 'Tailwind', 'Linux', 'Ollama', 'Flask', 'MySQL', 'Prisma', 'SQL'],
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
