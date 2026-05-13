import { prisma } from '@/lib/prisma'
import { CATEGORIA_GENERAL_LABELS, formatDate } from '@/lib/utils'
import Link from 'next/link'

async function getTiendas() {
  return prisma.tienda.findMany({
    orderBy: { createdAt: 'desc' },
    include: { plan: true, vendedor: true, _count: { select: { productos: true, pedidos: true } } },
  })
}

export default async function TiendasPage() {
  const tiendas = await getTiendas()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tiendas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona todas las tiendas del sistema</p>
        </div>
        <Link
          href="/admin/tiendas/nueva"
          className="inline-flex items-center gap-2 bg-[#FFC107] hover:bg-[#EBB413] text-gray-900 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Nueva Tienda
        </Link>
      </div>

      {tiendas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-gray-300" style={{ fontSize: '36px' }}>storefront</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No hay tiendas</h3>
          <p className="text-gray-500 text-sm mb-6">Crea la primera tienda para empezar</p>
          <Link
            href="/admin/tiendas/nueva"
            className="inline-flex items-center gap-2 bg-[#FFC107] hover:bg-[#EBB413] text-gray-900 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            Crear primera tienda
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {tiendas.map((tienda) => (
            <div
              key={tienda.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4 hover:shadow-md hover:border-amber-200 transition-all group"
            >
              {/* Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-amber-600" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>storefront</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <Link
                      href={`/admin/tiendas/${tienda.id}`}
                      className="text-base font-bold text-gray-900 hover:text-amber-600 transition-colors"
                    >
                      {tienda.nombre}
                    </Link>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      tienda.activa
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {tienda.activa ? 'Activa' : 'Inactiva'}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                      {CATEGORIA_GENERAL_LABELS[tienda.categoriaGeneral]}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-mono bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">/tienda/{tienda.slug}</span>
                    <span>Plan: <b className="text-gray-700">{tienda.plan.nombre}</b></span>
                    <span className="hidden sm:inline">Vendedor: <b className="text-gray-700">{tienda.vendedor?.nombre ?? '—'}</b></span>
                  </div>
                </div>

                {/* Métricas */}
                <div className="hidden lg:flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{tienda._count.productos}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Productos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{tienda._count.pedidos}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pedidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Creada</p>
                    <p className="text-xs font-medium text-gray-600">{formatDate(tienda.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/tienda/${tienda.slug}`}
                  target="_blank"
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Ver tienda"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>open_in_new</span>
                </Link>
                <Link
                  href={`/admin/tiendas/${tienda.id}`}
                  className="text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
