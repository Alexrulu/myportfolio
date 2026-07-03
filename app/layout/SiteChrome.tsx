'use client'
import { usePathname } from 'next/navigation'
import FloatingNav from './FloatingNav'
import Footer from './Footer'
import PageSlide from '../components/ui/PageSlide'

/** Navbar + footer en todo el sitio, excepto en el easter egg (experiencia inmersiva). */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = pathname?.startsWith('/views/easteregg')

  if (bare) return <>{children}</>

  return (
    <>
      <FloatingNav />
      <PageSlide>{children}</PageSlide>
      <Footer />
    </>
  )
}
