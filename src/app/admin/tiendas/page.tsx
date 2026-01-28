import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui'
import { CATEGORIA_GENERAL_LABELS, formatDate } from '@/lib/utils'
import Link from 'next/link'

async function getTiendas() {
  return prisma.tienda.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      plan: true,
      vendedor: true,
      _count: {
        select: { productos: true, pedidos: true },
      },
    },
  })
}

export default async function TiendasPage() {
  const tiendas = await getTiendas()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tiendas</h1>
          <p className="text-gray-400 mt-1">Gestiona todas las tiendas del sistema</p>
        </div>
        <Link href="/admin/tiendas/nueva">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Tienda
          </Button>
        </Link>
      </div>

      {tiendas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay tiendas</h3>
            <p className="text-gray-400 mb-6">Crea la primera tienda para empezar</p>
            <Link href="/admin/tiendas/nueva">
              <Button>Crear primera tienda</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tiendas.map((tienda) => (
            <Card key={tienda.id}>
              <CardContent className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href={`/admin/tiendas/${tienda.id}`}
                      className="text-xl font-semibold text-white hover:text-indigo-400"
                    >
                      {tienda.nombre}
                    </Link>
                    <Badge variant={tienda.activa ? 'success' : 'danger'}>
                      {tienda.activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                    <Badge variant="info">
                      {CATEGORIA_GENERAL_LABELS[tienda.categoriaGeneral]}
                    </Badge>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">
                    <span className="text-gray-500">URL:</span>{' '}
                    <code className="bg-gray-800 px-2 py-0.5 rounded">/tienda/{tienda.slug}</code>
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Plan:</span>
                      <span className="text-white ml-2">{tienda.plan.nombre}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Vendedor:</span>
                      <span className="text-white ml-2">
                        {tienda.vendedor?.nombre || 'Sin asignar'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Productos:</span>
                      <span className="text-white ml-2">{tienda._count.productos}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Pedidos:</span>
                      <span className="text-white ml-2">{tienda._count.pedidos}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs mt-4">
                    Creada el {formatDate(tienda.createdAt)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/tienda/${tienda.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                  </Link>
                  <Link href={`/admin/tiendas/${tienda.id}`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
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
