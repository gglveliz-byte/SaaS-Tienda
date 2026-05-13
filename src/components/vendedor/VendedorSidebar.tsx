'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TiendaInfo {
  id: string
  nombre: string
  slug: string
  activa: boolean
}

interface VendedorSidebarProps {
  tienda: TiendaInfo
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { href: '/vendedor',               label: 'Dashboard',     icon: 'dashboard' },
  { href: '/vendedor/productos',     label: 'Productos',     icon: 'inventory_2' },
  { href: '/vendedor/categorias',    label: 'Categorías',    icon: 'category' },
  { href: '/vendedor/pedidos',       label: 'Pedidos',       icon: 'shopping_bag' },
  { href: '/vendedor/configuracion', label: 'Configuración', icon: 'settings' },
]

export function VendedorSidebar({ tienda, isOpen, onClose }: VendedorSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/vendedor/auth', { method: 'DELETE' })
    router.push('/vendedor/login')
    router.refresh()
  }

  const handleNavClick = () => {
    if (window.innerWidth < 1024) onClose()
  }

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-72 lg:w-64 flex flex-col z-50 transition-transform duration-300 ease-in-out',
          'bg-surface-deep border-r border-surface-muted',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header del sidebar */}
        <div className="px-5 py-4 border-b border-surface-muted flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-accent-vibrant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-surface-deep" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>
                storefront
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white truncate leading-tight">{tienda.nombre}</h1>
              <p className="text-[10px] text-secondary-fixed-dim">Panel de Vendedor</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden min-h-[36px] min-w-[36px] flex items-center justify-center text-secondary-fixed-dim hover:text-white hover:bg-surface-muted rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/vendedor' && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg text-sm font-medium transition-all touch-manipulation active:scale-[0.99]',
                      isActive
                        ? 'bg-surface-muted text-accent-vibrant border-l-[3px] border-accent-vibrant rounded-l-none'
                        : 'text-secondary-fixed-dim hover:bg-surface-muted hover:text-white'
                    )}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '20px',
                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Ver mi tienda */}
          <div className="mt-6 pt-4 border-t border-surface-muted">
            <Link
              href={`/tienda/${tienda.slug}`}
              target="_blank"
              onClick={handleNavClick}
              className="flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg text-sm font-medium text-secondary-fixed-dim hover:bg-surface-muted hover:text-accent-vibrant transition-colors touch-manipulation"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>open_in_new</span>
              Ver mi tienda
            </Link>
          </div>
        </nav>

        {/* Footer / logout */}
        <div className="px-4 py-4 border-t border-surface-muted">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full min-h-[44px] px-4 py-3 rounded-lg text-sm font-medium text-secondary-fixed-dim hover:text-white hover:bg-surface-muted transition-colors touch-manipulation"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
