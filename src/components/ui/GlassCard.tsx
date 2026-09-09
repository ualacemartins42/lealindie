import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-3xl p-6 transition duration-300 hover:border-royal-800/30 dark:hover:border-mist/20',
        className,
      )}
    >
      {children}
    </div>
  )
}
