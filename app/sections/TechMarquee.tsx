'use client'
import type { IconType } from 'react-icons'
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs, SiExpress, SiLaravel,
  SiPhp, SiTailwindcss, SiFramer, SiThreedotjs, SiMysql, SiSqlite,
  SiPrisma, SiAstro, SiDocker, SiGithub, SiGitlab,
} from 'react-icons/si'
import { useLanguage } from '@/app/context/LanguageContext'
import { Marquee } from '@/app/components/ui/Marquee'

type Tech = { name: string; Icon: IconType; color: string }

// `color` = color del glow de marca en el padding (logo va en blanco neutro).
// Marcas neutras (GitHub, Next.js…) usan blanco para conservar un glow visible.
const TECHS: Tech[] = [
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', Icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'Express', Icon: SiExpress, color: '#FFFFFF' },
  { name: 'Laravel', Icon: SiLaravel, color: '#FF2D20' },
  { name: 'PHP', Icon: SiPhp, color: '#8B93C9' },
  { name: 'Tailwind', Icon: SiTailwindcss, color: '#38BDF8' },
  { name: 'Motion', Icon: SiFramer, color: '#5B8CFF' },
  { name: 'Three.js', Icon: SiThreedotjs, color: '#FFFFFF' },
  { name: 'MySQL', Icon: SiMysql, color: '#4DA8C7' },
  { name: 'SQLite', Icon: SiSqlite, color: '#4FC3F7' },
  { name: 'Prisma', Icon: SiPrisma, color: '#8B96E8' },
  { name: 'Astro', Icon: SiAstro, color: '#FF5D01' },
  { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
  { name: 'GitHub', Icon: SiGithub, color: '#FFFFFF' },
  { name: 'GitLab', Icon: SiGitlab, color: '#FC6D26' },
]

export default function TechMarquee() {
  const { language } = useLanguage()
  const label = language === 'EN' ? 'Tools I work with' : 'Tecnologías que uso'

  return (
    <section className="relative border-y border-border bg-background-card/30 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-7">
        <p className="px-6 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-foreground-icons">
          {label}
        </p>
        <Marquee>
          {TECHS.map(({ name, Icon }) => (
            <div
              key={name}
              aria-label={name}
              className="group/tile relative mx-5 inline-flex h-16 items-center overflow-hidden rounded-2xl border border-border bg-background-card shadow-[0_10px_28px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors duration-300 hover:border-border-active/30"
            >
              {/* Ícono — cuadrado fijo */}
              <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center">
                <Icon className="h-8 w-8 text-foreground-principal" />
              </div>
              {/* Nombre — se despliega en hover */}
              <span className="relative z-10 max-w-0 overflow-hidden whitespace-nowrap pr-0 font-mono text-sm font-medium text-foreground-principal opacity-0 transition-all duration-300 group-hover/tile:max-w-[160px] group-hover/tile:pr-5 group-hover/tile:opacity-100">
                {name}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
