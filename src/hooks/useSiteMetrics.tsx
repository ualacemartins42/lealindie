import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { readLocalLikedSlugs, toggleProjectLike } from '@/services/supabase/likes'

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
  const [metrics, setMetrics] = useState<SiteMetrics>(() => ({
    ...emptyMetrics,
    likedSlugs: readLocalLikedSlugs(),
  }))
  const [pendingLike, setPendingLike] = useState<ProjectSlug | null>(null)
  const [visitorHash, setVisitorHash] = useState<string | null>(null)
  const pendingRef = useRef<ProjectSlug | null>(null)
  const likesTouchedRef = useRef(false)

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
        if (!cancelled && !likesTouchedRef.current) setMetrics(next)
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
      if (pendingRef.current) return
      pendingRef.current = slug
      likesTouchedRef.current = true
      setPendingLike(slug)

      try {
        const hash = visitorHash ?? (await getVisitorHash())
        if (!visitorHash) setVisitorHash(hash)

        const currentlyLiked = metrics.likedSlugs.includes(slug)
        const currentCount = metrics.likesByProject[slug] ?? 0

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

        const result = await toggleProjectLike(slug, hash, currentlyLiked)

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
          setMetrics((current) => {
            const likesByProject = {
              ...current.likesByProject,
              [slug]: result.count,
            }

            return {
              ...current,
              likesByProject,
              totalLikes: Object.values(likesByProject).reduce(
                (total, value) => total + value,
                0,
              ),
              likedSlugs: result.liked
                ? Array.from(new Set([...current.likedSlugs, slug]))
                : current.likedSlugs.filter((item) => item !== slug),
            }
          })
        }
      } finally {
        pendingRef.current = null
        setPendingLike(null)
      }
    },
    [metrics.likedSlugs, metrics.likesByProject, visitorHash],
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
