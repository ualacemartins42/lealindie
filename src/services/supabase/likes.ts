import type { ProjectSlug } from '@/types'
import { supabase } from '@/services/supabase/supabaseClient'

interface ToggleLikeResult {
  liked: boolean
  count: number
}

export async function toggleProjectLike(
  slug: ProjectSlug,
  visitorHash: string,
): Promise<ToggleLikeResult | null> {
  if (!supabase) return null

  const { data, error } = await supabase.rpc('toggle_project_like', {
    p_project_slug: slug,
    p_visitor_hash: visitorHash,
  })

  if (error) {
    console.error('toggle_project_like', error.message)
    return null
  }

  if (!data || typeof data !== 'object') return null

  const payload = data as { liked?: unknown; count?: unknown }

  return {
    liked: Boolean(payload.liked),
    count: Number(payload.count ?? 0),
  }
}
