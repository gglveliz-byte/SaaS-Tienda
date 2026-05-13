import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

async function getEstadisticas() {
  const [totalTiendas, tiendasActivas, pedidosMes, pedidosPorEstado] = await Promise.all([
    prisma.tienda.count(),
    prisma.tienda.count({ where: { activa: true } }),
    prisma.pedido.findMany({ where: { createdAt: { gte: new Date(new Date().setDate(1)) } }, select: { total: true, estado: true } }),
    prisma.pedido.groupBy({ by: ['estado'], _count: true }),
  ])
  const ingresosMes = pedidosMes.filter((p) => p.estado === 'completado').reduce((acc, p) => acc + Number(p.total), 0)
  const ec: Record<string, number> = { pendiente: 0, en_proceso: 0, completado: 0, cancelado: 0 }
  pedidosPorEstado.forEach((p) => { ec[p.estado] = p._count })
  return { totalTiendas, tiendasActivas, tiendasInactivas: totalTiendas - tiendasActivas, totalPedidosMes: pedidosMes.length, ingresosMes, pedidosPorEstado: ec }
}

async function getUltimasTiendas() {
  return prisma.tienda.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { plan: true, _count: { select: { productos: true, pedidos: true } } } })
}

export default async function AdminDashboardPage() {
  const [stats, ultimasTiendas] = await Promise.all([getEstadisticas(), getUltimasTiendas()])

  const metricCards = [
    { label: 'Total Tiendas', value: stats.totalTiendas, icon: 'storefront', color: 'text-primary bg-primary/10' },
    { label: 'Tiendas Activas', value: stats.tiendasActivas, icon: 'check_circle', color: 'text-green-600 bg-green-50' },
    { label: 'Pedidos del Mes', value: stats.totalPedidosMes, icon: 'shopping_bag', color: 'text-blue-600 bg-blue-50' },
  ]

  const estadoConfig = [
    { key: 'pendiente', label: 'Pendientes', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    { key: 'en_proceso', label: 'En Proceso', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
    { key: 'completado', label: 'Completados', bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
    { key: 'cancelado', label: 'Cancelados', bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
  ]

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
          <p className="text-secondary text-sm mt-0.5">Resumen general del sistema</p>
        </div>
        <Link
          href="/admin/tiendas/nueva"
          className="flex items-center gap-2 bg-accent-vibrant text-surface-deep font-bold px-4 py-2.5 rounded-lg hover:bg-accent-hover transition-colors text-sm shadow-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Nueva tienda
        </Link>
      </div>

      {/* Métricas + ingresos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ label, value, icon, color }) => (
          <div key={label} className="bg-surface rounded-xl shadow-sm border border-border-light p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <div>
              <p className="text-xs text-secondary font-medium">{label}</p>
              <p className="text-xl font-bold text-on-surface mt-0.5">{value}</p>
            </div>
          </div>
        ))}
        {/* Ingresos — card destacada */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-r from-surface-deep to-[#1a1a2e] rounded-xl shadow-sm border border-surface-muted p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent-vibrant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-surface-deep" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
          <div>
            <p className="text-xs text-secondary-fixed-dim font-medium">Ingresos del Mes</p>
            <p className="text-xl font-bold text-white mt-0.5">{formatPrice(stats.ingresosMes)}</p>
          </div>
        </div>
      </div>

      {/* Estado de pedidos */}
      <div className="bg-surface rounded-xl shadow-sm border border-border-light p-5">
        <h3 className="font-bold text-on-surface mb-4">Estado de Pedidos (Total)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {estadoConfig.map(({ key, label, bg, text }) => (
            <div key={key} className={`p-4 rounded-xl border ${bg}`}>
              <p className={`text-xs font-medium ${text}`}>{label}</p>
              <p className={`text-2xl font-bold mt-1 ${text}`}>{stats.pedidosPorEstado[key] ?? 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Últimas tiendas */}
      <div className="bg-surface rounded-xl shadow-sm border border-border-light overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <h3 className="font-bold text-on-surface">Últimas Tiendas</h3>
          <Link href="/admin/tiendas" className="text-xs text-primary hover:text-accent-hover font-medium transition-colors">
            Ver todas →
          </Link>
        </div>
        {ultimasTiendas.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <span className="material-symbols-outlined text-border-light" style={{ fontSize: '48px' }}>storefront</span>
            <p className="text-secondary text-sm mt-2">No hay tiendas creadas aún.</p>
            <Link href="/admin/tiendas/nueva" className="mt-3 inline-block text-sm text-primary hover:underline font-medium">
              Crear primera tienda
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="text-left px-5 py-3 text-xs font-bold text-secondary uppercase tracking-wider">Tienda</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-secondary uppercase tracking-wider">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-secondary uppercase tracking-wider">Prod.</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-secondary uppercase tracking-wider">Ped.</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-secondary uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {ultimasTiendas.map((tienda) => (
                  <tr key={tienda.id} className="hover:bg-surface-container-low transition-colors group border-l-[3px] border-transparent hover:border-accent-vibrant">
                    <td className="px-5 py-3">
                      <Link href={`/admin/tiendas/${tienda.id}`} className="font-semibold text-on-surface hover:text-primary transition-colors block">
                        {tienda.nombre}
                      </Link>
                      <span className="text-xs text-secondary">/{tienda.slug}</span>
                    </td>
                    <td className="px-4 py-3 text-secondary">{tienda.plan.nombre}</td>
                    <td className="px-4 py-3 text-on-surface font-medium">{tienda._count.productos}</td>
                    <td className="px-4 py-3 text-on-surface font-medium">{tienda._count.pedidos}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tienda.activa ? 'bg-green-100 text-green-700' : 'bg-error-container text-on-error-container'}`}>
                        {tienda.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
