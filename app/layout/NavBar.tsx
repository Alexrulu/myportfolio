"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
  DownloadIcon, FolderIcon, GitHubIcon,
  HouseIcon, LinkedInIcon, MessageIcon, NotepadIcon,
} from "../components/iconsList"
import { useLanguage } from "../context/LanguageContext"

const EMAIL = "alexandro71000@gmail.com"

export default function NavBar() {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [hoveredSecondary, setHoveredSecondary] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  const navItems = [
    { icon: <HouseIcon />,   label: language === "EN" ? "About"      : "Sobre mí",    href: "/"                },
    { icon: <NotepadIcon />, label: language === "EN" ? "Expertise"  : "Habilidades", href: "/views/expertise" },
    { icon: <FolderIcon />,  label: language === "EN" ? "Projects"   : "Proyectos",   href: "/views/projects"  },
    { icon: <MessageIcon />, label: language === "EN" ? "Contact"    : "Contacto",    href: "/views/contact"   },
  ]

  const secondaryItems = [
    { icon: <DownloadIcon />, label: language === "EN" ? "Resume" : "Currículum", href: language === "EN" ? "/AlexandroLuceroCV-English-3-26.docx.pdf" : "/AlexandroLuceroCV-Spanish-3-26.docx.pdf" },
    { icon: <GitHubIcon />,   label: "GitHub",                                     href: "https://github.com/Alexrulu" },
    { icon: <LinkedInIcon />, label: "LinkedIn",                                   href: "https://www.linkedin.com/in/alexandrolucero/" },
  ]

  const emailLabel  = language === "EN" ? "Email"   : "Correo"
  const copiedLabel = language === "EN" ? "Copied!" : "¡Copiado!"

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* ─────────────── DESKTOP ─────────────── */}
      <nav className="hidden md:fixed md:flex md:flex-col md:top-0 md:left-0 md:bottom-0 md:w-44 lg:w-56 md:h-screen md:border-r md:border-border md:bg-background z-10">

        <ul
          className="flex flex-col pb-2 pt-2 text-foreground-secondary font-medium"
          onMouseLeave={() => setHoveredNav(null)}
        >
          {navItems.map(({ icon, label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href} className="relative">
                <Link
                  href={href}
                  onMouseEnter={() => setHoveredNav(href)}
                  className={`relative flex flex-row items-center gap-3 px-4 py-2.5 text-xs w-full duration-200
                    ${isActive ? "text-foreground-principal" : hoveredNav === href ? "text-foreground-principal" : "text-foreground-secondary"}`}
                >
                  {hoveredNav === href && (
                    <motion.div layoutId="nav-hover" className="absolute inset-0 bg-white/5" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                  )}
                  <div className={`absolute left-0 top-2 bottom-2 w-0.5 bg-foreground-icons duration-200 z-10 ${isActive ? "opacity-100" : hoveredNav === href ? "opacity-100" : "opacity-0"}`} />
                  <span className="relative z-10 w-4 h-4 flex items-center justify-center shrink-0">{icon}</span>
                  <span className="relative z-10">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <ul
          className="flex flex-col pt-2 pb-2 border-t border-border text-xs text-foreground-secondary font-medium"
          onMouseLeave={() => setHoveredSecondary(null)}
        >
          <li
            onClick={handleCopy}
            onMouseEnter={() => setHoveredSecondary("email")}
            className="relative flex flex-col gap-0.5 px-4 py-2.5 cursor-pointer"
          >
            {hoveredSecondary === "email" && (
              <motion.div layoutId="secondary-hover" className="absolute inset-0 bg-white/5" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
            )}
            <div className={`absolute left-0 top-2 bottom-2 w-0.5 bg-foreground-icons duration-200 z-10 ${hoveredSecondary === "email" ? "opacity-100" : "opacity-0"}`} />
            <span suppressHydrationWarning className={`relative z-10 text-[10px] font-mono uppercase tracking-widest duration-200 ${hoveredSecondary === "email" ? "text-foreground-principal" : "text-foreground-icons"}`}>
              {copied ? copiedLabel : emailLabel}
            </span>
            <span className="relative z-10 font-mono text-[10px] truncate">{EMAIL}</span>
          </li>

          {secondaryItems.map(({ icon, label, href }) => (
            <li key={href} onMouseEnter={() => setHoveredSecondary(label)}>
              <a href={href} target="_blank" rel="noopener noreferrer"
                className={`relative flex items-center gap-3 px-4 py-2.5 cursor-pointer duration-200 ${hoveredSecondary === label ? "text-foreground-principal" : ""}`}
              >
                {hoveredSecondary === label && (
                  <motion.div layoutId="secondary-hover" className="absolute inset-0 bg-white/5" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                )}
                <div className={`absolute left-0 top-2 bottom-2 w-0.5 bg-foreground-icons duration-200 z-10 ${hoveredSecondary === label ? "opacity-100" : "opacity-0"}`} />
                <span className="relative z-10 w-4 h-4 flex items-center justify-center shrink-0">{icon}</span>
                <span className="relative z-10" suppressHydrationWarning>{label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex mt-auto border-t border-border">
          {(["EN", "ES"] as const).map((lang) => (
            <button key={lang} onClick={() => setLanguage(lang)}
              className={`relative flex-1 py-3 text-[10px] font-mono uppercase tracking-widest duration-200
                ${language === lang ? "text-foreground-principal" : "text-foreground-icons hover:text-foreground-secondary"}`}
            >
              {language === lang && (
                <motion.div layoutId="lang-hover" initial={false} className="absolute inset-0 bg-white/5" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
              )}
              <span className="relative z-10">{lang}</span>
            </button>
          ))}
        </div>

      </nav>

      {/* ─────────────── MOBILE ─────────────── */}

      {/* Backdrop — cierra el popup */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setMenuOpen(false)}
            className="md:hidden fixed inset-0 z-20"
          />
        )}
      </AnimatePresence>

      {/* Popup sobre el navbar */}
      <AnimatePresence>
        {menuOpen && (
            <motion.div
              key="mobile-popup"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden fixed bottom-[57px] left-0 right-0 z-100 border-y border-border bg-background flex flex-col divide-y divide-border shadow-[0_-16px_40px_#0e0e0e]"
            >
            {/* Email */}
            <div
              onClick={() => { handleCopy() }}
              className="flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-white/5"
            >
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span suppressHydrationWarning className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">
                  {copied ? copiedLabel : emailLabel}
                </span>
                <span className="text-xs font-mono text-foreground-secondary truncate">{EMAIL}</span>
              </div>
              <span className="text-xs text-foreground-icons flex-shrink-0">{copied ? "✓" : "↗"}</span>
            </div>

            {/* Secondary items */}
            {secondaryItems.map(({ icon, label, href }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-white/5"
              >
                <span className="w-4 h-4 flex items-center justify-center text-foreground-icons shrink-0">{icon}</span>
                <span className="text-sm text-foreground-secondary flex-1" suppressHydrationWarning>{label}</span>
                <span className="text-xs text-foreground-icons">↗</span>
              </a>
            ))}

            {/* Language toggle */}
            <div className="flex">
              {(["EN", "ES"] as const).map((lang) => (
                <button key={lang}
                  onClick={() => { setLanguage(lang); setMenuOpen(false) }}
                  className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-widest duration-200
                    ${language === lang ? "text-foreground-principal bg-white/5" : "text-foreground-icons"}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/90 backdrop-blur-md flex items-stretch">

        {/* Nav items */}
        <ul className="flex flex-1 items-stretch">
          {navItems.map(({ icon, label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex flex-col items-center justify-center gap-1 py-3 text-[10px] w-full duration-200
                    ${isActive ? "text-foreground-principal" : "text-foreground-secondary"}`}
                >
                  <span className={`w-4 h-4 flex items-center justify-center duration-200
                    ${isActive ? "text-foreground-principal" : "text-foreground-icons"}`}>
                    {icon}
                  </span>
                  <span suppressHydrationWarning>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

{/* Hamburger — separado por borde */}
<button
  onClick={() => setMenuOpen((v) => !v)}
  className={`border-l border-border w-14 flex items-center justify-center duration-200 flex-shrink-0
    ${menuOpen ? "bg-white/5" : ""}`}
>
  <div className="relative w-3.5 h-3.5">
    <motion.div
      animate={menuOpen ? { rotate: 45, top: "50%" } : { rotate: 0, top: "20%" }}
      transition={{ duration: 0.2 }}
      className="absolute w-full h-[1.5px] bg-foreground-secondary origin-center -translate-y-1/2"
    />
    <motion.div
      animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.15 }}
      className="absolute w-full h-[1.5px] bg-foreground-secondary top-1/2 -translate-y-1/2"
    />
    <motion.div
      animate={menuOpen ? { rotate: -45, top: "50%" } : { rotate: 0, top: "80%" }}
      transition={{ duration: 0.2 }}
      className="absolute w-full h-[1.5px] bg-foreground-secondary origin-center -translate-y-1/2"
    />
  </div>
</button>

      </nav>
    </>
  )
}