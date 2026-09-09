import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useContactForm } from '@/hooks/useContactForm'
import { cn } from '@/lib/cn'

const fieldClass =
  'mt-1.5 w-full rounded-2xl border border-slate-300/70 bg-white/60 px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-royal-800/50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-mist/40'

export function Contact() {
  const { values, update, submitting, feedback, onSubmit } = useContactForm()

  return (
    <section id="contato" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Mensagem"
          title="Deixe um recado."
          description="Se algo da vitrine ressoou, ou se você só quiser puxar conversa — o espaço está aberto."
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <GlassCard>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Nome
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    value={values.name}
                    onChange={(event) => update('name', event.target.value)}
                    className={fieldClass}
                    placeholder="Seu nome"
                    autoComplete="name"
                  />
                </label>
                <label className="block text-sm font-medium">
                  E-mail
                  <input
                    required
                    type="email"
                    maxLength={255}
                    value={values.email}
                    onChange={(event) => update('email', event.target.value)}
                    className={fieldClass}
                    placeholder="voce@email.com"
                    autoComplete="email"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Assunto
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    value={values.subject}
                    onChange={(event) => update('subject', event.target.value)}
                    className={fieldClass}
                    placeholder="Sobre o que você quer falar"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Nº de WhatsApp
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    (opcional)
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={32}
                    value={values.whatsapp}
                    onChange={(event) => update('whatsapp', event.target.value)}
                    className={fieldClass}
                    placeholder="(11) 99999-9999"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium">
                Mensagem
                <textarea
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={5}
                  value={values.message}
                  onChange={(event) => update('message', event.target.value)}
                  className={cn(fieldClass, 'resize-y')}
                  placeholder="Escreva o que quiser contar."
                />
              </label>

              <div className="hidden" aria-hidden="true">
                <label>
                  Empresa
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.company}
                    onChange={(event) => update('company', event.target.value)}
                  />
                </label>
              </div>

              {feedback ? (
                <p
                  className={cn(
                    'rounded-2xl px-4 py-3 text-sm',
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300',
                  )}
                >
                  {feedback.text}
                </p>
              ) : null}

              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? 'Enviando…' : 'Enviar recado'}
                <Send size={16} />
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
