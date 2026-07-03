import { cn } from '@/lib/utils'

/** Marquee infinito horizontal. Renderiza los hijos dos veces para un loop sin cortes. */
export function Marquee({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'marquee-paused flex w-full overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
        className
      )}
    >
      <div className="flex shrink-0 animate-marquee items-center">
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
