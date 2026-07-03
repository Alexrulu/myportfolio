import { cn } from '@/lib/utils'

/** Glow radial difuso para iluminar secciones (estilo aurora/spotlight). */
export function Spotlight({
  className,
  fill = 'rgba(99,102,241,0.22)',
  pulse = false,
}: {
  className?: string
  fill?: string
  pulse?: boolean
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute rounded-full blur-[100px]',
        pulse && 'animate-[glow-pulse_8s_ease-in-out_infinite]',
        className
      )}
      style={{ background: `radial-gradient(ellipse, ${fill} 0%, transparent 70%)` }}
    />
  )
}
