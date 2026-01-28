'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
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
  const isPublicPage = pathname === '/vendedor/login' || pathname === '/vendedor/olvide-contrasena' || pathname.startsWith('/vendedor/restablecer')

  useEffect(() => {
    if ((!session || !tienda) && !isPublicPage) {
      router.replace('/vendedor/login')
    }
  }, [session, tienda, isPublicPage, router])

  // Sin sesión/tienda y estamos en login: mostrar solo el contenido
  if (!session || !tienda) {
    return <>{children}</>
  }

  const mustChangePassword = tienda.vendedor?.mustChangePassword ?? false

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <VendedorSidebar tienda={tienda} />
      <main className="flex-1 p-8 ml-64">
        {mustChangePassword && (
          <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700 rounded-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <p className="font-medium text-amber-200">Primera vez que inicias sesión</p>
                <p className="text-sm text-amber-300/90">Por seguridad, cambia la contraseña que te asignó el administrador.</p>
              </div>
            </div>
            <Link
              href="/vendedor/cambiar-contrasena"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors shrink-0"
            >
              Cambiar contraseña ahora
            </Link>
          </div>
        )}
        {!tienda.activa && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg text-yellow-400">
            Tu tienda está desactivada. Contacta al administrador para activarla.
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
