import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Catalogo } from '@/components/tienda/Catalogo'

async function getTienda(slug: string) {
  return prisma.tienda.findUnique({
    where: { slug, activa: true },
    include: {
      categorias: {
        where: { activa: true },
        orderBy: { orden: 'asc' },
      },
      productos: {
        where: { activo: true },
        orderBy: [{ destacado: 'desc' }, { createdAt: 'desc' }],
        include: {
          categoria: true,
          archivos: {
            where: { tipo: 'imagen' },
            take: 1,
            orderBy: { orden: 'asc' },
          },
        },
      },
    },
  })
}

export default async function TiendaCatalogoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tienda = await getTienda(slug)

  if (!tienda) {
    notFound()
  }

  // Transformar productos para el componente
  const productos = tienda.productos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: Number(p.precio),
    precioOferta: p.precioOferta ? Number(p.precioOferta) : undefined,
    stock: p.stock,
    destacado: p.destacado,
    categoriaId: p.categoriaId,
    categoriaNombre: p.categoria?.nombre,
    imagenId: p.archivos[0]?.id,
  }))

  const categorias = tienda.categorias.map((c) => ({
    id: c.id,
    nombre: c.nombre,
  }))

  return (
    <Catalogo
      productos={productos}
      categorias={categorias}
      tiendaSlug={tienda.slug}
      categoriaGeneral={tienda.categoriaGeneral}
    />
  )
}
