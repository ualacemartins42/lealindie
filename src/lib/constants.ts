export const SITE = {
  name: 'Leal Indie',
  tagline: 'Criação independente de software',
  founder: 'Ualace Leal',
  headline: 'Um cantinho para o que eu construo por lazer.',
  subheadline:
    'Este é o meu hub pessoal: um espaço calmo onde reúno os softwares e aplicativos que nasceram de curiosidade, noites de estudo e vontade de ver uma ideia ganhando vida na tela.',
  location: 'Brasil',
} as const

export const SOCIAL = {
  github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/ualacemartins42',
  instagram: 'https://www.instagram.com/ualace.leal/',
  whatsapp: 'https://wa.me/5524992682305',
} as const

export const NAV_LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#projetos', label: 'Vitrine' },
  { href: '#contato', label: 'Mensagem' },
] as const
