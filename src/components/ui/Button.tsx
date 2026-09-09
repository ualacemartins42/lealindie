import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps {
  children: ReactNode
  href?: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  onClick?: () => void
  disabled?: boolean
  external?: boolean
}

export function Button({
  children,
  href,
  type = 'button',
  variant = 'primary',
  className,
  onClick,
  disabled,
  external,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist disabled:cursor-not-allowed disabled:opacity-60',
    variant === 'primary' &&
      'bg-navy-800 text-mist shadow-lg shadow-navy-950/30 hover:-translate-y-0.5 hover:bg-royal-800',
    variant === 'secondary' &&
      'border border-slate-300/70 bg-white/50 text-navy-900 hover:border-royal-800/40 hover:text-royal-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-mist/30 dark:hover:text-mist',
    variant === 'ghost' &&
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white',
    className,
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external
          ? { target: '_blank', rel: 'noreferrer noopener' }
          : undefined)}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
