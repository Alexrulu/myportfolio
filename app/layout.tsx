import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import SiteChrome from './layout/SiteChrome'
import './globals.css'
import { LanguageProvider } from './context/LanguageContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Alexandro Lucero — Full Stack Software Engineer',
  description: 'Full Stack Software Engineer building reliable web applications with React, Next.js, Node.js and Laravel.'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const lang = cookieStore.get('language')?.value
  const initialLanguage = lang === 'ES' ? 'ES' : 'EN'

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  )
}
