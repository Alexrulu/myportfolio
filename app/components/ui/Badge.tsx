import { cn } from '@/lib/utils'

/** Pill/badge con punto opcional pulsante. */
export function Badge({
  children,
  className,
  dot = false,
}: {
  children: React.ReactNode
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-background-card px-3 py-1',
        'text-[11px] font-mono uppercase tracking-widest text-foreground-secondary backdrop-blur-sm',
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
        </span>
      )}
      {children}
    </span>
  )
}
