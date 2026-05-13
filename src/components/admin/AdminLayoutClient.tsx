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
  const isPublicPage =
    pathname === '/admin/login' ||
    pathname === '/admin/olvide-contrasena' ||
    pathname.startsWith('/admin/restablecer')

  useEffect(() => {
    if (!session && !isPublicPage) {
      router.replace('/admin/login')
    }
  }, [session, isPublicPage, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
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

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-vibrant" style={{ fontSize: '20px' }}>
              admin_panel_settings
            </span>
            <h1 className="text-base font-bold text-white">Tienda Digital</h1>
          </div>

          <div className="w-11" />
        </div>
      </header>

      {/* Contenido principal */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
