'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from "../components/Icon"
import { BackendIcon, DevOpsIcon, FrontendIcon } from "../components/iconsList"
import { useLanguage } from '../context/LanguageContext'

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
)

export default function Expertise() {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const { language } = useLanguage()

  const expertise = [
    {
      icon: <FrontendIcon />,
      title: "Frontend",
      stack: ["React", "Next.js", "Astro", "Tailwind", "Motion", "ThreeJS"],
    },
    {
      icon: <BackendIcon />,
      title: "Backend",
      stack: ["Node.js", "Express", "Laravel", "PHP", "MySQL", "SQLite"],
    },
    {
      icon: <DevOpsIcon />,
      title: "DevOps & CI/CD",
      stack: ["Docker", "GitHub", "GitLab"],
    },
  ]

  const languages = [
  { name: language === "EN" ? "Spanish" : "Español", level: language === "EN" ? "Native"   : "Nativo", percent: 100 },
  { name: language === "EN" ? "English" : "Inglés",  level: "C1",                                       percent: 80  },
]

  const education = [
  {
    institution: "Universidad Nacional de General Sarmiento",
    degree: language === "EN" ? "University Technical Degree in Computer Science" : "Tecnicatura Universitaria en Informática",
    period: language === "EN" ? "March 2024 — Present" : "Marzo 2024 — Actualidad",
    description: language === "EN"
      ? "Focused on software engineering, algorithms, databases and system design."
      : "Enfocado en ingeniería de software, algoritmos, bases de datos y diseño de sistemas.",
    current: true,
  },
  {
    institution: "Digital House + FORMAR",
    degree: language === "EN" ? "Full Stack Web Developer" : "Programador Web Full Stack",
    period: language === "EN" ? "Sep 2024 — May 2025" : "Sep 2024 — May 2025",
    description: language === "EN"
      ? "Intensive full stack program covering frontend, backend and deployment."
      : "Programa intensivo full stack cubriendo frontend, backend y despliegue.",
    current: false,
  },
  {
    institution: "ForIt Academy",
    degree: language === "EN" ? "Advanced Full Stack Web Developer" : "Programador Web Full Stack Avanzado",
    period: language === "EN" ? "May 2025 — Aug 2025" : "May 2025 — Ago 2025",
    description: language === "EN"
      ? "Advanced program focused on clean architecture, TDD and professional workflows."
      : "Programa avanzado enfocado en arquitectura limpia, TDD y flujos de trabajo profesionales.",
    current: false,
  },
]

  const certifications = [
  {
    name: language === "EN" ? "Full Stack Web Developer"          : "Programador Web Full Stack",
    issuer: "Digital House + FORMAR",
    year: "2025",
    img: "/fullstack-lvl1.png"
  },
  {
    name: language === "EN" ? "Advanced Full Stack Web Developer" : "Programador Web Full Stack Avanzado",
    issuer: "ForIt Academy",
    year: "2025",
    img: "/fullstack-lvl2.png"
  },
]

  const t = {
    header:         language === "EN" ? "Expertise"           : "Habilidades",
    skills:         language === "EN" ? "Skills"              : "Tecnologías",
    languages:      language === "EN" ? "Languages"           : "Idiomas",
    education:      language === "EN" ? "Education"           : "Educación",
    whyTitle: language === "EN" ? "Why I keep learning" : "Por qué sigo aprendiendo",
whyP1: language === "EN"
  ? "Programming keeps my mind constantly engaged — every problem is a logic challenge that sharpens how I think."
  : "Programar mantiene mi mente en constante movimiento — cada problema es un desafío de lógica que agudiza mi forma de pensar.",
whyP2: language === "EN"
  ? "Right now I'm focused on truly understanding system architecture: building robust, scalable systems and becoming a more autonomous developer — less dependent on shortcuts, more grounded in fundamentals."
  : "Hoy estoy enfocado en comprender a fondo la arquitectura de sistemas: construir sistemas robustos y escalables, y ser cada vez más autónomo — menos dependiente de atajos, más sólido en los fundamentos.",
    certifications: language === "EN" ? "Certifications"      : "Certificaciones",
    current:        language === "EN" ? "current"             : "actual",
    view:           language === "EN" ? "View →"              : "Ver →",
  }

  return (
    <div className="flex flex-col divide-y divide-border lg:h-screen lg:overflow-hidden overflow-y-auto border-b border-border">

      {/* Header */}
      <FadeIn delay={0} className="px-4 py-3 md:px-6 flex-shrink-0">
        <h3 className="text-xs text-foreground-secondary font-medium uppercase tracking-widest">
          {t.header}
        </h3>
      </FadeIn>

      {/* ── BLOQUE 1: Skills + Languages ── */}
      <FadeIn delay={0.1} className="flex flex-col md:flex-row md:divide-x md:divide-border md:flex-shrink-0 divide-y divide-border md:divide-y-0">

        <div className="flex flex-col divide-y divide-border md:flex-1 md:min-w-0">
          <div className="px-4 py-3 md:px-6">
            <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.skills}</span>
          </div>
          <div className="flex flex-col divide-y divide-border md:flex-row md:divide-y-0 md:divide-x md:flex-1">
            {expertise.map((item) => (
              <div key={item.title} className="relative group flex flex-row md:flex-col gap-4 md:gap-3 p-4 md:p-6 hover:bg-white/5 duration-200 md:flex-1">
                <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-foreground-icons opacity-0 group-hover:opacity-100 duration-200" />
                <div className="flex flex-col gap-2 flex-shrink-0 w-28 md:w-auto">
                  <div className="flex items-center gap-2.5">
                    <Icon>{item.icon}</Icon>
                    <p className="text-sm font-semibold text-foreground-principal">{item.title}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {item.stack.map((tech) => (
                    <span key={tech} className="text-xs md:text-sm text-foreground-secondary font-mono flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-foreground-icons flex-shrink-0" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-col divide-y divide-border md:w-44 lg:w-72 md:self-stretch">
          <div className="px-4 py-3 md:px-6">
            <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.languages}</span>
          </div>
          <div className="flex flex-col divide-y divide-border flex-1">
            {languages.map(({ name, level, percent }) => (
              <div key={name} className="flex flex-col gap-2 px-4 py-4 md:px-6">
                <div className="flex flex-row justify-between items-center md:flex-col md:items-start lg:flex-row lg:items-center lg:justify-between gap-0.5">
                  <span className="text-sm text-foreground-principal font-medium">{name}</span>
                  <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{level}</span>
                </div>
                <div className="h-[2px] w-full bg-border">
                  <div className="h-full bg-foreground-icons" style={{ width: `${percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </FadeIn>

      {/* ── BLOQUE 2: Education + Why ── */}
      <FadeIn delay={0.2} className="flex flex-col md:flex-row md:divide-x md:divide-border md:flex-shrink-0 divide-y divide-border md:divide-y-0">

        <div className="flex flex-col divide-y divide-border md:flex-1 md:min-w-0">
          <div className="px-4 py-3 md:px-6">
            <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.education}</span>
          </div>
          <div className="flex flex-col p-4 md:p-6 gap-0">
            {education.map((item, i) => (
              <div key={item.institution} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full border flex-shrink-0 mt-1 ${item.current ? "border-foreground-secondary bg-foreground-secondary" : "border-foreground-icons"}`} />
                  {i < education.length - 1 && <div className="w-[1px] bg-border flex-1 my-1.5" />}
                </div>
                <div className={`flex flex-col gap-1 ${i < education.length - 1 ? "pb-6" : ""}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground-principal">{item.degree}</p>
                    {item.current && (
                      <span className="text-[10px] font-mono border border-border text-foreground-icons px-1.5 py-0">{t.current}</span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-foreground-secondary">{item.institution}</p>
                  <p className="text-[10px] font-mono text-foreground-icons">{item.period}</p>
                  <p className="text-xs md:text-sm text-foreground-icons leading-relaxed mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why I keep learning */}
        <div className="flex flex-col divide-y divide-border md:w-44 lg:w-72 md:self-stretch">
          <div className="px-4 py-3 md:px-6">
            <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.whyTitle}</span>
          </div>
          <div className="flex flex-col gap-3 p-4 md:p-6">
            <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed">{t.whyP1}</p>
            <p className="text-xs md:text-sm text-foreground-icons leading-relaxed">{t.whyP2}</p>
          </div>
        </div>

      </FadeIn>

      {/* ── BLOQUE 3: Certifications ── */}
      <FadeIn delay={0.3} className="flex flex-col divide-y divide-border lg:flex-1 lg:min-h-0 md:min-h-64">
        <div className="px-4 py-3 md:px-6 flex-shrink-0">
          <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.certifications}</span>
        </div>

        {/* Mobile: scroll horizontal */}
        <div className="flex md:hidden gap-0 overflow-x-auto snap-x snap-mandatory">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              onClick={() => setLightbox(cert.img)}
              className="relative group flex flex-col gap-3 p-4 cursor-pointer flex-shrink-0 w-64 snap-start border-r border-border last:border-r-0"
            >
              <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-foreground-icons opacity-0 group-hover:opacity-100 duration-200" />
              <div className="relative overflow-hidden border border-border h-36">
                <img src={cert.img} alt={cert.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                  <span className="text-[10px] font-mono text-foreground-principal border border-border bg-background/80 px-2 py-1 backdrop-blur-sm">{t.view}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-foreground-principal">{cert.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-foreground-secondary">{cert.issuer}</p>
                  <p className="text-[10px] font-mono text-foreground-icons">{cert.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet + Desktop: columnas */}
        <div className="hidden md:flex md:flex-row md:divide-x md:divide-border md:items-stretch md:min-h-48 lg:flex-1 lg:min-h-0">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              onClick={() => setLightbox(cert.img)}
              className="relative group flex flex-col gap-3 p-4 md:p-6 hover:bg-white/5 duration-200 md:flex-1 cursor-pointer min-h-0 md:h-full"
            >
              <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-foreground-icons opacity-0 group-hover:opacity-100 duration-200" />
              <div className="relative overflow-hidden border border-border md:h-24 lg:h-auto lg:flex-1 lg:min-h-0 flex-shrink-0">
                <img src={cert.img} alt={cert.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                  <span className="text-[10px] font-mono text-foreground-principal border border-border bg-background/80 px-2 py-1 backdrop-blur-sm">{t.view}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <p className="text-sm font-semibold text-foreground-principal">{cert.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-foreground-secondary">{cert.issuer}</p>
                  <p className="text-[10px] font-mono text-foreground-icons">{cert.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={() => setLightbox(null)} className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm cursor-pointer" />
            <motion.div key="lightbox" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-8 md:p-16">
              <img src={lightbox} alt={language === "EN" ? "Certificate" : "Certificado"} onClick={() => setLightbox(null)} className="max-w-full max-h-full object-contain border border-border pointer-events-auto" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}