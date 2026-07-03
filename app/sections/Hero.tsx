'use client'
import { motion } from 'motion/react'
import { TextGenerateEffect } from '@/app/components/text-generate-effect'
import { useLanguage } from '@/app/context/LanguageContext'
import { Badge } from '@/app/components/ui/Badge'
import { GridBackground } from '@/app/components/ui/GridBackground'
import { Spotlight } from '@/app/components/ui/Spotlight'
import { CTAButton } from '@/app/components/ui/CTAButton'

export default function Hero() {
  const { language } = useLanguage()

  const bio =
    language === 'EN'
      ? `I plan and design the full flow of features before implementing them, focused on best practices and maintainable code.`
      : `Planifico y diseño el flujo completo de las funcionalidades antes de implementarlas, con foco en buenas prácticas y código mantenible.`

  const highlights =
    language === 'EN' ? ['best', 'practices', 'maintainable', 'code.'] : ['buenas', 'prácticas', 'código', 'mantenible.']

  const stats = [
    { value: '1+', label: language === 'EN' ? 'Year of experience' : 'Año de experiencia' },
    { value: '3', label: language === 'EN' ? 'Production projects' : 'Proyectos en producción' },
    { value: 'C1', label: language === 'EN' ? 'English level' : 'Nivel de inglés' },
  ]

  const t = {
    available: language === 'EN' ? 'Available for work' : 'Disponible para trabajar',
    greeting: language === 'EN' ? "Hi, I'm Alexandro Lucero" : 'Hola, soy Alexandro Lucero',
    headline:
      language === 'EN'
        ? 'I build reliable full-stack web applications.'
        : 'Construyo aplicaciones web full-stack confiables.',
    role: language === 'EN' ? '// Full Stack Software Engineer' : '// Desarrollador Full Stack',
    contact: language === 'EN' ? 'Contact me' : 'Contactame',
    resume: language === 'EN' ? 'Resume →' : 'Currículum →',
  }

  const resumeHref =
    language === 'EN' ? '/AlexandroLuceroCV-English-3-26.docx.pdf' : '/AlexandroLuceroCV-Spanish-3-26.docx.pdf'

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20">
      {/* Fondos */}
      <GridBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left"
        >
          <Badge dot>{t.available}</Badge>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-sm text-foreground-secondary">{t.greeting}</span>
            <h1 className="text-gradient text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              {t.headline}
            </h1>
            <p className="font-mono text-sm text-accent-foreground/80 md:text-base">{t.role}</p>
          </div>

          <TextGenerateEffect
            words={bio}
            highlights={highlights}
            duration={0.4}
            className="max-w-md text-sm md:text-base"
          />

          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            <CTAButton href="/contact" variant="primary">
              {t.contact}
            </CTAButton>
            <CTAButton href={resumeHref} external variant="secondary">
              {t.resume}
            </CTAButton>
          </div>

          <div className="mt-2 flex gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-semibold text-foreground-principal lg:text-3xl">{value}</span>
                <span className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground-icons">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Foto enmarcada con glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="group relative w-full max-w-sm">
            <Spotlight className="-inset-8 h-[110%] w-[110%]" fill="rgba(255,255,255,0.07)" />
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-border bg-background-card backdrop-blur-sm lg:h-[500px]">
              <GridBackground variant="grid-sm" className="opacity-60" />
              <img
                src="/full-front-profile.png"
                alt="Alexandro Lucero"
                className="absolute bottom-0 left-1/2 h-[95%] w-auto -translate-x-1/2 grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 45%)' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
