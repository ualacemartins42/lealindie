export type ProjectSlug =
  | 'tyairo'
  | 'metrika8'
  | 'sekai'
  | 'eltroca'
  | 'fuelflow'
  | 'gestomagico'
  | 'ovitrampas'
  | 'tabuletras'
  | 'semaforo'
  | 'colai'
  | 'tyairocron'
  | 'legadoancestrais'

export type ProjectKind = 'web' | 'android' | 'game'

export interface Project {
  slug: ProjectSlug
  name: string
  url?: string
  download?: string
  kind: ProjectKind
  kindLabel: string
  description: string
  cover: string
}

export interface SiteMetrics {
  totalViews: number
  uniqueVisitors: number
  totalLikes: number
  likesByProject: Record<string, number>
  likedSlugs: ProjectSlug[]
}

export interface ContactPayload {
  name: string
  email: string
  subject: string
  whatsapp: string
  message: string
  honeypot: string
}

export type Theme = 'dark' | 'light'
