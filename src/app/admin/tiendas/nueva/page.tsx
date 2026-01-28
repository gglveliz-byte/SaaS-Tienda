import { prisma } from '@/lib/prisma'
import { CrearTiendaForm } from '@/components/admin/CrearTiendaForm'

async function getPlanes() {
  const rows = await prisma.plan.findMany({
    where: { activo: true },
    orderBy: { precioMensual: 'asc' },
  })
  return rows.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    precioMensual: Number(p.precioMensual),
    permiteVideos: p.permiteVideos,
    maxProductos: p.maxProductos,
    maxImagenesPorProducto: p.maxImagenesPorProducto,
    activo: p.activo,
    createdAt: p.createdAt.toISOString(),
  }))
}

export default async function NuevaTiendaPage() {
  const planes = await getPlanes()

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Nueva Tienda</h1>
        <p className="text-gray-400 mt-1">Crea una nueva tienda y asigna un vendedor</p>
      </div>

      {planes.length === 0 ? (
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-6 text-center">
          <p className="text-yellow-400">
            Primero debes crear al menos un plan antes de crear tiendas.
          </p>
          <a href="/admin/planes" className="text-indigo-400 hover:underline mt-2 inline-block">
            Ir a crear planes →
          </a>
        </div>
      ) : (
        <CrearTiendaForm planes={planes} />
      )}
    </div>
  )
}
