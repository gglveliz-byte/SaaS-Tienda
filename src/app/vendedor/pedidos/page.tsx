import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Card, CardContent, Badge } from '@/components/ui'
import { formatPrice, formatDateTime, ESTADO_PEDIDO_LABELS } from '@/lib/utils'
import Link from 'next/link'

async function getPedidos(tiendaId: string) {
  return prisma.pedido.findMany({
    where: { tiendaId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  })
}

export default async function PedidosPage() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) return null

  const pedidos = await getPedidos(session.tiendaId)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Pedidos</h1>
        <p className="text-gray-400 mt-1">Gestiona los pedidos de tu tienda</p>
      </div>

      {pedidos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay pedidos</h3>
            <p className="text-gray-400">Los pedidos aparecerán aquí cuando tus clientes compren</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                  <th className="px-6 py-4 font-medium">Pedido</th>
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Productos</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="text-gray-300 hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/vendedor/pedidos/${pedido.id}`}
                        className="font-medium text-white hover:text-indigo-400"
                      >
                        #{pedido.numeroPedido.toString().padStart(3, '0')}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{pedido.clienteNombre}</p>
                        <p className="text-sm text-gray-500">{pedido.clienteTelefono}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{pedido.items.length} productos</td>
                    <td className="px-6 py-4 font-medium text-white">
                      {formatPrice(Number(pedido.total))}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          pedido.estado === 'completado'
                            ? 'success'
                            : pedido.estado === 'cancelado'
                            ? 'danger'
                            : pedido.estado === 'en_proceso'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {ESTADO_PEDIDO_LABELS[pedido.estado].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDateTime(pedido.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
