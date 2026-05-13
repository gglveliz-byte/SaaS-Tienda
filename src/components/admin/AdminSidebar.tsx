'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { href: '/admin',         label: 'Dashboard',     icon: 'dashboard' },
  { href: '/admin/tiendas', label: 'Tiendas',        icon: 'storefront' },
  { href: '/admin/planes',  label: 'Planes',         icon: 'workspace_premium' },
]

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
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
        {/* Logo / Header */}
        <div className="px-6 py-5 border-b border-surface-muted flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center">
              <span className="material-symbols-outlined text-accent-vibrant text-[22px]">
                admin_panel_settings
              </span>
            </div>
            <div>
              <h1 className="text-base font-bold text-accent-vibrant leading-tight">Tienda Digital</h1>
              <p className="text-[11px] text-secondary-fixed-dim">Panel de Administración</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-secondary-fixed-dim hover:text-white hover:bg-surface-muted rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg text-sm font-medium transition-all touch-manipulation',
                      isActive
                        ? 'bg-surface-muted text-accent-vibrant border-l-[3px] border-accent-vibrant rounded-l-none'
                        : 'text-secondary-fixed-dim hover:bg-surface-muted hover:text-white'
                    )}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-surface-muted space-y-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full min-h-[44px] px-4 py-3 rounded-lg text-sm font-medium text-secondary-fixed-dim hover:text-white hover:bg-surface-muted transition-colors touch-manipulation"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
