import { Eye } from 'lucide-react'
import { GitHubIcon, InstagramIcon, WhatsAppIcon } from '@/components/ui/SocialIcons'
import { NAV_LINKS, SITE, SOCIAL } from '@/lib/constants'
import { useSiteMetrics } from '@/hooks/useSiteMetrics'

function formatCount(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function Footer() {
  const { metrics, configured } = useSiteMetrics()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-300/40 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-navy-900 dark:text-slate-100">
            {SITE.name}
          </p>
          <p className="mt-1 text-sm text-slate-500">{SITE.tagline}</p>
          <p className="mt-1 text-xs text-slate-400">
            © {year} {SITE.name}. Todos os direitos reservados.
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-500 transition hover:text-royal-800 dark:hover:text-mist"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SOCIAL.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="rounded-full border border-slate-300/70 p-2 text-slate-500 transition hover:text-royal-800 dark:border-white/10 dark:hover:text-mist"
          >
            <GitHubIcon size={16} />
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Instagram"
            className="rounded-full border border-slate-300/70 p-2 text-slate-500 transition hover:text-royal-800 dark:border-white/10 dark:hover:text-mist"
          >
            <InstagramIcon size={16} />
          </a>
          <a
            href={SOCIAL.whatsapp}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="WhatsApp"
            className="rounded-full border border-slate-300/70 p-2 text-slate-500 transition hover:text-royal-800 dark:border-white/10 dark:hover:text-mist"
          >
            <WhatsAppIcon size={16} />
          </a>
        </div>
      </div>

      <div className="border-t border-slate-300/30 dark:border-white/5">
        <p className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 text-xs text-slate-500 sm:px-6">
          <Eye size={14} className="text-mist" />
          {configured
            ? `${formatCount(metrics.totalViews)} visitas por aqui`
            : 'Um espaço quieto na internet'}
        </p>
      </div>
    </footer>
  )
}
