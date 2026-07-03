'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/app/context/LanguageContext'
import { SectionHeading } from '@/app/components/ui/SectionHeading'
import CardSpotlight from '@/app/components/ui/CardSpotlight'
import { CTAButton } from '@/app/components/ui/CTAButton'
import { Spotlight } from '@/app/components/ui/Spotlight'

const Map = dynamic(() => import('@/app/components/Map'), { ssr: false })

export default function ContactCTA() {
  const { language } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      const response = await fetch('https://formspree.io/f/mqaqovyp', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', message: '' })
      } else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const t = {
    eyebrow: language === 'EN' ? 'Contact' : 'Contacto',
    title: language === 'EN' ? "Let's build something together" : 'Construyamos algo juntos',
    subtitle:
      language === 'EN'
        ? 'Available for freelance work and remote positions. Drop me a message and I will get back to you.'
        : 'Disponible para trabajo freelance y posiciones remotas. Dejame un mensaje y te respondo.',
    name: language === 'EN' ? 'Name' : 'Nombre',
    email: language === 'EN' ? 'Email' : 'Correo',
    message: language === 'EN' ? 'Message' : 'Mensaje',
    send: language === 'EN' ? 'Send message →' : 'Enviar mensaje →',
    sending: language === 'EN' ? 'Sending...' : 'Enviando...',
    sent: language === 'EN' ? 'Message sent ✓' : 'Mensaje enviado ✓',
    error: language === 'EN' ? 'Error, try again' : 'Error, intentá de nuevo',
    basedIn: language === 'EN' ? 'Based in' : 'Ubicación',
  }

  const info = [
    { label: language === 'EN' ? 'Email' : 'Correo', value: 'alexandro71000@gmail.com' },
    { label: language === 'EN' ? 'Location' : 'Ubicación', value: 'San Miguel, Buenos Aires' },
    { label: language === 'EN' ? 'Timezone' : 'Zona horaria', value: 'GMT-3 — ART' },
  ]

  const inputCls =
    'w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground-principal outline-none placeholder:text-foreground-icons transition-colors focus:border-border-active/40 focus:bg-white/[0.04]'

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:py-32">
      <Spotlight className="-top-20 left-1/2 h-[30rem] w-[40rem] -translate-x-1/2" fill="rgba(255,255,255,0.04)" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} className="mx-auto" />

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Formulario */}
          <CardSpotlight className="rounded-2xl p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder={t.name}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
              <input
                type="email"
                placeholder={t.email}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
              />
              <textarea
                placeholder={t.message}
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputCls} resize-none`}
              />
              <CTAButton
                variant="primary"
                onClick={handleSubmit}
                className={status === 'sending' || status === 'sent' ? 'pointer-events-none opacity-60' : ''}
              >
                {status === 'sending' ? t.sending : status === 'sent' ? t.sent : status === 'error' ? t.error : t.send}
              </CTAButton>
            </div>
          </CardSpotlight>

          {/* Info + mapa */}
          <div className="flex flex-col gap-5">
            <CardSpotlight className="rounded-2xl">
              <div className="flex flex-col divide-y divide-border">
                <div className="flex items-center gap-2 px-6 py-4">
                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-500" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-secondary">
                    {language === 'EN' ? 'Open to opportunities' : 'Abierto a oportunidades'}
                  </span>
                </div>
                {info.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 px-6 py-4">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-foreground-icons">
                      {row.label}
                    </span>
                    <span className="truncate font-mono text-xs text-foreground-secondary">{row.value}</span>
                  </div>
                ))}
              </div>
            </CardSpotlight>

            <div className="relative flex-1 overflow-hidden rounded-2xl border border-border" style={{ minHeight: '220px' }}>
              <Map />
              <div className="pointer-events-none absolute bottom-4 left-4 z-[999] flex flex-col gap-0.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-icons">{t.basedIn}</span>
                <span className="text-xs font-semibold text-foreground-principal">San Miguel, Buenos Aires</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
