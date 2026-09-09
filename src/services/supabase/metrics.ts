import type { ProjectSlug, SiteMetrics } from '@/types'
import { supabase } from '@/services/supabase/supabaseClient'

interface MetricsRpc {
  total_views: number
  unique_visitors: number
  total_likes: number
  likes_by_project: Record<string, number>
  liked_slugs: string[]
}

const PROJECT_SLUGS = new Set<ProjectSlug>([
  'tyairo',
  'metrika8',
  'sekai',
  'eltroca',
  'fuelflow',
])

function isProjectSlug(value: string): value is ProjectSlug {
  return PROJECT_SLUGS.has(value as ProjectSlug)
}

function emptyMetrics(): SiteMetrics {
  return {
    totalViews: 0,
    uniqueVisitors: 0,
    totalLikes: 0,
    likesByProject: {},
    likedSlugs: [],
  }
}

function parseMetrics(raw: unknown): SiteMetrics {
  if (!raw || typeof raw !== 'object') return emptyMetrics()

  const data = raw as Partial<MetricsRpc>
  const likedSlugs = Array.isArray(data.liked_slugs)
    ? data.liked_slugs.filter(isProjectSlug)
    : []

  return {
    totalViews: Number(data.total_views ?? 0),
    uniqueVisitors: Number(data.unique_visitors ?? 0),
    totalLikes: Number(data.total_likes ?? 0),
    likesByProject:
      data.likes_by_project && typeof data.likes_by_project === 'object'
        ? data.likes_by_project
        : {},
    likedSlugs,
  }
}

export async function registerPageView(
  visitorHash: string,
  path = '/',
): Promise<number | null> {
  if (!supabase) return null

  const { data, error } = await supabase.rpc('register_page_view', {
    p_visitor_hash: visitorHash,
    p_path: path,
  })

  if (error) {
    console.error('register_page_view', error.message)
    return null
  }

  return data
}

export async function fetchSiteMetrics(
  visitorHash: string,
): Promise<SiteMetrics> {
  if (!supabase) return emptyMetrics()

  const { data, error } = await supabase.rpc('get_site_metrics', {
    p_visitor_hash: visitorHash,
  })

  if (error) {
    console.error('get_site_metrics', error.message)
    return emptyMetrics()
  }

  return parseMetrics(data)
}
