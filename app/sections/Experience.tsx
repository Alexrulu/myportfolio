'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '@/app/context/LanguageContext'
import { SectionHeading } from '@/app/components/ui/SectionHeading'
import CardSpotlight from '@/app/components/ui/CardSpotlight'

export default function Experience() {
  const { language } = useLanguage()
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const education = [
    {
      degree: language === 'EN' ? 'University Technical Degree in Computer Science' : 'Tecnicatura Universitaria en Informática',
      institution: 'Universidad Nacional de General Sarmiento',
      period: language === 'EN' ? 'Mar 2024 — Present' : 'Mar 2024 — Actualidad',
      current: true,
    },
    {
      degree: language === 'EN' ? 'Advanced Full Stack Web Developer' : 'Programador Web Full Stack Avanzado',
      institution: 'ForIt Academy',
      period: language === 'EN' ? 'May 2025 — Aug 2025' : 'May 2025 — Ago 2025',
      current: false,
    },
    {
      degree: language === 'EN' ? 'Full Stack Web Developer' : 'Programador Web Full Stack',
      institution: 'Digital House + FORMAR',
      period: 'Sep 2024 — May 2025',
      current: false,
    },
  ]

  const languages = [
    { name: language === 'EN' ? 'Spanish' : 'Español', level: language === 'EN' ? 'Native' : 'Nativo', percent: 100 },
    { name: language === 'EN' ? 'English' : 'Inglés', level: 'C1', percent: 80 },
  ]

  const certifications = [
    {
      name: language === 'EN' ? 'Full Stack Web Developer' : 'Programador Web Full Stack',
      issuer: 'Digital House + FORMAR',
      year: '2025',
      img: '/fullstack-lvl1.png',
    },
    {
      name: language === 'EN' ? 'Advanced Full Stack Web Developer' : 'Programador Web Full Stack Avanzado',
      issuer: 'ForIt Academy',
      year: '2025',
      img: '/fullstack-lvl2.png',
    },
  ]

  const t = {
    eyebrow: language === 'EN' ? 'Background' : 'Trayectoria',
    title: language === 'EN' ? 'Always learning, always shipping' : 'Siempre aprendiendo, siempre construyendo',
    subtitle:
      language === 'EN'
        ? "Education, languages and certifications that back up how I work."
        : 'Formación, idiomas y certificaciones que respaldan cómo trabajo.',
    education: language === 'EN' ? 'Education' : 'Educación',
    languages: language === 'EN' ? 'Languages' : 'Idiomas',
    why: language === 'EN' ? 'Why I keep learning' : 'Por qué sigo aprendiendo',
    whyText:
      language === 'EN'
        ? "I'm focused on understanding system architecture deeply: building robust, scalable systems and becoming a more autonomous developer — grounded in fundamentals."
        : 'Estoy enfocado en comprender a fondo la arquitectura de sistemas: construir sistemas robustos y escalables, y ser cada vez más autónomo, sólido en los fundamentos.',
    certifications: language === 'EN' ? 'Certifications' : 'Certificaciones',
    current: language === 'EN' ? 'current' : 'actual',
    view: language === 'EN' ? 'View →' : 'Ver →',
  }

  return (
    <section id="experience" className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 md:py-32">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} className="mx-auto" />

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Educación */}
        <CardSpotlight className="rounded-2xl p-6 md:p-8">
          <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-icons">{t.education}</span>
          <div className="mt-5 flex flex-col">
            {education.map((e, i) => (
              <div key={e.degree} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border ${
                      e.current ? 'border-accent bg-accent' : 'border-foreground-icons'
                    }`}
                  />
                  {i < education.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
                </div>
                <div className={`flex flex-col gap-0.5 ${i < education.length - 1 ? 'pb-6' : ''}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground-principal">{e.degree}</p>
                    {e.current && (
                      <span className="rounded-full border border-accent/40 px-2 py-0 font-mono text-[10px] text-accent-foreground">
                        {t.current}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground-secondary">{e.institution}</p>
                  <p className="font-mono text-[11px] text-foreground-icons">{e.period}</p>
                </div>
              </div>
            ))}
          </div>
        </CardSpotlight>

        {/* Idiomas + Why */}
        <div className="flex flex-col gap-5">
          <CardSpotlight className="rounded-2xl p-6 md:p-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-icons">{t.languages}</span>
            <div className="mt-5 flex flex-col gap-5">
              {languages.map((l) => (
                <div key={l.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground-principal">{l.name}</span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-icons">{l.level}</span>
                  </div>
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-border">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardSpotlight>

          <CardSpotlight className="flex-1 rounded-2xl p-6 md:p-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-icons">{t.why}</span>
            <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">{t.whyText}</p>
          </CardSpotlight>
        </div>
      </div>

      {/* Certificaciones */}
      <div className="mt-5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-icons">{t.certifications}</span>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {certifications.map((c) => (
            <CardSpotlight
              key={c.name}
              className="group/cert cursor-pointer rounded-2xl"
            >
              <div onClick={() => setLightbox(c.img)} className="flex flex-col">
                <div className="relative h-48 overflow-hidden border-b border-border">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter] duration-500 group-hover/cert:grayscale-0"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/cert:opacity-100">
                    <span className="rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-[11px] text-foreground-principal backdrop-blur-sm">
                      {t.view}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-foreground-principal">{c.name}</p>
                    <p className="text-xs text-foreground-secondary">{c.issuer}</p>
                  </div>
                  <span className="font-mono text-[11px] text-foreground-icons">{c.year}</span>
                </div>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>

      {/* Lightbox — portal a body (escapa del transform del PageTransition) */}
      {mounted && createPortal(
        <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-[100] cursor-pointer bg-background/90 backdrop-blur-sm"
            />
            <motion.div
              key="lightbox"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-16"
            >
              <img
                src={lightbox}
                alt="Certificate"
                onClick={() => setLightbox(null)}
                className="pointer-events-auto max-h-full max-w-full rounded-xl border border-border object-contain"
              />
            </motion.div>
          </>
        )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}
