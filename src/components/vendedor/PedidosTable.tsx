import Link from 'next/link'
import { Card, CardContent } from '@/components/ui'
import { formatPrice, formatDateTime, ESTADO_PEDIDO_LABELS } from '@/lib/utils'
import type { Pedido, EstadoPedido } from '@prisma/client'

type PedidoConItems = Pedido & {
  items: { id: string }[]
}

interface PedidosTableProps {
  pedidos: PedidoConItems[]
}

export function PedidosTable({ pedidos }: PedidosTableProps) {
  return (
    <>
      {/* Vista móvil: cards */}
      <div className="lg:hidden space-y-3">
        {pedidos.map((pedido) => (
          <Link
            key={pedido.id}
            href={`/vendedor/pedidos/${pedido.id}`}
            className="block touch-manipulation active:scale-[0.99]"
          >
            <Card className="overflow-hidden hover:border-indigo-500/50 transition-colors">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">
                      #{pedido.numeroPedido.toString().padStart(3, '0')}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{pedido.clienteNombre}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDateTime(pedido.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-white">
                      {formatPrice(Number(pedido.total))}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${
                        ESTADO_PEDIDO_LABELS[pedido.estado as EstadoPedido].color
                      }`}
                    >
                      {ESTADO_PEDIDO_LABELS[pedido.estado as EstadoPedido].label}
                    </span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Vista desktop: tabla */}
      <Card className="hidden lg:block overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-800 bg-gray-900/50">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pedidos.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="text-gray-300 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/vendedor/pedidos/${pedido.id}`}
                        className="font-medium text-white hover:text-indigo-400"
                      >
                        #{pedido.numeroPedido.toString().padStart(3, '0')}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/vendedor/pedidos/${pedido.id}`}
                        className="hover:text-indigo-400"
                      >
                        {pedido.clienteNombre}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">
                      {formatPrice(Number(pedido.total))}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full ${
                          ESTADO_PEDIDO_LABELS[pedido.estado as EstadoPedido].color
                        }`}
                      >
                        {ESTADO_PEDIDO_LABELS[pedido.estado as EstadoPedido].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDateTime(pedido.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/vendedor/pedidos/${pedido.id}`}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
