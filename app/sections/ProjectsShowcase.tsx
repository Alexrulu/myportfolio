'use client'
import { useLanguage } from '@/app/context/LanguageContext'
import { cn } from '@/lib/utils'

export default function ProjectsShowcase() {
  const { language } = useLanguage()

  const projects = [
    {
      img: '/ulpan.png',
      name: 'Ulpán',
      period: language === 'EN' ? '2026 — Present' : '2026 — Presente',
      description:
        language === 'EN'
          ? 'Web app for the academic and administrative management of a language institute, with a centralized dashboard for Admin, Staff and Student roles.'
          : 'Aplicación web para la gestión académica y administrativa de una institución de idiomas, con panel centralizado para roles Admin, Staff y Student.',
      stack: ['PHP', 'Laravel', 'MySQL', 'Node.js'],
      link: 'https://ulpanim.org/',
    },
    {
      img: '/laliga.png',
      name: 'La Liga',
      period: language === 'EN' ? '2026 — Present' : '2026 — Presente',
      description:
        language === 'EN'
          ? 'Football-school management app — institutions, matches and fixtures — with a companion mobile app. Clean Architecture in a monorepo.'
          : 'App de gestión de una escuela de fútbol — instituciones, encuentros y fixtures — con app mobile. Arquitectura Limpia en monorepo.',
      stack: ['TypeScript', 'React', 'Node.js', 'Prisma'],
      link: '#',
    },
    {
      img: '/amia.png',
      name: 'AMIA',
      period: '2025 — 2026',
      description:
        language === 'EN'
          ? 'Multi-tenant recruiting platform on a microservices architecture. Use cases with tests, entities and migrations across 6 closed sprints.'
          : 'Plataforma multi-tenant de recruiting en microservicios. Casos de uso con tests, entidades y migraciones en 6 sprints cerrados.',
      stack: ['TypeScript', 'React', 'Express', 'TypeORM'],
      link: '#',
    },
    {
      img: '/keytodream.png',
      name: 'Key To Dream',
      period: '2024 — 2025',
      description:
        language === 'EN'
          ? 'Academic project at Digital House: an interactive real-estate platform with 3D animations and secure login. Selected as a top project.'
          : 'Proyecto académico en Digital House: plataforma inmobiliaria interactiva con animaciones 3D y login seguro. Seleccionado entre los mejores.',
      stack: ['React', 'Express', 'MySQL', 'Tailwind'],
      link: 'https://keytodream.vercel.app/',
    },
  ]

  const t = {
    title: language === 'EN' ? 'Projects' : 'Proyectos',
    view: language === 'EN' ? 'View project' : 'Ver proyecto',
  }

  // Bento asimétrico: ancho-angosto / angosto-ancho (grilla de 5 columnas).
  const spans = ['lg:col-span-3', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-3']

  return (
    <section
      id="projects"
      className="relative mx-auto w-full max-w-6xl scroll-mt-24 overflow-hidden px-6 pb-24 pt-36"
    >
      {/* Marca de agua — en flujo; el grid la solapa sólo por abajo */}
      <h2
        className="pointer-events-none select-none text-center font-bold leading-none text-foreground-principal/5"
        style={{ fontSize: 'clamp(4rem, 15vw, 13rem)' }}
      >
        {t.title}
      </h2>

      {/* Bento grid */}
      <div className="relative z-10 -mt-8 grid grid-cols-1 gap-4 sm:-mt-12 lg:-mt-16 lg:grid-cols-5">
        {projects.map((p, i) => {
          const isLink = Boolean(p.link && p.link !== '#')
          const Wrapper: React.ElementType = isLink ? 'a' : 'div'
          return (
            <Wrapper
              key={p.name}
              {...(isLink ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={cn(
                'group relative block h-72 overflow-hidden rounded-3xl border border-border bg-background-card lg:h-80',
                spans[i],
                isLink && 'cursor-pointer'
              )}
            >
              <img
                src={p.img}
                alt={p.name}
                className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 lg:group-hover:scale-105 lg:group-hover:blur-md lg:group-hover:brightness-50"
              />

              {/* Caption permanente — mobile/tablet (sin hover) */}
              <div className="absolute inset-x-0 bottom-0 p-5 lg:hidden">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="relative">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">{p.period}</p>
                  <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                </div>
              </div>

              {/* Overlay al hover — desktop */}
              <div className="absolute inset-0 hidden flex-col justify-between p-7 opacity-0 transition-opacity duration-500 lg:flex lg:group-hover:opacity-100">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
                <div className="relative translate-y-3 transition-transform duration-500 group-hover:translate-y-0">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-white/60">{p.period}</p>
                  <h3 className="mt-1.5 text-2xl font-semibold text-white">{p.name}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">{p.description}</p>
                </div>
                <div className="relative flex items-end justify-between gap-4 translate-y-3 transition-transform duration-500 group-hover:translate-y-0">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white">
                    {isLink ? `${t.view} →` : ''}
                  </span>
                  <span className="text-right font-mono text-[11px] text-white/55">{p.stack.join(' · ')}</span>
                </div>
              </div>
            </Wrapper>
          )
        })}
      </div>
    </section>
  )
}
