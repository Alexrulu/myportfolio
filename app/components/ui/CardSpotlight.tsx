'use client'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Card con un spotlight radial que sigue al cursor en hover.
 * Firma visual clásica de Aceternity UI.
 */
export default function CardSpotlight({
  children,
  className,
  color = 'rgba(99,102,241,0.18)',
  radius = 320,
}: {
  children: React.ReactNode
  className?: string
  color?: string
  radius?: number
}) {
  const mouseX = useMotionValue(-radius)
  const mouseY = useMotionValue(-radius)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative overflow-hidden border border-border bg-background-card backdrop-blur-sm',
        'transition-colors duration-300 hover:border-border-active/30',
        className
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 70%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
