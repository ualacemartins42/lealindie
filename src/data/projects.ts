import type { Project } from '@/types'

export const PROJECTS: readonly Project[] = [
  {
    slug: 'tyairo',
    name: 'Tyairô',
    url: 'https://tyairo.com.br',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'Vitrine do sistema web completo para a Academia de Judô Tyairô: gerenciamento de treinos, torneios com chaveamento automático, área do aluno, exame de graduação e rede social interna Clube Tyairô.',
    accent: 'from-blue-950 via-navy-800 to-midnight',
  },
  {
    slug: 'metrika8',
    name: 'Metrika8',
    url: 'https://metrika8.com.br',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'O Metrika 8 é uma plataforma completa para acompanhamento de treinos, evolução de métricas físicas, desafios gamificados e conexão com amigos.',
    accent: 'from-slate-950 via-blue-950 to-navy-800',
  },
  {
    slug: 'sekai',
    name: 'Sekai',
    url: 'https://sekai-gilt.vercel.app',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'Uma aplicação web que explora um pequeno universo próprio, com fluxos simples e uma interface pensada para ser agradável de usar.',
    accent: 'from-indigo-950 via-navy-800 to-slate-950',
  },
  {
    slug: 'eltroca',
    name: 'ElTroca',
    url: 'https://eltroca.com.br',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'Releitura moderna do clássico jogo de formar palavras a partir de anagramas. Conta com ranking online, partidas ranqueadas, desafios diários e modo multijogador 1v1.',
    accent: 'from-navy-900 via-blue-950 to-midnight',
  },
  {
    slug: 'fuelflow',
    name: 'FuelFlow',
    url: '/downloads/FuelFlow.apk',
    download: 'FuelFlow.apk',
    kind: 'android',
    kindLabel: 'Aplicativo mobile',
    description:
      'App prático para controle de consumo e eficiência de combustível (km/L) via odômetro total ou trip parcial, com funcionamento 100% offline.',
    accent: 'from-slate-950 via-navy-800 to-blue-950',
  },
] as const
