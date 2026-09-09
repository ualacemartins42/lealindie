import { Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { cn } from '@/lib/cn'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-300/40 bg-[#e8eef6]/80 backdrop-blur-xl dark:border-white/10 dark:bg-midnight/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-navy-800 to-royal-800 font-display text-[11px] font-bold tracking-tight text-mist shadow-lg shadow-navy-950/40">
            LI
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold tracking-tight text-navy-900 dark:text-slate-100">
              {SITE.name}
            </span>
            <span className="hidden text-[10px] font-medium tracking-wide text-slate-500 uppercase lg:block dark:text-slate-500">
              {SITE.tagline}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-royal-800 dark:text-slate-400 dark:hover:text-mist"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="rounded-full border border-slate-300/70 p-2 text-slate-600 transition hover:border-royal-800/40 hover:text-royal-800 dark:border-white/10 dark:text-slate-400 dark:hover:border-mist/30 dark:hover:text-mist"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-300/70 p-2 md:hidden dark:border-white/10"
            aria-label="Abrir menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'md:hidden',
          open ? 'block border-t border-slate-300/50 dark:border-white/10' : 'hidden',
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
