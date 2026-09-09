import { ExternalLink, Heart, Smartphone, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { useSiteMetrics } from '@/hooks/useSiteMetrics'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { metrics, likedSlugs, pendingLike, toggleLike, configured } =
    useSiteMetrics()
  const liked = likedSlugs.has(project.slug)
  const likes = metrics.likesByProject[project.slug] ?? 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="glass group flex h-full flex-col overflow-hidden rounded-3xl"
    >
      <div className={cn('relative h-36 bg-gradient-to-br p-5', project.accent)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(147_197_253_/_0.18),transparent_50%)]" />
        <div className="relative flex items-start justify-between">
          <span className="rounded-full border border-white/10 bg-midnight/40 px-3 py-1 text-[11px] font-semibold tracking-wide text-mist/90 uppercase">
            {project.kindLabel}
          </span>
          {project.kind === 'android' ? (
            <Smartphone className="text-mist/70" size={18} />
          ) : (
            <Globe className="text-mist/70" size={18} />
          )}
        </div>
        <p className="relative mt-8 font-display text-2xl font-semibold text-slate-50">
          {project.name}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-6">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal-800 transition group-hover:gap-2 dark:text-mist"
            >
              Abrir
              <ExternalLink size={14} />
            </a>
          ) : (
            <span className="text-sm font-medium text-slate-500">
              App no dispositivo
            </span>
          )}

          <button
            type="button"
            onClick={() => void toggleLike(project.slug)}
            disabled={!configured || pendingLike === project.slug}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition',
              liked
                ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-300'
                : 'border-slate-300/70 text-slate-600 hover:border-royal-800/40 hover:text-royal-800 dark:border-white/10 dark:text-slate-300 dark:hover:border-mist/40 dark:hover:text-mist',
            )}
            aria-pressed={liked}
            aria-label={`Curtir ${project.name}`}
          >
            <Heart size={15} className={liked ? 'fill-current' : undefined} />
            {likes}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
