'use client'
import { motion } from 'motion/react'
import { useLanguage } from '@/app/context/LanguageContext'
import { SectionHeading } from '@/app/components/ui/SectionHeading'
import CardSpotlight from '@/app/components/ui/CardSpotlight'

export default function Testimonials() {
  const { language } = useLanguage()

  const testimonials = [
    {
      quote:
        language === 'EN'
          ? 'Working with Alexandro stood out for the passion he shows for his profession. He enjoys tackling new challenges and always takes on the most complex tasks with enthusiasm.'
          : 'Trabajar con Alexandro destacó por la pasión que demuestra por su profesión. Disfruta enfrentar nuevos desafíos y siempre asume las tareas más complejas con entusiasmo.',
      name: language === 'EN' ? 'Former Tech Lead' : 'Ex Líder Técnico',
      role: 'ForIt Software Factory',
    },
    {
      quote:
        language === 'EN'
          ? 'A very responsible and organized person — qualities reflected in the quality of his work and in his commitment to the projects he participates in.'
          : 'Una persona muy responsable y organizada, cualidades que se reflejan en la calidad de su trabajo y en su compromiso con los proyectos en los que participa.',
      name: language === 'EN' ? 'Former Tech Lead' : 'Ex Líder Técnico',
      role: 'ForIt Software Factory',
    },
  ]

  const t = {
    eyebrow: language === 'EN' ? 'Testimonials' : 'Testimonios',
    title: language === 'EN' ? 'What people say about working with me' : 'Lo que dicen de trabajar conmigo',
  }

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} className="mx-auto" />

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
        {testimonials.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
          >
            <CardSpotlight className="h-full rounded-2xl p-7 md:p-8">
              <div className="flex h-full flex-col gap-5">
                <span className="font-mono text-2xl leading-none text-accent-foreground/60">&ldquo;</span>
                <p className="flex-1 text-sm leading-relaxed text-foreground-secondary md:text-base">{item.quote}</p>
                <div className="flex flex-col gap-0.5 border-t border-border pt-4">
                  <span className="text-sm font-semibold text-foreground-principal">{item.name}</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-icons">
                    {item.role}
                  </span>
                </div>
              </div>
            </CardSpotlight>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
