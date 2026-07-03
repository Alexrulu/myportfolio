import { redirect } from 'next/navigation'

// Ruta antigua → nueva página dedicada.
export default function ProjectsPage() {
  redirect('/projects')
}
