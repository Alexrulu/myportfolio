import { redirect } from 'next/navigation'

// Ruta antigua → nueva página dedicada.
export default function ContactPage() {
  redirect('/contact')
}
