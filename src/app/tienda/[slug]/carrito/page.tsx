'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCarrito } from '@/hooks/useCarrito'
import { formatPrice } from '@/lib/utils'

export default function CarritoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { items, total, actualizar, eliminar, vaciar } = useCarrito(slug)

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h2>
        <p className="text-[var(--muted)] mb-6">Agrega productos para empezar a comprar</p>
        <Link
          href={`/tienda/${slug}`}
          className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:brightness-110 transition-all"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Tu Carrito</h1>
        <button
          onClick={vaciar}
          className="text-sm text-[var(--muted)] hover:text-red-400 transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const precioUnitario = item.precioOferta ?? item.precio
          return (
            <div
              key={item.productoId}
              className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                {item.imagenId ? (
                  <Image
                    src={`/api/archivos/${item.imagenId}`}
                    alt={item.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-white">{item.nombre}</h3>
                <p className="text-[var(--primary)] font-semibold mt-1">
                  {formatPrice(precioUnitario)}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => actualizar(item.productoId, item.cantidad - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-white">{item.cantidad}</span>
                  <button
                    onClick={() => actualizar(item.productoId, item.cantidad + 1)}
                    disabled={item.cantidad >= item.stock}
                    className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-white font-semibold">
                  {formatPrice(precioUnitario * item.cantidad)}
                </p>
                <button
                  onClick={() => eliminar(item.productoId)}
                  className="text-sm text-red-400 hover:text-red-300 mt-2"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total y botones */}
      <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg text-[var(--muted)]">Total</span>
          <span className="text-3xl font-bold text-[var(--primary)]">
            {formatPrice(total)}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={`/tienda/${slug}/checkout`}
            className="w-full py-4 bg-[var(--primary)] text-white rounded-xl text-lg font-semibold text-center hover:brightness-110 transition-all"
          >
            Proceder al pago
          </Link>
          <Link
            href={`/tienda/${slug}`}
            className="w-full py-4 bg-white/10 text-white rounded-xl text-lg font-semibold text-center hover:bg-white/20 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
