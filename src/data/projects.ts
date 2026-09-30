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
    cover:
      'radial-gradient(circle at 88% 12%, rgb(232 201 146 / 0.45), transparent 50%), linear-gradient(135deg, #5c4030 0%, #3d2712 50%, #1a110b 100%)',
  },
  {
    slug: 'metrika8',
    name: 'Metrika8',
    url: 'https://metrika8.com.br',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'O Metrika 8 é uma plataforma completa para acompanhamento de treinos, evolução de métricas físicas, desafios gamificados e conexão com amigos.',
    cover:
      'radial-gradient(circle at 88% 12%, rgb(147 197 253 / 0.5), transparent 50%), linear-gradient(135deg, #2563eb 0%, #1d4ed8 35%, #0a1628 100%)',
  },
  {
    slug: 'sekai',
    name: 'Sekai Nipponic',
    url: 'https://sekai-gilt.vercel.app',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'Vitrine digital do Evento Sekai Nipponic. Sistema com inscrições online, mesa do júri digital, apuração do concurso cosplay em tempo real entre diversos outros recursos.',
    cover:
      'radial-gradient(circle at 12% 115%, rgb(56 189 248 / 0.6), transparent 50%), radial-gradient(circle at 88% 10%, rgb(251 146 60 / 0.8), transparent 50%), linear-gradient(135deg, #ea580c 0%, #9a3412 45%, #1e1b4b 100%)',
  },
  {
    slug: 'eltroca',
    name: 'ElTroca',
    url: 'https://eltroca.com.br',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'Releitura moderna do clássico jogo de formar palavras a partir de anagramas. Conta com ranking online, partidas ranqueadas, desafios diários e modo multijogador 1v1.',
    cover:
      'radial-gradient(circle at 88% 12%, rgb(250 248 235 / 0.35), transparent 45%), linear-gradient(135deg, #8cc63f 0%, #5e8a1f 45%, #2f5c12 100%)',
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
    cover:
      'radial-gradient(circle at 88% 12%, rgb(153 246 228 / 0.5), transparent 50%), linear-gradient(135deg, #2dd4bf 0%, #0d9488 40%, #134e4a 100%)',
  },
  {
    slug: 'gestomagico',
    name: 'Gesto Mágico',
    url: 'https://gesto-magico-desafio-aritmetico.vercel.app/',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'Desafio Aritmético é um jogo arcade ágil onde você desenha números na tela para estourar balões, resolver contas rápidas e derrotar chefes.',
    cover:
      'radial-gradient(circle at 88% 12%, rgb(255 156 238 / 0.6), transparent 45%), radial-gradient(circle at 55% 0%, rgb(255 226 122 / 0.3), transparent 40%), radial-gradient(circle at 10% 110%, rgb(124 240 255 / 0.45), transparent 50%), linear-gradient(135deg, #2a124e 0%, #1c0c3c 50%, #12082b 100%)',
  },
  {
    slug: 'ovitrampas',
    name: 'Ovitrampas',
    url: 'https://ovitrampasbp.vercel.app/',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'Ovitrampas BP é um Aplicativo PWA offline-first para agentes de combate às endemias de Barra do Piraí. Permite cadastrar armadilhas, gerir ciclos com GPS e sincronizar dados com o banco de dados.',
    cover:
      'radial-gradient(circle at 88% 12%, rgb(239 68 68 / 0.45), transparent 40%), radial-gradient(circle at 15% 0%, rgb(186 230 253 / 0.35), transparent 50%), linear-gradient(135deg, #0f766e 0%, #0369a1 50%, #0c4a6e 100%)',
  },
  {
    slug: 'tabuletras',
    name: 'TabuLetras',
    url: 'https://tabuletras.vercel.app/',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'TabuLetras: jogo de palavras cruzadas em PT-BR com IA, multijogador em tempo real e modos dinâmicos como Batata Quente e Casas Misteriosas.',
    cover:
      'radial-gradient(circle at 88% 12%, rgb(251 191 36 / 0.55), transparent 45%), radial-gradient(circle at 10% 115%, rgb(16 185 129 / 0.55), transparent 50%), linear-gradient(135deg, #8b5a2b 0%, #5c3a1e 50%, #2b1a0d 100%)',
  },
  {
    slug: 'semaforo',
    name: 'Semáforo do Toque',
    url: 'https://inovai.pirai.rj.gov.br/secmulher/',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'Aplicação web educativa de autoproteção infantil da Prefeitura de Piraí - RJ. Ensina limites corporais de forma lúdica pelo Semáforo do Toque, com áudio narrado, reforço positivo e certificado.',
    cover:
      'radial-gradient(circle at 92% 18%, rgb(239 68 68 / 0.85), transparent 18%), radial-gradient(circle at 78% 45%, rgb(251 191 36 / 0.8), transparent 18%), radial-gradient(circle at 64% 72%, rgb(16 185 129 / 0.8), transparent 18%), linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #172554 100%)',
  },
  {
    slug: 'colai',
    name: 'Cola Aí',
    url: 'https://colai-wine.vercel.app/',
    kind: 'web',
    kindLabel: 'Aplicação web',
    description:
      'É um Pastebin interno e ágil para equipes. Cole trechos de código ou logs com realce de sintaxe e compartilhe com os colegas de forma rápida e segura usando apenas um código de 6 caracteres.',
    cover:
      'radial-gradient(circle at 88% 12%, rgb(56 189 248 / 0.5), transparent 45%), radial-gradient(circle at 12% 115%, rgb(16 185 129 / 0.45), transparent 50%), linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #070d18 100%)',
  },
] as const
