import type { ProjectSlug, SiteMetrics } from '@/types'
import { supabase } from '@/services/supabase/supabaseClient'
import { fetchLikeCounts, readLocalLikedSlugs } from '@/services/supabase/likes'

interface MetricsRpc {
  total_views: number
  unique_visitors: number
  total_likes: number
  likes_by_project: Record<string, number>
  liked_slugs: string[]
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

function sumCounts(counts: Record<string, number>): number {
  return Object.values(counts).reduce((total, value) => total + value, 0)
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
  if (!supabase) {
    return {
      ...emptyMetrics(),
      likedSlugs: readLocalLikedSlugs(),
    }
  }

  const likesByProject = await fetchLikeCounts()
  const likedSlugs = readLocalLikedSlugs()

  const { data, error } = await supabase.rpc('get_site_metrics', {
    p_visitor_hash: visitorHash,
  })

  if (error || !data || typeof data !== 'object') {
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      totalLikes: sumCounts(likesByProject),
      likesByProject,
      likedSlugs,
    }
  }

  const rpc = data as Partial<MetricsRpc>

  return {
    totalViews: Number(rpc.total_views ?? 0),
    uniqueVisitors: Number(rpc.unique_visitors ?? 0),
    totalLikes: sumCounts(likesByProject),
    likesByProject,
    likedSlugs,
  }
}

export type { ProjectSlug }
