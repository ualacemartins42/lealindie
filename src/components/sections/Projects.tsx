import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { PROJECTS } from '@/data/projects'

export function Projects() {
  return (
    <section id="projetos" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Vitrine"
          title="O que foi ganhando forma"
          description="Seis projetos pessoais. Abra os que tiverem um endereço, deixe um like se algo ressoar."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
