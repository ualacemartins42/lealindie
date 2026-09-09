import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { SITE } from '@/lib/constants'

export function About() {
  return (
    <section id="sobre" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Sobre"
          title="Uma jornada criativa, no meu ritmo."
          description="Desenvolver é o hobby que virou companhia: um jeito de pensar com as mãos, de transformar uma pergunta solta em algo que dá para abrir e usar."
        />

        <div className="mx-auto mt-12 max-w-3xl">
          <GlassCard>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A {SITE.name} nasceu como um nome para reunir o que eu faço nas
              horas vagas. Não é empresa, não é captação de clientes — é só o
              lugar onde os projetos pessoais se encontram.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Cada peça da vitrine veio de uma curiosidade diferente: um
              problema do cotidiano, uma ideia que não saía da cabeça, a vontade
              de ver a tela responder. O processo importa tanto quanto o
              resultado — desenhar o fluxo, cuidar do detalhe, voltar no dia
              seguinte e deixar um pouco melhor.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Se você passou por aqui, fique à vontade para olhar, curtir o que
              gostar e seguir o caminho. Este espaço existe para isso.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
