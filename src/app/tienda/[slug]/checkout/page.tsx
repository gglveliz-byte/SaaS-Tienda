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
  const { items, total, vaciar, isLoaded } = useCarrito(slug)

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
    // Solo redirigir si el carrito ya se cargó y está vacío
    if (isLoaded && items.length === 0) {
      router.push(`/tienda/${slug}`)
    }
  }, [items, router, slug, isLoaded])

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

  // Mostrar loading mientras se carga el carrito
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-white/30 border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Finalizar Compra</h1>
        <p className="text-[var(--muted)] mt-1 text-sm sm:text-base">Completa tus datos para enviar el pedido</p>
      </div>

      {/* En móvil: resumen primero, luego formulario */}
      <div className="flex flex-col-reverse lg:flex-row lg:gap-8">
        {/* Formulario */}
        <div className="flex-1 mt-6 lg:mt-0">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">Tus datos</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                      placeholder="+52 123 456 7890"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Entrega</h2>
                  <p className="text-xs text-[var(--muted)]">Opcional</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                  Dirección de entrega
                </label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none transition-all"
                  placeholder="Calle, número, colonia, código postal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-2">
                  Notas adicionales
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none transition-all"
                  placeholder="Instrucciones especiales, horario preferido..."
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-4 bg-green-600 text-white rounded-2xl text-base sm:text-lg font-semibold hover:bg-green-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-green-600/20 touch-manipulation"
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

        {/* Resumen - visible arriba en móvil */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Tu pedido</h2>
            </div>

            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productoId} className="flex justify-between items-start gap-2 py-2 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.nombre}</p>
                    <p className="text-[var(--muted)] text-xs">Cant: {item.cantidad}</p>
                  </div>
                  <span className="text-white text-sm font-medium whitespace-nowrap">
                    {formatPrice((item.precioOferta ?? item.precio) * item.cantidad)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted)]">Total</span>
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                El pago se coordina por WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
