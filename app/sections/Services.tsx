'use client'
import { motion } from 'motion/react'
import Icon from '@/app/components/Icon'
import { BackendIcon, DevOpsIcon, FrontendIcon } from '@/app/components/iconsList'
import { useLanguage } from '@/app/context/LanguageContext'
import { SectionHeading } from '@/app/components/ui/SectionHeading'
import CardSpotlight from '@/app/components/ui/CardSpotlight'

export default function Services() {
  const { language } = useLanguage()

  const services = [
    {
      icon: <FrontendIcon />,
      title: language === 'EN' ? 'Frontend Development' : 'Desarrollo Frontend',
      description:
        language === 'EN'
          ? 'Responsive interfaces with React and Next.js, applying Clean Architecture and component-driven development.'
          : 'Interfaces responsivas con React y Next.js, aplicando Arquitectura Limpia y desarrollo orientado a componentes.',
      stack: ['React', 'Next.js', 'Astro', 'Tailwind', 'Motion', 'Three.js'],
    },
    {
      icon: <BackendIcon />,
      title: language === 'EN' ? 'Backend Development' : 'Desarrollo Backend',
      description:
        language === 'EN'
          ? 'REST APIs and microservices with Node.js, Express and Laravel, using relational databases and TDD.'
          : 'APIs REST y microservicios con Node.js, Express y Laravel, usando bases de datos relacionales y TDD.',
      stack: ['Node.js', 'Express', 'Laravel', 'PHP', 'MySQL', 'SQLite'],
    },
    {
      icon: <DevOpsIcon />,
      title: language === 'EN' ? 'DevOps & CI/CD' : 'DevOps & CI/CD',
      description:
        language === 'EN'
          ? 'App deployment with Docker, automated pipelines with GitHub Actions and GitLab CI in monorepos.'
          : 'Despliegue con Docker, pipelines automatizados con GitHub Actions y GitLab CI en monorepos.',
      stack: ['Docker', 'GitHub', 'GitLab'],
    },
  ]

  const t = {
    eyebrow: language === 'EN' ? 'What I build' : 'Qué construyo',
    title: language === 'EN' ? 'Complete web solutions, end to end' : 'Soluciones web completas, de punta a punta',
    subtitle:
      language === 'EN'
        ? 'From the interface your users see to the infrastructure that powers it.'
        : 'Desde la interfaz que ven tus usuarios hasta la infraestructura que la sostiene.',
  }

  return (
    <section id="services" className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 md:py-32">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} className="mx-auto" />

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
          >
            <CardSpotlight className="h-full rounded-2xl p-6">
              <div className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Icon>{s.icon}</Icon>
                  <h3 className="text-base font-semibold text-foreground-principal">{s.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-foreground-secondary">{s.description}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {s.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-foreground-icons"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
