'use client'
import { useRef, useLayoutEffect, useState } from 'react'

export default function StackList({ stack }: { stack: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(stack.length)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      // Primero mostrar todos para medir correctamente
      const items = Array.from(container.querySelectorAll('[data-item]')) as HTMLElement[]
      items.forEach(el => el.style.display = 'inline-flex')

      const containerRight = container.getBoundingClientRect().right
      // Reservar ~28px para el badge +N
      const availableRight = containerRight - 28

      let count = stack.length
      for (let i = items.length - 1; i >= 0; i--) {
        const itemRight = items[i].getBoundingClientRect().right
        if (itemRight <= availableRight) {
          count = i + 1
          break
        }
        if (i === 0) count = 0
      }

      // Si todos caben sin badge, mostrar todos
      const lastItem = items[items.length - 1]
      if (lastItem && lastItem.getBoundingClientRect().right <= containerRight) {
        count = stack.length
      }

      setVisibleCount(count)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [stack])

  const hidden = stack.length - visibleCount

  return (
    <div ref={containerRef} className="flex gap-1.5 overflow-hidden flex-nowrap mt-1 relative">
      {stack.map((tech, i) => (
        <span
          key={tech}
          data-item
          className={`text-[10px] text-foreground-icons border border-border px-1.5 py-0 font-mono whitespace-nowrap flex-shrink-0
            ${i >= visibleCount ? 'hidden' : ''}
          `}
        >
          {tech}
        </span>
      ))}
      {hidden > 0 && (
        <span className="text-[10px] text-foreground-icons font-mono flex-shrink-0">
          +{hidden}
        </span>
      )}
    </div>
  )
}