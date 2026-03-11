'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import StackList from '../components/StackList'
import { useLanguage } from '../context/LanguageContext'

export default function Projects() {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null)
  const { language } = useLanguage()

  const projects = [
  {
    img: "/ulpan.png",
    name: "Ulpán",
    period: language === "EN" ? "2026 - Present" : "2026 - Presente",
    description: language === "EN"
      ? "Web application for the academic and administrative management of a language institute, with a centralized dashboard for Admin, Staff and Student roles. I joined at an advanced stage, contributing to enrollment logic, level assessment and role management within an established MVC architecture."
      : "Aplicación web para la gestión académica y administrativa de una institución de idiomas, con panel centralizado para roles Admin, Staff y Student. Me incorporé en una etapa avanzada, contribuyendo en lógica de inscripción, niveles mediante exámenes y gestión de roles dentro de una arquitectura MVC establecida.",
    stack: ["PHP", "Laravel", "MySQL", "JavaScript", "Node.js"],
    link: "https://ulpanim.org/",
  },
  {
    img: "/laliga.png",
    gif: "/giflaliga.gif",
    name: "La Liga",
    period: language === "EN" ? "2026 - Present" : "2026 - Presente",
    description: language === "EN"
      ? "Web application for managing a football school — institutions, matches and fixture generation — with a complementary mobile app. Built under Clean Architecture and Functional Programming principles in a monorepo with yarn workspaces."
      : "Aplicación web para gestión de una escuela de fútbol — instituciones, encuentros y generación de fixtures — con app mobile complementaria. Desarrollada bajo principios de Arquitectura Limpia y Programación Funcional en monorepo con yarn workspaces.",
    stack: ["TypeScript", "React", "Node.js", "Express", "SQLite", "Prisma"],
    link: "#",
  },
  {
    img: "/amia.png",
    name: "AMIA",
    period: "2025 - 2026",
    description: language === "EN"
      ? "Multi-tenant recruiting platform built on a microservices architecture. Joined as a trainee and progressively took on greater responsibilities: developed use cases with tests, created entities, worked with migrations, and closed 6 sprints resolving the team's pending tasks."
      : "Plataforma multi-tenant de recruiting desarrollada en microservicios. Ingresé como trainee y fui asumiendo responsabilidades progresivamente: desarrollé casos de uso con tests, creé entidades, trabajé con migraciones y cerré 6 sprints resolviendo tareas pendientes del equipo.",
    stack: ["TypeScript", "React", "Node.js", "Express", "SQLite", "TypeORM"],
    link: "#",
  },
  {
    img: "/keytodream.png",
    name: "Key To Dream",
    period: "2024 - 2025",
    description: language === "EN"
      ? "Academic project developed during the Full Stack program at Digital House. An interactive real estate platform featuring 3D animations and a secure login system. Selected as one of the top projects of the course."
      : "Proyecto académico desarrollado durante el programa Full Stack en Digital House. Plataforma inmobiliaria interactiva con animaciones 3D y sistema de login seguro. Seleccionado como uno de los mejores proyectos del curso.",
    stack: ["React", "Express", "MySQL", "Tailwind"],
    link: "https://keytodream.vercel.app/",
  },
]

  const t = {
    header:     language === "EN" ? "Projects"        : "Proyectos",
    comingSoon: language === "EN" ? "More coming soon" : "Más próximamente",
    stack:      language === "EN" ? "Stack"            : "Stack",
    visit:      language === "EN" ? "Visit project →"  : "Ver proyecto →",
  }

  const active = projects[selected]

  const handleClick = (i: number) => {
    setSelected(i)
    setAccordionOpen(prev => prev === i ? null : i)
  }

  return (
    <section className="flex flex-col lg:flex-row h-screen overflow-hidden divide-y divide-border lg:divide-y-0 lg:divide-x">

      {/* ── LISTA (mobile + tablet: full width | desktop: 2/5) ── */}
      <div
        className="flex flex-col lg:w-2/5 divide-y divide-border overflow-y-auto"
        onMouseLeave={() => setHovered(null)}
      >
        <div className="px-4 py-3 md:px-6">
          <h3 className="text-xs text-foreground-secondary font-medium uppercase tracking-widest">
            {t.header}
          </h3>
        </div>

        {projects.map((project, i) => (
          <div key={i} className="flex flex-col">

            {/* Fila */}
            <div
              onClick={() => handleClick(i)}
              onMouseEnter={() => setHovered(i)}
              className="relative flex items-center gap-4 px-4 py-4 md:px-6 cursor-pointer"
            >
              {(hovered === i || (hovered === null && selected === i)) && (
                <motion.div
                  layoutId="project-hover"
                  className="absolute inset-0 bg-white/5"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <div className={`absolute left-0 top-3 bottom-3 w-[2px] bg-foreground-icons duration-200 z-10
                ${selected === i || hovered === i ? "opacity-100" : "opacity-0"}
              `} />
              <div className="relative z-10 w-20 h-14 flex-shrink-0 overflow-hidden border border-border">
                <img
                  src={project.img}
                  alt={project.name}
                  className={`w-full h-full object-cover transition-[filter] duration-300
                    ${selected === i || hovered === i ? "grayscale-0" : "grayscale"}
                  `}
                />
              </div>
              <div className="relative z-10 flex flex-col gap-0.5 min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate duration-200
                  ${selected === i || hovered === i ? "text-foreground-principal" : "text-foreground-secondary"}
                `}>
                  {project.name}
                </p>
                <p className="text-xs text-foreground-icons font-mono">{project.period}</p>
                <StackList stack={project.stack} />
              </div>
              {/* Flecha: ↓/↑ en mobile+tablet, → en desktop */}
              <span className={`relative z-10 ml-auto text-foreground-icons shrink-0 duration-200
                ${selected === i || hovered === i ? "opacity-100" : "opacity-0"}
              `}>
                <span className="hidden lg:inline">→</span>
                <span className="lg:hidden">
                  {accordionOpen === i ? "↑" : "↓"}
                </span>
              </span>
            </div>

            {/* ── Acordeón (mobile + tablet) ── */}
            <AnimatePresence>
              {accordionOpen === i && (
                <motion.div
                  key={`accordion-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="lg:hidden flex flex-col overflow-hidden border-t border-border"
                >
                  {/* Imagen */}
                  <div className="relative w-full overflow-hidden flex-shrink-0" style={{ height: "200px" }}>
                    <img
                      src={project.img}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {project.gif && (
                      <img
                        src={project.gif}
                        alt={`${project.name} preview`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 duration-500"
                      />
                    )}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to top, #0e0e0e 0%, transparent 60%)" }}
                    />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest mb-0.5">
                        {project.period}
                      </p>
                      <h2 className="text-xl font-semibold text-foreground-principal leading-none">
                        {project.name}
                      </h2>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-3 p-4 md:p-5">
                    <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.stack}</span>
                      <div className="flex gap-2 flex-wrap">
                        {project.stack.map((tech) => (
                          <span key={tech} className="text-xs text-foreground-icons border border-border px-2 py-0.5 font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.link && project.link !== "#" && (
                      
                      <a href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group/btn self-start flex items-center gap-2 text-xs text-foreground-secondary border border-border px-4 py-2 hover:bg-white/5 active:bg-white/5 duration-200"
                      >
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-foreground-icons opacity-0 group-hover/btn:opacity-100 duration-200" />
                        {t.visit}
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ))}

        {/* Coming soon */}
        <div className="relative flex items-center gap-4 px-4 py-4 md:px-6 opacity-40">
          <div className="w-20 h-14 flex-shrink-0 border border-dashed border-border flex items-center justify-center">
            <span className="text-foreground-icons text-lg">+</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground-secondary">{t.comingSoon}</p>
            <p className="text-xs text-foreground-icons font-mono">2026</p>
          </div>
        </div>
      </div>

      {/* ── DETALLE DESKTOP ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="hidden lg:flex flex-col lg:flex-1 overflow-hidden"
        >
          <div className="relative flex-[2] overflow-hidden group">
            <img
              src={active.img}
              alt={active.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "translateZ(0)" }}
            />
            {active.gif && (
              <img
                src={active.gif}
                alt={`${active.name} preview`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 duration-500"
              />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, #0e0e0e 0%, transparent 60%)" }}
            />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest mb-1">
                {active.period}
              </p>
              <h2 className="text-3xl font-semibold text-foreground-principal leading-none">
                {active.name}
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6 border-t border-border flex-[1]">
            <p className="text-sm text-foreground-secondary leading-relaxed">{active.description}</p>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.stack}</span>
              <div className="flex gap-2 flex-wrap">
                {active.stack.map((tech) => (
                  <span key={tech} className="text-xs text-foreground-icons border border-border px-2 py-0.5 font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {active.link && active.link !== "#" && (
              
              <a href={active.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group/btn self-start flex items-center gap-2 text-xs text-foreground-secondary border border-border px-4 py-2 hover:bg-white/5 duration-200 mt-auto"
              >
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-foreground-icons opacity-0 group-hover/btn:opacity-100 duration-200" />
                {t.visit}
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

    </section>
  )
}