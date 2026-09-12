import type { ProjectSlug } from '@/types'
import { supabase } from '@/services/supabase/supabaseClient'

const LIKED_KEY = 'lealindie_liked_slugs'

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

export function readLocalLikedSlugs(): ProjectSlug[] {
  try {
    const raw = window.localStorage.getItem(LIKED_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is ProjectSlug => typeof item === 'string' && isProjectSlug(item))
  } catch {
    return []
  }
}

export function writeLocalLikedSlugs(slugs: ProjectSlug[]): void {
  window.localStorage.setItem(LIKED_KEY, JSON.stringify(slugs))
}

function tallySlugs(rows: { project_slug: string | null }[] | null): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const row of rows ?? []) {
    if (!row.project_slug) continue
    counts[row.project_slug] = (counts[row.project_slug] ?? 0) + 1
  }
  return counts
}

export async function fetchLikeCounts(): Promise<Record<string, number>> {
  if (!supabase) return {}

  const fromView = await supabase
    .from('project_like_counts')
    .select('project_slug, like_count')

  if (!fromView.error) {
    const counts: Record<string, number> = {}
    for (const row of fromView.data ?? []) {
      if (row.project_slug) {
        counts[row.project_slug] = Number(row.like_count ?? 0)
      }
    }
    return counts
  }

  const fromTable = await supabase.from('project_likes').select('project_slug')
  if (fromTable.error) {
    console.error('project_like_counts', fromView.error.message)
    console.error('project_likes select', fromTable.error.message)
    return {}
  }

  return tallySlugs(fromTable.data)
}

interface ToggleLikeResult {
  liked: boolean
  count: number
}

export async function toggleProjectLike(
  slug: ProjectSlug,
  visitorHash: string,
  currentlyLiked: boolean,
): Promise<ToggleLikeResult | null> {
  if (!supabase) return null

  if (currentlyLiked) {
    const { error } = await supabase
      .from('project_likes')
      .delete()
      .eq('project_slug', slug)
      .eq('visitor_hash', visitorHash)

    if (error) {
      console.error('project_likes delete', error.message)
      return null
    }
  } else {
    const { error } = await supabase.from('project_likes').insert({
      project_slug: slug,
      visitor_hash: visitorHash,
    })

    const duplicate =
      error?.code === '23505' ||
      error?.code === '409' ||
      /duplicate|unique/i.test(error?.message ?? '')

    if (error && !duplicate) {
      console.error('project_likes insert', error.message)
      return null
    }
  }

  const liked = !currentlyLiked
  const counts = await fetchLikeCounts()
  const local = new Set(readLocalLikedSlugs())
  if (liked) local.add(slug)
  else local.delete(slug)
  writeLocalLikedSlugs(Array.from(local))

  return {
    liked,
    count: counts[slug] ?? Math.max(0, liked ? 1 : 0),
  }
}
