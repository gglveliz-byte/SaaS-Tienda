import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { formatPrice, ESTADO_PEDIDO_LABELS } from '@/lib/utils'
import Link from 'next/link'

async function getEstadisticas(tiendaId: string) {
  const [
    totalProductos,
    productosActivos,
    productosStockBajo,
    pedidosHoy,
    pedidosPendientes,
    ventasMes,
  ] = await Promise.all([
    prisma.producto.count({ where: { tiendaId } }),
    prisma.producto.count({ where: { tiendaId, activo: true } }),
    prisma.producto.count({ where: { tiendaId, stock: { lte: 5 } } }),
    prisma.pedido.count({
      where: {
        tiendaId,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.pedido.count({ where: { tiendaId, estado: 'pendiente' } }),
    prisma.pedido.findMany({
      where: {
        tiendaId,
        estado: 'completado',
        createdAt: { gte: new Date(new Date().setDate(1)) },
      },
      select: { total: true },
    }),
  ])

  return {
    totalProductos,
    productosActivos,
    productosStockBajo,
    pedidosHoy,
    pedidosPendientes,
    ventasMes: ventasMes.reduce((acc, p) => acc + Number(p.total), 0),
  }
}

async function getUltimosPedidos(tiendaId: string) {
  return prisma.pedido.findMany({
    where: { tiendaId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  })
}

async function getProductosStockBajo(tiendaId: string) {
  return prisma.producto.findMany({
    where: { tiendaId, stock: { lte: 5 } },
    take: 5,
    orderBy: { stock: 'asc' },
  })
}

export default async function VendedorDashboardPage() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) return null

  const [stats, ultimosPedidos, productosStockBajo] = await Promise.all([
    getEstadisticas(session.tiendaId),
    getUltimosPedidos(session.tiendaId),
    getProductosStockBajo(session.tiendaId),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Resumen de tu tienda</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600/20 rounded-lg">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Productos</p>
                <p className="text-2xl font-bold text-white">{stats.productosActivos}/{stats.totalProductos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Stock Bajo</p>
                <p className="text-2xl font-bold text-white">{stats.productosStockBajo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pedidos Pendientes</p>
                <p className="text-2xl font-bold text-white">{stats.pedidosPendientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pedidos Hoy</p>
                <p className="text-2xl font-bold text-white">{stats.pedidosHoy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Ventas del Mes</p>
                <p className="text-2xl font-bold text-white">{formatPrice(stats.ventasMes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos pedidos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimos Pedidos</CardTitle>
            <Link href="/vendedor/pedidos" className="text-sm text-indigo-400 hover:text-indigo-300">
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent>
            {ultimosPedidos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay pedidos aún</p>
            ) : (
              <div className="space-y-3">
                {ultimosPedidos.map((pedido) => (
                  <Link
                    key={pedido.id}
                    href={`/vendedor/pedidos/${pedido.id}`}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white">
                        Pedido #{pedido.numeroPedido.toString().padStart(3, '0')}
                      </p>
                      <p className="text-sm text-gray-400">{pedido.clienteNombre}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{formatPrice(Number(pedido.total))}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ESTADO_PEDIDO_LABELS[pedido.estado].color}`}>
                        {ESTADO_PEDIDO_LABELS[pedido.estado].label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Productos con stock bajo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stock Bajo</CardTitle>
            <Link href="/vendedor/productos" className="text-sm text-indigo-400 hover:text-indigo-300">
              Ver todos →
            </Link>
          </CardHeader>
          <CardContent>
            {productosStockBajo.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay productos con stock bajo</p>
            ) : (
              <div className="space-y-3">
                {productosStockBajo.map((producto) => (
                  <Link
                    key={producto.id}
                    href={`/vendedor/productos/${producto.id}`}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <p className="font-medium text-white">{producto.nombre}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      producto.stock === 0
                        ? 'bg-red-900/50 text-red-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {producto.stock} en stock
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
