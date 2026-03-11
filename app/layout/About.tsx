'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Button from '../components/Button'
import { TextGenerateEffect } from '../components/text-generate-effect'
import { useLanguage } from '../context/LanguageContext'

export default function About() {
  const [open, setOpen] = useState(false)
  const [hoveredService, setHoveredService] = useState<string | null>(null)
  const { language } = useLanguage()

  const bio = language === "EN"
  ? `I plan and design the full flow of features before implementing them, focusing on best practices and maintainable code. Responsible, organized, and committed to quality at every stage.`
  : `Planifico y diseño el flujo completo de las funcionalidades antes de implementarlas, con foco en buenas prácticas y código mantenible. Responsable, organizado y comprometido con la calidad en cada etapa.`

  const highlights = language === "EN"
  ? ["best practices", "maintainable code"]
  : ["buenas prácticas", "código mantenible"]

  const stats = [
    { value: "1+",  label: language === "EN" ? "Year of experience"    : "Año de experiencia" },
    { value: "3",   label: language === "EN" ? "Production projects"   : "Proyectos en producción" },
  ]

  const services = [
  {
    title: language === "EN" ? "Frontend Development" : "Desarrollo Frontend",
    description: language === "EN"
      ? "Responsive interfaces with React and Next.js, applying Clean Architecture and component-driven development with Storybook."
      : "Interfaces responsivas con React y Next.js, aplicando Arquitectura Limpia y desarrollo orientado a componentes con Storybook.",
  },
  {
    title: language === "EN" ? "Backend Development" : "Desarrollo Backend",
    description: language === "EN"
      ? "REST APIs and microservices with Node.js, Express and Laravel, using relational databases and TDD with Vitest."
      : "APIs REST y microservicios con Node.js, Express y Laravel, usando bases de datos relacionales y TDD con Vitest.",
  },
  {
    title: language === "EN" ? "DevOps & CI/CD" : "DevOps & CI/CD",
    description: language === "EN"
      ? "Application deployment with Docker, automated pipelines with GitHub Actions and GitLab CI in monorepo environments."
      : "Despliegue de aplicaciones con Docker, pipelines automatizados con GitHub Actions y GitLab CI en entornos monorepo.",
  },
]

  const t = {
    greeting:     language === "EN" ? "Hey there,"          : "Hola,",
    role:         language === "EN" ? "// Full Stack Developer" : "// Desarrollador Full Stack",
    contactBtn:   language === "EN" ? "Contact Me"          : "Contactame",
    resumeBtn:    language === "EN" ? "Resume →"            : "Currículum →",
    myServices:   language === "EN" ? "What I build"         : "Que construyo",
    servicesDesc: language === "EN"
      ? "Complete web solutions — from the interface your users see to the infrastructure that powers it."
      : "Soluciones web completas — desde la interfaz que ven tus usuarios hasta la infraestructura que la sostiene.",
    browseAll:    language === "EN" ? "Browse all →"        : "Ver todo →",
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden divide-y divide-border">

      {/* ── HERO ── */}
      <section className="relative flex-[3] overflow-hidden group/hero">

        {/* Foto */}
      <motion.img
        layoutId="profile-photo"
        src="/full-front-profile.png"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="
          absolute bottom-0 h-full w-auto cursor-pointer
          grayscale group-hover/hero:grayscale-0 transition-[filter] duration-500
          left-1/2 -translate-x-1/3
          md:left-auto md:translate-x-0 md:right-0
          lg:right-1/5
        "
        style={{
          transform: "translateZ(0)",
          maskImage: "linear-gradient(to right, transparent 0%, black 30%), linear-gradient(to top, transparent 0%, black 20%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%), linear-gradient(to top, transparent 0%, black 20%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

{/* Sacar el div de gradiente — ya no hace falta */}

        {/* Gradiente — mobile y tablet necesitan legibilidad */}
        <div
          className="absolute inset-0 lg:hidden pointer-events-none"
          style={{
            background: "linear-gradient(to right, #0e0e0e 40%, rgba(14,14,14,0.7) 65%, transparent 100%), linear-gradient(to top, #0e0e0e 15%, transparent 45%)",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full p-6 gap-2 md:p-8 lg:p-10">

          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">
              {t.greeting}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground-principal leading-none tracking-tight">
              Alexandro<br />Lucero
            </h1>
            <h2 className="text-xs font-mono text-foreground-secondary mt-0.5">
              {t.role}
            </h2>
          </div>

          {/* Bio + stats + botones */}
          <div className="flex flex-col gap-">
            <TextGenerateEffect
              words={bio}
              duration={0.4}
              highlights={highlights}
              className="text-xs md:w-2/3 lg:w-2/5"
            />

            {/* Stats mobile — fila horizontal */}
            <div className="flex md:hidden gap-5">
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-semibold text-foreground-principal leading-none">{value}</span>
                  <span className="text-[9px] font-mono text-foreground-icons uppercase tracking-widest leading-tight mt-0.5">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between">
              <div className="flex gap-2 flex-wrap">
                <Button>{t.contactBtn}</Button>
                <Button>{t.resumeBtn}</Button>
              </div>

              {/* Stats tablet/desktop — columna derecha */}
              <div className="hidden md:flex flex-col gap-2 lg:gap-3 items-end">
                {stats.map(({ value, label }) => (
                  <div key={label} className="flex flex-col items-end">
                    <span className="text-2xl lg:text-4xl font-semibold text-foreground-principal leading-none">
                      {value}
                    </span>
                    <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ── SERVICES ── */}
      <section className="flex flex-col md:flex-row divide-y divide-border md:divide-y-0 md:divide-x flex-[2] overflow-hidden">

        {/* Columna intro — tablet más angosta, desktop normal */}
        <div className="hidden md:flex flex-col justify-between md:p-4 lg:p-6 md:w-1/4 lg:w-1/3 border-r border-border">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl lg:text-2xl font-semibold text-foreground-principal leading-tight">
              {t.myServices}
            </h2>
            {/* Descripción solo en desktop — tablet no tiene espacio */}
            <p className="hidden lg:block text-xs text-foreground-secondary leading-relaxed">
              {t.servicesDesc}
            </p>
          </div>
          <Button className="self-start">{t.browseAll}</Button>
        </div>

        {/* Services list */}
        <div
          className="flex flex-col md:flex-row md:divide-x divide-border md:flex-1 overflow-y-auto md:overflow-hidden"
          onMouseLeave={() => setHoveredService(null)}
        >
        
          {services.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredService(s.title)}
              className="relative flex flex-col justify-between gap-2 p-5 md:p-4 lg:p-6 duration-200 cursor-pointer md:flex-1 border-b border-border md:border-b-0 last:border-b-0"
            >
              {hoveredService === s.title && (
                <motion.div
                  layoutId="service-hover"
                  className="absolute inset-0 bg-white/5"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <div className={`absolute left-0 top-3 bottom-3 w-0.5 bg-foreground-icons duration-200 z-10
                ${hoveredService === s.title ? "opacity-100" : "opacity-0"}
              `} />
              <div className="relative z-10 flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-foreground-icons">0{i + 1}</span>
                    <p className="text-xs font-semibold text-foreground-principal">{s.title}</p>
                  </div>
                  <p className="text-xs text-foreground-secondary leading-relaxed">{s.description}</p>
                </div>
                <span className={`text-sm duration-200 flex-shrink-0
                  ${hoveredService === s.title ? "text-foreground-secondary" : "text-foreground-icons"}
                `}>→</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ── OVERLAY foto expandida ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm cursor-pointer"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.img
                layoutId="profile-photo"
                src="/full-front-profile.png"
                onClick={() => setOpen(true)}
                className="absolute right-0 top-0 h-full w-1/2 object-contain object-right cursor-pointer"
              />
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}