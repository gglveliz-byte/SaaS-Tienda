import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { ProductoForm } from '@/components/vendedor/ProductoForm'

async function getProducto(id: string, tiendaId: string) {
  return prisma.producto.findFirst({
    where: { id, tiendaId },
    include: {
      archivos: { orderBy: { orden: 'asc' } },
    },
  })
}

async function getCategorias(tiendaId: string) {
  return prisma.categoriaProducto.findMany({
    where: { tiendaId, activa: true },
    orderBy: { orden: 'asc' },
  })
}

async function getTiendaInfo(tiendaId: string) {
  return prisma.tienda.findUnique({
    where: { id: tiendaId },
    include: { plan: true },
  })
}

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) return null

  const { id } = await params

  const [producto, categorias, tienda] = await Promise.all([
    getProducto(id, session.tiendaId),
    getCategorias(session.tiendaId),
    getTiendaInfo(session.tiendaId),
  ])

  if (!producto) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Editar Producto</h1>
        <p className="text-gray-400 mt-1">{producto.nombre}</p>
      </div>

      <ProductoForm
        producto={producto}
        categorias={categorias}
        permiteVideos={tienda?.plan.permiteVideos || false}
        maxImagenes={tienda?.plan.maxImagenesPorProducto || 5}
      />
    </div>
  )
}
