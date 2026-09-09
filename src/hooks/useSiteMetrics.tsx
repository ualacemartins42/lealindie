import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ProjectSlug, SiteMetrics } from '@/types'
import {
  hasTrackedViewThisSession,
  markViewTrackedThisSession,
  getVisitorHash,
} from '@/lib/visitor'
import { isSupabaseConfigured } from '@/services/supabase/supabaseClient'
import { fetchSiteMetrics, registerPageView } from '@/services/supabase/metrics'
import { toggleProjectLike } from '@/services/supabase/likes'

interface MetricsContextValue {
  configured: boolean
  loading: boolean
  metrics: SiteMetrics
  likedSlugs: Set<ProjectSlug>
  pendingLike: ProjectSlug | null
  toggleLike: (slug: ProjectSlug) => Promise<void>
}

const emptyMetrics: SiteMetrics = {
  totalViews: 0,
  uniqueVisitors: 0,
  totalLikes: 0,
  likesByProject: {},
  likedSlugs: [],
}

const MetricsContext = createContext<MetricsContextValue | null>(null)

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [metrics, setMetrics] = useState<SiteMetrics>(emptyMetrics)
  const [pendingLike, setPendingLike] = useState<ProjectSlug | null>(null)
  const [visitorHash, setVisitorHash] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        const hash = await getVisitorHash()
        if (cancelled) return
        setVisitorHash(hash)

        if (!hasTrackedViewThisSession()) {
          markViewTrackedThisSession()
          await registerPageView(hash, window.location.pathname)
        }

        const next = await fetchSiteMetrics(hash)
        if (!cancelled) setMetrics(next)
      } catch (error) {
        console.error(error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  const toggleLike = useCallback(
    async (slug: ProjectSlug) => {
      if (!visitorHash || pendingLike) return

      const currentlyLiked = metrics.likedSlugs.includes(slug)
      const currentCount = metrics.likesByProject[slug] ?? 0

      setPendingLike(slug)
      setMetrics((current) => {
        const likesByProject = { ...current.likesByProject }
        likesByProject[slug] = Math.max(
          0,
          currentCount + (currentlyLiked ? -1 : 1),
        )

        return {
          ...current,
          totalLikes: Math.max(0, current.totalLikes + (currentlyLiked ? -1 : 1)),
          likesByProject,
          likedSlugs: currentlyLiked
            ? current.likedSlugs.filter((item) => item !== slug)
            : [...current.likedSlugs, slug],
        }
      })

      const result = await toggleProjectLike(slug, visitorHash)

      if (!result) {
        setMetrics((current) => {
          const likesByProject = { ...current.likesByProject }
          likesByProject[slug] = currentCount
          return {
            ...current,
            totalLikes: Math.max(
              0,
              current.totalLikes + (currentlyLiked ? 1 : -1),
            ),
            likesByProject,
            likedSlugs: currentlyLiked
              ? [...current.likedSlugs, slug]
              : current.likedSlugs.filter((item) => item !== slug),
          }
        })
      } else {
        setMetrics((current) => ({
          ...current,
          likesByProject: {
            ...current.likesByProject,
            [slug]: result.count,
          },
          likedSlugs: result.liked
            ? Array.from(new Set([...current.likedSlugs, slug]))
            : current.likedSlugs.filter((item) => item !== slug),
        }))
      }

      setPendingLike(null)
    },
    [metrics.likedSlugs, metrics.likesByProject, pendingLike, visitorHash],
  )

  const likedSlugs = useMemo(
    () => new Set(metrics.likedSlugs),
    [metrics.likedSlugs],
  )

  const value = useMemo<MetricsContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      metrics,
      likedSlugs,
      pendingLike,
      toggleLike,
    }),
    [likedSlugs, loading, metrics, pendingLike, toggleLike],
  )

  return (
    <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>
  )
}

export function useSiteMetrics(): MetricsContextValue {
  const context = useContext(MetricsContext)
  if (!context) {
    throw new Error('useSiteMetrics must be used within MetricsProvider')
  }
  return context
}
