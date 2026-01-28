'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Select } from '@/components/ui'
import { formatPrice, formatDateTime, ESTADO_PEDIDO_LABELS } from '@/lib/utils'
import type { PedidoConItems, EstadoPedido } from '@/types'

export default function DetallePedidoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [pedido, setPedido] = useState<PedidoConItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchPedido()
  }, [id])

  const fetchPedido = async () => {
    try {
      const res = await fetch(`/api/vendedor/pedidos/${id}`)
      const data = await res.json()
      setPedido(data.pedido)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateEstado = async (nuevoEstado: EstadoPedido) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/vendedor/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (res.ok) {
        fetchPedido()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Pedido no encontrado</p>
      </div>
    )
  }

  const estadoOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-white">
            Pedido #{pedido.numeroPedido.toString().padStart(3, '0')}
          </h1>
          <p className="text-gray-400 mt-1">{formatDateTime(pedido.createdAt)}</p>
        </div>
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
          className="text-base px-4 py-2"
        >
          {ESTADO_PEDIDO_LABELS[pedido.estado].label}
        </Badge>
      </div>

      {/* Cambiar estado */}
      <Card>
        <CardHeader>
          <CardTitle>Actualizar Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Select
                label="Estado del pedido"
                value={pedido.estado}
                onChange={(e) => updateEstado(e.target.value as EstadoPedido)}
                options={estadoOptions}
                disabled={updating}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Nombre</p>
              <p className="text-white font-medium">{pedido.clienteNombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Teléfono</p>
              <p className="text-white font-medium">{pedido.clienteTelefono}</p>
            </div>
            {pedido.clienteDireccion && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-400">Dirección</p>
                <p className="text-white">{pedido.clienteDireccion}</p>
              </div>
            )}
            {pedido.notas && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-400">Notas</p>
                <p className="text-white">{pedido.notas}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                <th className="px-6 py-3 font-medium">Producto</th>
                <th className="px-6 py-3 font-medium text-right">Precio</th>
                <th className="px-6 py-3 font-medium text-right">Cantidad</th>
                <th className="px-6 py-3 font-medium text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {pedido.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-white">{item.nombreProducto}</td>
                  <td className="px-6 py-4 text-right text-gray-300">
                    {formatPrice(Number(item.precioUnitario))}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-300">{item.cantidad}</td>
                  <td className="px-6 py-4 text-right text-white font-medium">
                    {formatPrice(Number(item.subtotal))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-gray-700">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right text-gray-400">
                  Subtotal
                </td>
                <td className="px-6 py-4 text-right text-white">
                  {formatPrice(Number(pedido.subtotal))}
                </td>
              </tr>
              <tr className="text-lg">
                <td colSpan={3} className="px-6 py-4 text-right text-white font-semibold">
                  Total
                </td>
                <td className="px-6 py-4 text-right text-indigo-400 font-bold">
                  {formatPrice(Number(pedido.total))}
                </td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
