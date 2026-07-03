import { cn } from '@/lib/utils'

/** Fondo de grilla sutil con desvanecido configurable. */
export function GridBackground({
  className,
  variant = 'grid',
  mask = 'radial',
}: {
  className?: string
  variant?: 'grid' | 'grid-sm' | 'dot'
  mask?: 'radial' | 'y' | 'none'
}) {
  const bg = variant === 'dot' ? 'bg-dot' : variant === 'grid-sm' ? 'bg-grid-sm' : 'bg-grid'
  const maskCls = mask === 'radial' ? 'mask-radial-faded' : mask === 'y' ? 'mask-faded-y' : ''
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0', bg, maskCls, className)} />
  )
}
