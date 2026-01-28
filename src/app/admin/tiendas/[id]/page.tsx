import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditarTiendaForm } from '@/components/admin/EditarTiendaForm'

async function getTienda(id: string) {
  const t = await prisma.tienda.findUnique({
    where: { id },
    include: {
      plan: true,
      vendedor: true,
    },
  })
  if (!t) return null
  return {
    ...t,
    latitud: t.latitud ? Number(t.latitud) : null,
    longitud: t.longitud ? Number(t.longitud) : null,
    plan: {
      ...t.plan,
      precioMensual: Number(t.plan.precioMensual),
    },
  }
}

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

export default async function EditarTiendaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [tienda, planes] = await Promise.all([getTienda(id), getPlanes()])

  if (!tienda) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Editar Tienda</h1>
        <p className="text-gray-400 mt-1">{tienda.nombre}</p>
      </div>

      <EditarTiendaForm tienda={tienda} planes={planes} />
    </div>
  )
}
