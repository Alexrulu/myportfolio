// LanguageContext.tsx
"use client"
import { createContext, useContext, useState } from "react"

type Language = "EN" | "ES"
type LanguageContextType = { language: Language; setLanguage: (l: Language) => void }

const LanguageContext = createContext<LanguageContextType>({ language: "EN", setLanguage: () => {} })

export function LanguageProvider({ children, initialLanguage }: { children: React.ReactNode, initialLanguage: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage)

  const handleSetLanguage = (l: Language) => {
    setLanguage(l)
    document.cookie = `language=${l}; path=/; max-age=31536000`
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)