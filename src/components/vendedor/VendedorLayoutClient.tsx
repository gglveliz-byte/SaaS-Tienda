'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { VendedorSidebar } from './VendedorSidebar'

type TiendaInfo = {
  id: string
  nombre: string
  slug: string
  activa: boolean
  vendedor?: { mustChangePassword: boolean } | null
}

export function VendedorLayoutClient({
  session,
  tienda,
  children,
}: {
  session: { tiendaId?: string } | null
  tienda: TiendaInfo | null
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isPublicPage = pathname === '/vendedor/login' || pathname === '/vendedor/olvide-contrasena' || pathname.startsWith('/vendedor/restablecer')

  useEffect(() => {
    if ((!session || !tienda) && !isPublicPage) {
      router.replace('/vendedor/login')
    }
  }, [session, tienda, isPublicPage, router])

  // Cerrar sidebar cuando cambia la ruta
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Sin sesión/tienda y estamos en login: mostrar solo el contenido
  if (!session || !tienda) {
    return <>{children}</>
  }

  const mustChangePassword = tienda.vendedor?.mustChangePassword ?? false

  return (
    <div className="min-h-screen bg-gray-950">
      <VendedorSidebar
        tienda={tienda}
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

          <h1 className="text-base sm:text-lg font-bold text-white truncate flex-1 text-center mx-2 sm:mx-4">
            {tienda.nombre}
          </h1>

          <Link
            href={`/tienda/${tienda.slug}`}
            target="_blank"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors touch-manipulation"
            aria-label="Ver tienda"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {mustChangePassword && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-900/30 border border-amber-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <span className="text-xl sm:text-2xl">🔐</span>
                <div>
                  <p className="font-medium text-amber-200 text-sm sm:text-base">Primera vez que inicias sesion</p>
                  <p className="text-xs sm:text-sm text-amber-300/90">Por seguridad, cambia la contraseña que te asigno el administrador.</p>
                </div>
              </div>
              <Link
                href="/vendedor/cambiar-contrasena"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors text-center text-sm sm:text-base shrink-0"
              >
                Cambiar contraseña
              </Link>
            </div>
          )}
          {!tienda.activa && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-900/20 border border-yellow-800 rounded-xl text-yellow-400 text-sm sm:text-base">
              Tu tienda esta desactivada. Contacta al administrador para activarla.
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
