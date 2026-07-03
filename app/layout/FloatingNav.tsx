'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '@/app/context/LanguageContext'
import { CTAButton } from '@/app/components/ui/CTAButton'
import { cn } from '@/lib/utils'

export default function FloatingNav() {
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: language === 'EN' ? 'About' : 'Sobre mí', href: '/' },
    { label: language === 'EN' ? 'Services' : 'Servicios', href: '/services' },
    { label: language === 'EN' ? 'Projects' : 'Proyectos', href: '/projects' },
    { label: language === 'EN' ? 'Background' : 'Trayectoria', href: '/background' },
    { label: language === 'EN' ? 'Contact' : 'Contacto', href: '/contact' },
  ]

  const contactLabel = language === 'EN' ? 'Contact me' : 'Contactame'

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        className={cn(
          'mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border px-3 py-2 transition-all duration-300 md:px-4',
          scrolled
            ? 'border-border bg-background/70 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl'
            : 'border-border/60 bg-background/40 backdrop-blur-md'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 pl-2">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
          <span className="text-sm font-semibold text-foreground-principal">Alexandro Lucero</span>
        </Link>

        {/* Links desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'relative block rounded-full px-3 py-1.5 text-sm transition-colors',
                    active
                      ? 'text-foreground-principal'
                      : 'text-foreground-secondary hover:bg-white/[0.06] hover:text-foreground-principal'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/[0.08]"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2">
          {/* Toggle idioma */}
          <div className="hidden items-center rounded-full border border-border p-0.5 sm:flex">
            {(['EN', 'ES'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  'relative rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors',
                  language === lang ? 'text-foreground-principal' : 'text-foreground-icons hover:text-foreground-secondary'
                )}
              >
                {language === lang && (
                  <motion.span
                    layoutId="lang-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.08]"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{lang}</span>
              </button>
            ))}
          </div>

          <CTAButton href="/contact" variant="primary" className="hidden px-4 py-2 text-[13px] sm:inline-flex">
            {contactLabel}
          </CTAButton>

          {/* Hamburger mobile */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border lg:hidden"
          >
            <div className="relative h-3.5 w-4">
              <motion.span
                animate={open ? { rotate: 45, top: '50%' } : { rotate: 0, top: '15%' }}
                className="absolute left-0 h-[1.5px] w-full -translate-y-1/2 bg-foreground-secondary"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-foreground-secondary"
              />
              <motion.span
                animate={open ? { rotate: -45, top: '50%' } : { rotate: 0, top: '85%' }}
                className="absolute left-0 h-[1.5px] w-full -translate-y-1/2 bg-foreground-secondary"
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Menú mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border border-border bg-background/90 p-2 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l) => {
                const active = pathname === l.href
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block rounded-2xl px-4 py-3 text-sm transition-colors',
                        active
                          ? 'bg-white/[0.06] text-foreground-principal'
                          : 'text-foreground-secondary hover:bg-white/[0.06] hover:text-foreground-principal'
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-border px-2 pt-3">
              <div className="flex items-center rounded-full border border-border p-0.5">
                {(['EN', 'ES'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      'rounded-full px-3 py-1 font-mono text-[11px] transition-colors',
                      language === lang ? 'bg-white/[0.08] text-foreground-principal' : 'text-foreground-icons'
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <CTAButton href="/contact" variant="primary" onClick={() => setOpen(false)} className="px-4 py-2 text-[13px]">
                {contactLabel}
              </CTAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
