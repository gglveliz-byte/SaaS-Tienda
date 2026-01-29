'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isPublicPage = pathname === '/admin/login' || pathname === '/admin/olvide-contrasena' || pathname.startsWith('/admin/restablecer')

  useEffect(() => {
    if (!session && !isPublicPage) {
      router.replace('/admin/login')
    }
  }, [session, isPublicPage, router])

  // Cerrar sidebar cuando cambia la ruta
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Sin sesión y estamos en login: mostrar solo el contenido (formulario)
  if (!session) {
    return <>{children}</>
  }

  // Con sesión: panel con sidebar
  return (
    <div className="min-h-screen bg-gray-950">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Header móvil - botones táctiles 44px */}
      <header className="sticky top-0 z-30 lg:hidden bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 safe-area-inset-top">
        <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors touch-manipulation"
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <h1 className="text-lg font-bold text-white">Tienda SaaS</h1>
          </div>

          <div className="w-10" /> {/* Spacer para centrar el título */}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
