import { ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { SITE } from '@/lib/constants'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display mb-2 text-lg font-semibold text-navy-900 dark:text-slate-100"
          >
            {SITE.name}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mb-5 text-xs font-medium tracking-[0.2em] text-royal-800 uppercase dark:text-mist/80"
          >
            {SITE.tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display max-w-3xl text-4xl leading-[1.08] font-semibold tracking-tight text-navy-900 sm:text-6xl dark:text-slate-50"
          >
            {SITE.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400"
          >
            {SITE.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-8"
          >
            <Button href="#projetos" variant="secondary">
              Explorar a vitrine
              <ArrowDown size={16} />
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
        >
          <div className="absolute -top-20 -right-12 h-44 w-44 rounded-full bg-royal-800/20 blur-3xl" />
          <p className="text-xs font-medium tracking-[0.18em] text-royal-800 uppercase dark:text-mist/70">
            Um diário de criação
          </p>
          <p className="font-display mt-4 text-2xl font-semibold text-navy-900 dark:text-white">
            Feito nas horas vagas, com apreço.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Nada aqui é uma vitrine de agência. São projetos que eu quis
            dar vida — para aprender, para brincar com ideias e para guardar o
            caminho.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              'Começar pequeno e ir lapidando',
              'Cuidar da experiência de quem usa',
              'Deixar cada projeto com uma alma própria',
              'Compartilhar o que foi ganhando forma',
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-slate-300/40 bg-white/40 px-4 py-3 dark:border-white/10 dark:bg-white/5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-mist" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
