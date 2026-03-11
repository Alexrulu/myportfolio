import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import NavBar from './layout/NavBar'
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
  title: 'Alexandro Lucero',
  description: 'Full Stack Software Engineer'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const lang = cookieStore.get("language")?.value
  const initialLanguage = lang === "ES" ? "ES" : "EN"

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <NavBar />
          <main className="
              w-full min-h-screen pb-16
              md:pb-0 md:ml-44 md:w-[calc(100%-11rem)]
              lg:ml-56 lg:w-[calc(100%-14rem)]
              md:border-l md:border-border
              md:h-screen md:overflow-y-auto
            ">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  )
}