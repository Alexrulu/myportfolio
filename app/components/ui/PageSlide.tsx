'use client'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAnimate } from 'motion/react'

// Orden de las páginas en el header — define la dirección del slide.
const ORDER = ['/', '/services', '/projects', '/background', '/contact']

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Transición direccional entre páginas. Vive en el layout (persiste entre
 * navegaciones). NO keyea ni congela el outlet del router — sólo envuelve a
 * `children` en un `<div>` estable y lo anima de forma imperativa cuando cambia
 * el pathname. Así Next reconcilia normal y `usePathname` se propaga a la navbar.
 *
 * Dirección: +1 hacia adelante en el header (entra desde la derecha), -1 hacia
 * atrás (entra desde la izquierda). El primer render no anima → SSR e hidratación
 * coinciden.
 */
export default function PageSlide({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [scope, animate] = useAnimate()
  const prevRef = useRef(pathname)
  const firstRef = useRef(true)

  useIsoLayoutEffect(() => {
    if (firstRef.current) {
      firstRef.current = false
      prevRef.current = pathname
      return
    }

    const idx = ORDER.indexOf(pathname)
    const prevIdx = ORDER.indexOf(prevRef.current)
    prevRef.current = pathname
    const dir = idx === -1 || prevIdx === -1 ? 0 : Math.sign(idx - prevIdx)

    if (dir === 0) {
      animate(scope.current, { x: 0, opacity: [0, 1] }, { duration: 0.3, ease: 'easeOut' })
    } else {
      animate(
        scope.current,
        { x: [dir > 0 ? 90 : -90, 0], opacity: [0, 1] },
        { duration: 0.4, ease: 'easeOut' }
      )
    }
  }, [pathname, animate, scope])

  return (
    // Contenedor exterior estable: recorta el deslizamiento horizontal del hijo
    // (evita el scroll horizontal al entrar desde la derecha).
    <div style={{ overflowX: 'clip' }}>
      <div ref={scope}>{children}</div>
    </div>
  )
}
