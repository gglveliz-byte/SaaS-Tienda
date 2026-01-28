'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AdminSidebar } from './AdminSidebar'
import type { JWTPayload } from '@/lib/auth'

export function AdminLayoutClient({
  session,
  children,
}: {
  session: JWTPayload | null
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isPublicPage = pathname === '/admin/login' || pathname === '/admin/olvide-contrasena' || pathname.startsWith('/admin/restablecer')

  useEffect(() => {
    if (!session && !isPublicPage) {
      router.replace('/admin/login')
    }
  }, [session, isPublicPage, router])

  // Sin sesión y estamos en login: mostrar solo el contenido (formulario)
  if (!session) {
    return <>{children}</>
  }

  // Con sesión: panel con sidebar
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  )
}
