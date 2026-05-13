import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { formatPrice, ESTADO_PEDIDO_LABELS } from '@/lib/utils'
import Link from 'next/link'

async function getEstadisticas(tiendaId: string) {
  const [totalProductos, productosActivos, productosStockBajo, pedidosHoy, pedidosPendientes, ventasMes] =
    await Promise.all([
      prisma.producto.count({ where: { tiendaId } }),
      prisma.producto.count({ where: { tiendaId, activo: true } }),
      prisma.producto.count({ where: { tiendaId, stock: { lte: 5 } } }),
      prisma.pedido.count({ where: { tiendaId, createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      prisma.pedido.count({ where: { tiendaId, estado: 'pendiente' } }),
      prisma.pedido.findMany({ where: { tiendaId, estado: 'completado', createdAt: { gte: new Date(new Date().setDate(1)) } }, select: { total: true } }),
    ])
  return { totalProductos, productosActivos, productosStockBajo, pedidosHoy, pedidosPendientes, ventasMes: ventasMes.reduce((acc, p) => acc + Number(p.total), 0) }
}

async function getUltimosPedidos(tiendaId: string) {
  return prisma.pedido.findMany({ where: { tiendaId }, take: 5, orderBy: { createdAt: 'desc' }, include: { items: true } })
}

async function getProductosStockBajo(tiendaId: string) {
  return prisma.producto.findMany({ where: { tiendaId, stock: { lte: 5 } }, take: 5, orderBy: { stock: 'asc' } })
}

const statCards = [
  { key: 'productosActivos', label: 'Productos Activos', icon: 'inventory_2', color: 'text-primary bg-primary/10', suffix: (s: any) => `/${s.totalProductos}` },
  { key: 'productosStockBajo', label: 'Stock Bajo', icon: 'warning', color: 'text-amber-600 bg-amber-50', suffix: () => '' },
  { key: 'pedidosPendientes', label: 'Pedidos Pendientes', icon: 'pending_actions', color: 'text-blue-600 bg-blue-50', suffix: () => '' },
  { key: 'pedidosHoy', label: 'Pedidos Hoy', icon: 'today', color: 'text-green-600 bg-green-50', suffix: () => '' },
]

export default async function VendedorDashboardPage() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) return null

  const [stats, ultimosPedidos, productosStockBajo] = await Promise.all([
    getEstadisticas(session.tiendaId),
    getUltimosPedidos(session.tiendaId),
    getProductosStockBajo(session.tiendaId),
  ])

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
          <p className="text-secondary text-sm mt-0.5">Resumen de tu tienda</p>
        </div>
        <Link
          href="/vendedor/productos/nuevo"
          className="flex items-center gap-2 bg-accent-vibrant text-surface-deep font-bold px-4 py-2.5 rounded-lg hover:bg-accent-hover transition-colors text-sm shadow-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Nuevo producto
        </Link>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon, color, suffix }) => (
          <div key={key} className="bg-surface rounded-xl shadow-sm border border-border-light p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <div>
              <p className="text-xs text-secondary font-medium">{label}</p>
              <p className="text-xl font-bold text-on-surface mt-0.5">
                {key === 'ventasMes' ? formatPrice((stats as any)[key]) : (stats as any)[key]}
                <span className="text-sm font-normal text-secondary">{suffix(stats)}</span>
              </p>
            </div>
          </div>
        ))}

        {/* Ventas del mes — card doble */}
        <div className="col-span-2 bg-gradient-to-r from-surface-deep to-[#1a1a2e] rounded-xl shadow-sm border border-surface-muted p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent-vibrant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-surface-deep" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
          <div>
            <p className="text-xs text-secondary-fixed-dim font-medium">Ventas del Mes</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{formatPrice(stats.ventasMes)}</p>
          </div>
        </div>
      </div>

      {/* Tabla y alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Últimos pedidos */}
        <div className="bg-surface rounded-xl shadow-sm border border-border-light overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <h3 className="font-bold text-on-surface">Últimos Pedidos</h3>
            <Link href="/vendedor/pedidos" className="text-xs text-primary hover:text-accent-hover font-medium transition-colors">
              Ver todos →
            </Link>
          </div>
          {ultimosPedidos.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <span className="material-symbols-outlined text-border-light" style={{ fontSize: '40px' }}>shopping_bag</span>
              <p className="text-secondary text-sm mt-2">No hay pedidos aún</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {ultimosPedidos.map((pedido) => (
                <Link
                  key={pedido.id}
                  href={`/vendedor/pedidos/${pedido.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-surface-container-low transition-colors group"
                >
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      #{pedido.numeroPedido.toString().padStart(3, '0')}
                    </p>
                    <p className="text-xs text-secondary truncate max-w-[140px]">{pedido.clienteNombre}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-sm font-bold text-on-surface">{formatPrice(Number(pedido.total))}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ESTADO_PEDIDO_LABELS[pedido.estado].color}`}>
                      {ESTADO_PEDIDO_LABELS[pedido.estado].label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Productos stock bajo */}
        <div className="bg-surface rounded-xl shadow-sm border border-border-light overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>warning</span>
              <h3 className="font-bold text-on-surface">Stock Bajo</h3>
            </div>
            <Link href="/vendedor/productos" className="text-xs text-primary hover:text-accent-hover font-medium transition-colors">
              Ver todos →
            </Link>
          </div>
          {productosStockBajo.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <span className="material-symbols-outlined text-green-500" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-secondary text-sm mt-2">Todos los productos tienen stock suficiente</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {productosStockBajo.map((producto) => (
                <Link
                  key={producto.id}
                  href={`/vendedor/productos/${producto.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-surface-container-low transition-colors"
                >
                  <p className="text-sm font-medium text-on-surface truncate max-w-[180px]">{producto.nombre}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    producto.stock === 0
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {producto.stock === 0 ? 'Agotado' : `${producto.stock} und.`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
