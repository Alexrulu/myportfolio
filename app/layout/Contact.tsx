"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import dynamic from "next/dynamic"
import { useLanguage } from "../context/LanguageContext"

const Map = dynamic(() => import('../components/Map'), { ssr: false })

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
)

export default function Contact() {
  const [current, setCurrent] = useState(0)
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const { language } = useLanguage()

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setStatus("sending")
    try {
      const response = await fetch("https://formspree.io/f/mqaqovyp", {
        method: "POST",
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
      })
      if (response.ok) {
        setStatus("sent")
        setForm({ name: "", email: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  const testimonials = [
    {
      quote: language === "EN"
        ? "Working with Alexandro stood out for the passion he shows for his profession. He enjoys tackling new challenges and always takes on the most complex tasks with enthusiasm, looking for the best way to solve them."
        : "Trabajar con Alexandro destacó por la pasión que demuestra por su profesión. Disfruta enfrentar nuevos desafíos y siempre asume las tareas más complejas con entusiasmo, buscando la mejor forma de resolverlas.",
      name: "Ex Líder Técnico",
      role: "ForIt Software Factory",
    },
    {
      quote: language === "EN"
        ? "A very responsible and organized person — qualities that are reflected in the quality of his work and in his commitment to the projects he participates in."
        : "Una persona muy responsable y organizada, cualidades que se reflejan en la calidad de su trabajo y en su compromiso con los proyectos en los que participa.",
      name: "Ex Líder Técnico",
      role: "ForIt Software Factory",
    },
  ]

  const t = {
    header:    language === "EN" ? "Contact"                                            : "Contacto",
    available: language === "EN" ? "Available for freelance work and remote positions." : "Disponible para trabajo freelance y posiciones remotas.",
    namePH:    language === "EN" ? "Name"                                               : "Nombre",
    emailPH:   language === "EN" ? "Email"                                              : "Correo",
    messagePH: language === "EN" ? "Message"                                            : "Mensaje",
    send:      language === "EN" ? "Send Message →"                                     : "Enviar Mensaje →",
    sending:   language === "EN" ? "Sending..."                                         : "Enviando...",
    sent:      language === "EN" ? "Message sent ✓"                                     : "Mensaje enviado ✓",
    error:     language === "EN" ? "Error, try again"                                   : "Error, intentá de nuevo",
    basedIn:   language === "EN" ? "Based in"                                           : "Ubicación",
    location:  "San Miguel, Buenos Aires",
    testimonials: language === "EN" ? "Testimonials"                                    : "Testimonios",
    infoLabels: [
      { label: language === "EN" ? "Email"    : "Correo",       value: "alexandro71000@gmail.com" },
      { label: language === "EN" ? "Location" : "Ubicación",    value: "San Miguel, Buenos Aires" },
      { label: language === "EN" ? "Timezone" : "Zona horaria", value: "GMT-3 — ART"              },
    ],
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [language])

  const active = testimonials[current]

  return (
    <div className="flex flex-col md:h-screen md:overflow-hidden divide-y divide-border">

      {/* Header */}
      <FadeIn delay={0} className="px-4 py-3 md:px-6 flex-shrink-0">
        <h3 className="text-xs text-foreground-secondary font-medium uppercase tracking-widest">
          {t.header}
        </h3>
      </FadeIn>

      {/* ── Cuerpo principal ── */}
      <FadeIn delay={0.1} className="flex flex-col md:flex-1 md:min-h-0">

        {/* Fila superior: form + derecha */}
        <div className="flex flex-col md:flex-row md:divide-x md:divide-border md:flex-1 md:min-h-0">

          {/* ── Izquierda — formulario ── */}
          <div className="flex flex-col divide-y divide-border md:flex-1 md:min-h-0">

            <div className="flex items-center gap-2 px-4 py-4 md:px-6 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/70 animate-pulse flex-shrink-0" />
              <p className="text-xs text-foreground-secondary">{t.available}</p>
            </div>

            <input
              type="text"
              placeholder={t.namePH}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="flex-shrink-0 px-4 py-4 text-sm text-foreground-principal bg-transparent outline-none placeholder:text-foreground-icons hover:bg-white/5 focus:bg-white/5 duration-200 md:px-6"
            />

            <input
              type="email"
              placeholder={t.emailPH}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="flex-shrink-0 px-4 py-4 text-sm text-foreground-principal bg-transparent outline-none placeholder:text-foreground-icons hover:bg-white/5 focus:bg-white/5 duration-200 md:px-6"
            />

            <textarea
              placeholder={t.messagePH}
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="flex-shrink-0 md:flex-1 px-4 py-4 text-sm text-foreground-principal bg-transparent outline-none placeholder:text-foreground-icons resize-none hover:bg-white/5 focus:bg-white/5 duration-200 md:px-6"
            />

            <button
              onClick={handleSubmit}
              disabled={status === "sending" || status === "sent"}
              className="relative group flex-shrink-0 text-left px-4 py-4 md:px-6 text-sm font-medium text-foreground-secondary hover:text-foreground-principal hover:bg-white/5 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-foreground-icons opacity-0 group-hover:opacity-100 duration-200" />
              {status === "sending" ? t.sending
                : status === "sent"    ? t.sent
                : status === "error"   ? t.error
                : t.send}
            </button>

            {/* Mapa — solo en desktop (lg+) */}
            <div className="relative overflow-hidden flex-shrink-0 border-t border-border hidden lg:block" style={{ height: '33vh' }}>
              <Map />
              <div className="absolute bottom-4 left-4 z-[999] flex flex-col gap-0.5 pointer-events-none">
                <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.basedIn}</span>
                <span className="text-xs font-semibold text-foreground-principal">{t.location}</span>
              </div>
            </div>

          </div>

          {/* ── Derecha — testimonios + info (tablet y desktop) ── */}
          <div className="hidden md:flex flex-col divide-y divide-border md:w-2/5">

            <div className="flex flex-col justify-between p-4 md:p-5 lg:p-8 gap-4 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col gap-3"
                >
                  <span className="text-foreground-icons text-xs font-mono tracking-widest">//</span>
                  <p className="text-xs lg:text-sm text-foreground-secondary leading-relaxed">"{active.quote}"</p>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-foreground-principal">{active.name}</span>
                    <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{active.role}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-[2px] duration-300 ${i === current ? "w-6 bg-foreground-secondary" : "w-2 bg-foreground-icons"}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col divide-y divide-border flex-shrink-0">
              {t.infoLabels.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 md:px-5 lg:px-6 py-3">
                  <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{label}</span>
                  <span className="text-xs text-foreground-secondary font-mono">{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Mapa full width — solo tablet (md, no lg) ── */}
        <div className="relative overflow-hidden flex-shrink-0 border-t border-border md:block lg:hidden hidden" style={{ height: '28vh' }}>
          <Map />
          <div className="absolute bottom-4 left-4 z-[999] flex flex-col gap-0.5 pointer-events-none">
            <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.basedIn}</span>
            <span className="text-xs font-semibold text-foreground-principal">{t.location}</span>
          </div>
        </div>

        {/* ── Mobile — testimonios + info debajo del form ── */}
        <div className="md:hidden flex flex-col divide-y divide-border">
          <div className="px-4 py-3">
            <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{t.testimonials}</span>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col gap-3"
              >
                <span className="text-foreground-icons text-xs font-mono tracking-widest">//</span>
                <p className="text-xs text-foreground-secondary leading-relaxed">"{active.quote}"</p>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-foreground-principal">{active.name}</span>
                  <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{active.role}</span>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-[2px] duration-300 ${i === current ? "w-6 bg-foreground-secondary" : "w-2 bg-foreground-icons"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {t.infoLabels.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3.5">
                <span className="text-[10px] font-mono text-foreground-icons uppercase tracking-widest">{label}</span>
                <span className="text-xs text-foreground-secondary font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </FadeIn>
    </div>
  )
}