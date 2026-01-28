import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

async function getProductos(tiendaId: string) {
  return prisma.producto.findMany({
    where: { tiendaId },
    orderBy: { createdAt: 'desc' },
    include: {
      categoria: true,
      archivos: {
        where: { tipo: 'imagen' },
        take: 1,
        orderBy: { orden: 'asc' },
      },
    },
  })
}

export default async function ProductosPage() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) return null

  const productos = await getProductos(session.tiendaId)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Productos</h1>
          <p className="text-gray-400 mt-1">Gestiona tu catálogo de productos</p>
        </div>
        <Link href="/vendedor/productos/nuevo">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {productos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay productos</h3>
            <p className="text-gray-400 mb-6">Añade tu primer producto al catálogo</p>
            <Link href="/vendedor/productos/nuevo">
              <Button>Crear primer producto</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <Card key={producto.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-800 relative">
                {producto.archivos[0] ? (
                  <Image
                    src={`/api/archivos/${producto.archivos[0].id}`}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {!producto.activo && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="danger">Inactivo</Badge>
                  </div>
                )}
                {producto.destacado && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="warning">Destacado</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{producto.nombre}</h3>
                    {producto.categoria && (
                      <p className="text-sm text-gray-500">{producto.categoria.nombre}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {producto.precioOferta ? (
                      <>
                        <p className="text-lg font-bold text-green-400">
                          {formatPrice(Number(producto.precioOferta))}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(Number(producto.precio))}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-white">
                        {formatPrice(Number(producto.precio))}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-sm ${
                    producto.stock === 0
                      ? 'text-red-400'
                      : producto.stock <= 5
                      ? 'text-yellow-400'
                      : 'text-gray-400'
                  }`}>
                    Stock: {producto.stock}
                  </span>
                  <Link href={`/vendedor/productos/${producto.id}`}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
