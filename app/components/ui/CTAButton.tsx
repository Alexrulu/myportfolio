'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap'

const variants = {
  primary:
    'bg-foreground-principal text-background hover:bg-white hover:shadow-[0_0_28px_rgba(255,255,255,0.20)]',
  secondary:
    'border border-border bg-background-card text-foreground-secondary backdrop-blur-sm hover:text-foreground-principal hover:border-border-active/40 hover:bg-white/[0.06]',
  glow:
    'border border-accent/40 bg-accent/10 text-accent-foreground backdrop-blur-sm hover:bg-accent/20 hover:shadow-[0_0_28px_rgba(99,102,241,0.30)]',
} as const

export function CTAButton({
  children,
  href,
  external = false,
  onClick,
  variant = 'primary',
  className,
}: {
  children: React.ReactNode
  href?: string
  external?: boolean
  onClick?: (e: React.MouseEvent) => void
  variant?: keyof typeof variants
  className?: string
}) {
  const classes = cn(base, variants[variant], className)

  if (href) {
    const isExternal = external || href.startsWith('http') || href.endsWith('.pdf')
    const isAnchor = href.startsWith('#')
    if (isExternal || isAnchor) {
      return (
        <a
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={classes}
          onClick={onClick}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
