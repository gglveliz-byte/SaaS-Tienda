import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

async function getProductos(tiendaId: string) {
  return prisma.producto.findMany({
    where: { tiendaId },
    orderBy: { createdAt: 'desc' },
    include: {
      categoria: true,
      archivos: { where: { tipo: 'imagen' }, take: 1, orderBy: { orden: 'asc' } },
    },
  })
}

export default async function ProductosPage() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) return null

  const productos = await getProductos(session.tiendaId)

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona tu catálogo de productos</p>
        </div>
        <Link
          href="/vendedor/productos/nuevo"
          className="inline-flex items-center gap-2 bg-[#FFC107] hover:bg-[#EBB413] text-gray-900 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Nuevo Producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-gray-300" style={{ fontSize: '36px' }}>inventory_2</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No hay productos</h3>
          <p className="text-gray-500 text-sm mb-6">Añade tu primer producto al catálogo</p>
          <Link
            href="/vendedor/productos/nuevo"
            className="inline-flex items-center gap-2 bg-[#FFC107] hover:bg-[#EBB413] text-gray-900 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
            Crear primer producto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabla */}
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productos.map((producto) => {
                const precioFinal = producto.precioOferta ?? producto.precio
                const stockBajo = producto.stock <= 5 && producto.stock > 0
                const agotado = producto.stock === 0

                return (
                  <tr key={producto.id} className="hover:bg-amber-50/30 transition-colors group border-l-[3px] border-transparent hover:border-[#FFC107]">
                    {/* Producto */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {/* Imagen pequeña */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-100">
                          {producto.archivos[0] ? (
                            <Image
                              src={`/api/archivos/${producto.archivos[0].id}`}
                              alt={producto.nombre}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-gray-300" style={{ fontSize: '22px' }}>image</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">{producto.nombre}</p>
                          {producto.destacado && (
                            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">⭐ Destacado</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-500">
                        {producto.categoria?.nombre ?? '—'}
                      </span>
                    </td>

                    {/* Precio */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{formatPrice(Number(precioFinal))}</p>
                        {producto.precioOferta && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(Number(producto.precio))}</p>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-sm font-medium ${
                        agotado ? 'text-red-500' :
                        stockBajo ? 'text-amber-600' :
                        'text-gray-700'
                      }`}>
                        {producto.stock} und.
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        !producto.activo
                          ? 'bg-gray-50 text-gray-500 border-gray-200'
                          : agotado
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : stockBajo
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {!producto.activo ? 'Inactivo' : agotado ? 'Agotado' : stockBajo ? 'Stock bajo' : 'Activo'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/vendedor/productos/${producto.id}`}
                        className="text-sm font-semibold text-gray-600 hover:text-[#1C1C1E] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
