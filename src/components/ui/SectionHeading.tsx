import { cn } from '@/lib/cn'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-royal-800 uppercase dark:text-mist/80">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl dark:text-slate-50">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  )
}
