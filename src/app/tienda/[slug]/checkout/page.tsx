'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useCarrito } from '@/hooks/useCarrito'
import { formatPrice, generateWhatsAppUrl, generateOrderMessage } from '@/lib/utils'

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const { items, total, vaciar } = useCarrito(slug)

  const [tienda, setTienda] = useState<{ whatsapp: string } | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    notas: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Obtener datos de la tienda
    fetch(`/api/tienda/${slug}`)
      .then((res) => res.json())
      .then((data) => setTienda(data.tienda))
      .catch(console.error)
  }, [slug])

  useEffect(() => {
    if (items.length === 0) {
      router.push(`/tienda/${slug}`)
    }
  }, [items, router, slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Crear pedido en la base de datos
      const res = await fetch(`/api/tienda/${slug}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteNombre: formData.nombre,
          clienteTelefono: formData.telefono,
          clienteDireccion: formData.direccion,
          notas: formData.notas,
          items: items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al procesar el pedido')
        setLoading(false)
        return
      }

      // Generar mensaje de WhatsApp
      const itemsParaMensaje = items.map((item) => ({
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precioOferta ?? item.precio,
      }))

      const mensaje = generateOrderMessage(
        data.pedido.numeroPedido,
        formData.nombre,
        formData.telefono,
        itemsParaMensaje,
        total,
        formData.notas || undefined
      )

      // Vaciar carrito
      vaciar()

      // Abrir WhatsApp
      if (tienda?.whatsapp) {
        const whatsappUrl = generateWhatsAppUrl(tienda.whatsapp, mensaje)
        window.open(whatsappUrl, '_blank')
      }

      // Redirigir a página de éxito
      router.push(`/tienda/${slug}?pedido=exito&numero=${data.pedido.numeroPedido}`)
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/5 rounded-xl border border-white/10 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Tus datos</h2>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="+52 123 456 7890"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">
                  Dirección de entrega (opcional)
                </label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  placeholder="Calle, número, colonia..."
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  placeholder="Instrucciones especiales, horario de entrega..."
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar pedido por WhatsApp
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-4">Resumen</h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.productoId} className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">
                    {item.cantidad}x {item.nombre}
                  </span>
                  <span className="text-white">
                    {formatPrice((item.precioOferta ?? item.precio) * item.cantidad)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span className="text-lg text-[var(--muted)]">Total</span>
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
