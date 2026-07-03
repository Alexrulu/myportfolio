'use client'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/** Encabezado de sección: eyebrow + título con gradiente + subtítulo, con reveal al hacer scroll. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent-foreground/70">
          {eyebrow}
        </span>
      )}
      <h2 className="text-gradient max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'max-w-xl text-sm leading-relaxed text-foreground-secondary md:text-base',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
