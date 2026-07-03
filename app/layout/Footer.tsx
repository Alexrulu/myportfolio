'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/app/context/LanguageContext'
import { GitHubIcon, LinkedInIcon, DownloadIcon } from '@/app/components/iconsList'
import { GridBackground } from '@/app/components/ui/GridBackground'

const EMAIL = 'alexandro71000@gmail.com'

export default function Footer() {
  const { language } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const links = [
    { label: language === 'EN' ? 'About' : 'Sobre mí', href: '/' },
    { label: language === 'EN' ? 'Services' : 'Servicios', href: '/services' },
    { label: language === 'EN' ? 'Projects' : 'Proyectos', href: '/projects' },
    { label: language === 'EN' ? 'Background' : 'Trayectoria', href: '/background' },
    { label: language === 'EN' ? 'Contact' : 'Contacto', href: '/contact' },
  ]

  const socials = [
    { icon: <GitHubIcon />, label: 'GitHub', href: 'https://github.com/Alexrulu' },
    { icon: <LinkedInIcon />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexandrolucero/' },
    {
      icon: <DownloadIcon />,
      label: language === 'EN' ? 'Resume' : 'Currículum',
      href: language === 'EN' ? '/AlexandroLuceroCV-English-3-26.docx.pdf' : '/AlexandroLuceroCV-Spanish-3-26.docx.pdf',
    },
  ]

  const t = {
    tagline:
      language === 'EN'
        ? 'Full Stack Software Engineer building reliable web applications.'
        : 'Desarrollador Full Stack que construye aplicaciones web confiables.',
    navigate: language === 'EN' ? 'Navigate' : 'Navegación',
    connect: language === 'EN' ? 'Connect' : 'Conectar',
    emailLabel: copied ? (language === 'EN' ? 'Copied!' : '¡Copiado!') : language === 'EN' ? 'Copy email' : 'Copiar correo',
    rights: language === 'EN' ? 'All rights reserved.' : 'Todos los derechos reservados.',
  }

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <GridBackground className="opacity-50" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
              <span className="text-base font-semibold text-foreground-principal">Alexandro Lucero</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-foreground-secondary">{t.tagline}</p>
            <button
              onClick={handleCopy}
              className="mt-1 w-fit font-mono text-xs text-foreground-icons transition-colors hover:text-foreground-principal"
            >
              {t.emailLabel} · {EMAIL}
            </button>
          </div>

          {/* Navegación */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-icons">{t.navigate}</span>
            <ul className="flex flex-col gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-foreground-secondary transition-colors hover:text-foreground-principal">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-icons">{t.connect}</span>
            <ul className="flex flex-col gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 text-sm text-foreground-secondary transition-colors hover:text-foreground-principal"
                  >
                    <span className="flex h-4 w-4 items-center justify-center text-foreground-icons transition-colors group-hover:text-foreground-principal">
                      {s.icon}
                    </span>
                    {s.label}
                    <span className="text-xs text-foreground-icons">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-foreground-icons">
            © {new Date().getFullYear()} Alexandro Lucero. {t.rights}
          </p>
          <Link
            href="/views/easteregg"
            prefetch={false}
            className="font-mono text-[11px] tracking-widest text-foreground-icons transition-colors hover:text-foreground-secondary"
          >
            ???
          </Link>
        </div>
      </div>
    </footer>
  )
}
