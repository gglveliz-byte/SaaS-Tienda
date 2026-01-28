import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ProductoForm } from '@/components/vendedor/ProductoForm'

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

export default async function NuevoProductoPage() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) return null

  const [categorias, tienda] = await Promise.all([
    getCategorias(session.tiendaId),
    getTiendaInfo(session.tiendaId),
  ])

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Nuevo Producto</h1>
        <p className="text-gray-400 mt-1">Añade un producto a tu catálogo</p>
      </div>

      <ProductoForm
        categorias={categorias}
        permiteVideos={tienda?.plan.permiteVideos || false}
        maxImagenes={tienda?.plan.maxImagenesPorProducto || 5}
      />
    </div>
  )
}
