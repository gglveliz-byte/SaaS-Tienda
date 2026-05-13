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
  const isPublicPage =
    pathname === '/vendedor/login' ||
    pathname === '/vendedor/olvide-contrasena' ||
    pathname.startsWith('/vendedor/restablecer')

  useEffect(() => {
    if ((!session || !tienda) && !isPublicPage) {
      router.replace('/vendedor/login')
    }
  }, [session, tienda, isPublicPage, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (!session || !tienda) {
    return <>{children}</>
  }

  const mustChangePassword = tienda.vendedor?.mustChangePassword ?? false

  return (
    <div className="min-h-screen bg-background">
      <VendedorSidebar
        tienda={tienda}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Header móvil */}
      <header className="sticky top-0 z-30 lg:hidden bg-surface-deep border-b border-surface-muted safe-area-inset-top">
        <div className="flex items-center justify-between px-3 py-2.5">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-secondary-fixed-dim hover:text-white hover:bg-surface-muted rounded-xl transition-colors touch-manipulation"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <h1 className="text-base font-bold text-white truncate flex-1 text-center mx-3">
            {tienda.nombre}
          </h1>

          <Link
            href={`/tienda/${tienda.slug}`}
            target="_blank"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-secondary-fixed-dim hover:text-accent-vibrant hover:bg-surface-muted rounded-xl transition-colors touch-manipulation"
            aria-label="Ver tienda"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>open_in_new</span>
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">

          {/* Alerta: cambio de contraseña obligatorio */}
          {mustChangePassword && (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <span className="material-symbols-outlined text-accent-vibrant" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <div>
                  <p className="font-semibold text-on-surface text-sm">Primera vez que inicias sesión</p>
                  <p className="text-xs text-secondary mt-0.5">Por seguridad, cambia la contraseña que te asignó el administrador.</p>
                </div>
              </div>
              <Link
                href="/vendedor/cambiar-contrasena"
                className="px-4 py-2 bg-accent-vibrant hover:bg-accent-hover text-surface-deep font-semibold rounded-lg transition-colors text-center text-sm shrink-0"
              >
                Cambiar contraseña
              </Link>
            </div>
          )}

          {/* Alerta: tienda desactivada */}
          {!tienda.activa && (
            <div className="mb-5 p-4 bg-error-container border border-error/20 rounded-xl flex items-center gap-3 text-on-error-container text-sm">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              Tu tienda está desactivada. Contacta al administrador para activarla.
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  )
}
