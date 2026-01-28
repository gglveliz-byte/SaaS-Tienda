'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCarrito } from '@/hooks/useCarrito'
import { formatPrice, generateWhatsAppUrl } from '@/lib/utils'

interface Archivo {
  id: string
  tipo: string
}

interface ProductoDetalle {
  id: string
  nombre: string
  descripcion?: string | null
  precio: number
  precioOferta?: number
  stock: number
  categoriaNombre?: string
  archivos: Archivo[]
}

interface DetalleProductoProps {
  producto: ProductoDetalle
  tiendaSlug: string
  tiendaWhatsapp: string
}

export function DetalleProducto({
  producto,
  tiendaSlug,
  tiendaWhatsapp,
}: DetalleProductoProps) {
  const [archivoActivo, setArchivoActivo] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const { agregar, obtenerCantidad } = useCarrito(tiendaSlug)

  const cantidadEnCarrito = obtenerCantidad(producto.id)
  const precioFinal = producto.precioOferta ?? producto.precio
  const tieneOferta = producto.precioOferta !== undefined
  const archivoSeleccionado = producto.archivos[archivoActivo]

  const handleAgregar = () => {
    agregar(
      {
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        precioOferta: producto.precioOferta,
        stock: producto.stock,
        imagenId: producto.archivos.find((a) => a.tipo === 'imagen')?.id,
      },
      cantidad
    )
  }

  const handleConsultarWhatsApp = () => {
    const mensaje = `Hola, me interesa el producto: ${producto.nombre} (${formatPrice(precioFinal)})`
    const url = generateWhatsAppUrl(tiendaWhatsapp, mensaje)
    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Galería */}
      <div className="space-y-4">
        <div className="aspect-square relative rounded-2xl overflow-hidden bg-white/5">
          {archivoSeleccionado ? (
            archivoSeleccionado.tipo === 'video' ? (
              <video
                src={`/api/archivos/${archivoSeleccionado.id}`}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={`/api/archivos/${archivoSeleccionado.id}`}
                alt={producto.nombre}
                fill
                className="object-contain"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {producto.archivos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {producto.archivos.map((archivo, i) => (
              <button
                key={archivo.id}
                onClick={() => setArchivoActivo(i)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === archivoActivo ? 'border-[var(--primary)]' : 'border-transparent'
                }`}
              >
                {archivo.tipo === 'video' ? (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                ) : (
                  <Image
                    src={`/api/archivos/${archivo.id}`}
                    alt=""
                    fill
                    className="object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-6">
        <div>
          {producto.categoriaNombre && (
            <p className="text-[var(--primary)] text-sm font-medium mb-2">
              {producto.categoriaNombre}
            </p>
          )}
          <h1 className="text-3xl font-bold text-white">{producto.nombre}</h1>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-[var(--primary)]">
            {formatPrice(precioFinal)}
          </span>
          {tieneOferta && (
            <span className="text-xl text-[var(--muted)] line-through">
              {formatPrice(producto.precio)}
            </span>
          )}
        </div>

        {producto.descripcion && (
          <p className="text-[var(--muted)] leading-relaxed">{producto.descripcion}</p>
        )}

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              producto.stock > 5
                ? 'bg-green-500/20 text-green-400'
                : producto.stock > 0
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {producto.stock > 5
              ? 'En stock'
              : producto.stock > 0
              ? `Últimas ${producto.stock} unidades`
              : 'Agotado'}
          </span>
        </div>

        {/* Cantidad */}
        {producto.stock > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-[var(--muted)]">Cantidad:</span>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-white font-medium">{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={handleAgregar}
            disabled={producto.stock === 0}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all ${
              producto.stock === 0
                ? 'bg-white/10 text-[var(--muted)] cursor-not-allowed'
                : 'bg-[var(--primary)] text-white hover:brightness-110'
            }`}
          >
            {producto.stock === 0
              ? 'Producto agotado'
              : cantidadEnCarrito > 0
              ? `Agregar más (${cantidadEnCarrito} en carrito)`
              : 'Agregar al carrito'}
          </button>

          <button
            onClick={handleConsultarWhatsApp}
            className="w-full py-4 rounded-xl text-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar por WhatsApp
          </button>
        </div>

        <Link
          href={`/tienda/${tiendaSlug}`}
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors"
        >
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
