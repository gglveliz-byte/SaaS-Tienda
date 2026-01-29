import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui'
import { formatPrice, formatDateTime, ESTADO_PEDIDO_LABELS } from '@/lib/utils'
import Link from 'next/link'
import { PedidosTable } from '@/components/vendedor/PedidosTable'

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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Pedidos</h1>
        <p className="text-gray-400 text-sm">Gestiona los pedidos de tu tienda</p>
      </div>

      {pedidos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-4">📦</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No hay pedidos</h3>
            <p className="text-gray-400 text-sm">Los pedidos aparecerán aquí cuando tus clientes compren</p>
          </CardContent>
        </Card>
      ) : (
        <PedidosTable pedidos={pedidos} />
      )}
    </div>
  )
}
