import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { DetalleProducto } from '@/components/tienda/DetalleProducto'

async function getProducto(id: string, tiendaSlug: string) {
  return prisma.producto.findFirst({
    where: {
      id,
      activo: true,
      tienda: { slug: tiendaSlug, activa: true },
    },
    include: {
      tienda: { select: { slug: true, whatsapp: true } },
      categoria: true,
      archivos: { orderBy: { orden: 'asc' } },
    },
  })
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const producto = await getProducto(id, slug)

  if (!producto) {
    notFound()
  }

  return (
    <DetalleProducto
      producto={{
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        precioOferta: producto.precioOferta ? Number(producto.precioOferta) : undefined,
        stock: producto.stock,
        categoriaNombre: producto.categoria?.nombre,
        archivos: producto.archivos.map((a) => ({
          id: a.id,
          tipo: a.tipo,
        })),
      }}
      tiendaSlug={producto.tienda.slug}
      tiendaWhatsapp={producto.tienda.whatsapp}
    />
  )
}
