export type ProjectSlug =
  | 'tyairo'
  | 'metrika8'
  | 'sekai'
  | 'eltroca'
  | 'fuelflow'
  | 'gestomagico'
  | 'ovitrampas'

export type ProjectKind = 'web' | 'android'

export interface Project {
  slug: ProjectSlug
  name: string
  url?: string
  download?: string
  kind: ProjectKind
  kindLabel: string
  description: string
  accent: string
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
