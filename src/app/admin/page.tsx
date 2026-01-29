import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

async function getEstadisticas() {
  const [
    totalTiendas,
    tiendasActivas,
    pedidosMes,
    pedidosPorEstado,
  ] = await Promise.all([
    prisma.tienda.count(),
    prisma.tienda.count({ where: { activa: true } }),
    prisma.pedido.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
      select: {
        total: true,
        estado: true,
      },
    }),
    prisma.pedido.groupBy({
      by: ['estado'],
      _count: true,
    }),
  ])

  const ingresosMes = pedidosMes
    .filter(p => p.estado === 'completado')
    .reduce((acc, p) => acc + Number(p.total), 0)

  const estadosCounts = {
    pendiente: 0,
    en_proceso: 0,
    completado: 0,
    cancelado: 0,
  }

  pedidosPorEstado.forEach(p => {
    estadosCounts[p.estado] = p._count
  })

  return {
    totalTiendas,
    tiendasActivas,
    tiendasInactivas: totalTiendas - tiendasActivas,
    totalPedidosMes: pedidosMes.length,
    ingresosMes,
    pedidosPorEstado: estadosCounts,
  }
}

async function getUltimasTiendas() {
  return prisma.tienda.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      plan: true,
      _count: {
        select: { productos: true, pedidos: true },
      },
    },
  })
}

export default async function AdminDashboardPage() {
  const [stats, ultimasTiendas] = await Promise.all([
    getEstadisticas(),
    getUltimasTiendas(),
  ])

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Resumen general del sistema</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="p-2 sm:p-3 bg-indigo-600/20 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Total Tiendas</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stats.totalTiendas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="p-2 sm:p-3 bg-green-600/20 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Tiendas Activas</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stats.tiendasActivas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="p-2 sm:p-3 bg-yellow-600/20 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Pedidos Mes</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stats.totalPedidosMes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="p-2 sm:p-3 bg-emerald-600/20 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Ingresos Mes</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{formatPrice(stats.ingresosMes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos por estado */}
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <CardTitle className="text-base sm:text-lg">Estado de Pedidos</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <div className="p-2 sm:p-3 lg:p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <p className="text-xs sm:text-sm text-yellow-400">Pendientes</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-300">{stats.pedidosPorEstado.pendiente}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-400">En Proceso</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-300">{stats.pedidosPorEstado.en_proceso}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <p className="text-xs sm:text-sm text-green-400">Completados</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-300">{stats.pedidosPorEstado.completado}</p>
            </div>
            <div className="p-2 sm:p-3 lg:p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-xs sm:text-sm text-red-400">Cancelados</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-300">{stats.pedidosPorEstado.cancelado}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Últimas tiendas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 lg:p-6">
          <CardTitle className="text-base sm:text-lg">Últimas Tiendas</CardTitle>
          <Link
            href="/admin/tiendas"
            className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300"
          >
            Ver todas →
          </Link>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
          {ultimasTiendas.length === 0 ? (
            <p className="text-gray-500 text-center py-4 sm:py-8 text-sm">
              No hay tiendas creadas aún.{' '}
              <Link href="/admin/tiendas/nueva" className="text-indigo-400 hover:underline">
                Crear primera tienda
              </Link>
            </p>
          ) : (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full min-w-[500px] text-xs sm:text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="pb-2 sm:pb-3 font-medium px-3 sm:px-0">Tienda</th>
                    <th className="pb-2 sm:pb-3 font-medium">Plan</th>
                    <th className="pb-2 sm:pb-3 font-medium">Prod.</th>
                    <th className="pb-2 sm:pb-3 font-medium">Ped.</th>
                    <th className="pb-2 sm:pb-3 font-medium pr-3 sm:pr-0">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {ultimasTiendas.map((tienda) => (
                    <tr key={tienda.id} className="text-gray-300">
                      <td className="py-2 sm:py-3 px-3 sm:px-0">
                        <Link
                          href={`/admin/tiendas/${tienda.id}`}
                          className="font-medium text-white hover:text-indigo-400"
                        >
                          {tienda.nombre}
                        </Link>
                        <p className="text-xs text-gray-500">/{tienda.slug}</p>
                      </td>
                      <td className="py-2 sm:py-3">{tienda.plan.nombre}</td>
                      <td className="py-2 sm:py-3">{tienda._count.productos}</td>
                      <td className="py-2 sm:py-3">{tienda._count.pedidos}</td>
                      <td className="py-2 sm:py-3 pr-3 sm:pr-0">
                        <span
                          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                            tienda.activa
                              ? 'bg-green-900/50 text-green-400'
                              : 'bg-red-900/50 text-red-400'
                          }`}
                        >
                          {tienda.activa ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
