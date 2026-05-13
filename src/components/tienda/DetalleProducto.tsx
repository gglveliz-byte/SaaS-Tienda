'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCarrito } from '@/hooks/useCarrito'
import { formatPrice, generateWhatsAppUrl } from '@/lib/utils'
import { TiendaFooter } from './TiendaFooter'

interface Archivo { id: string; tipo: string }

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
  tiendaNombre: string
  tiendaWhatsapp: string | null
}

export function DetalleProducto({ producto, tiendaSlug, tiendaNombre, tiendaWhatsapp }: DetalleProductoProps) {
  const [archivoActivo, setArchivoActivo] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const { agregar, obtenerCantidad } = useCarrito(tiendaSlug)

  const cantidadEnCarrito = obtenerCantidad(producto.id)
  const precioFinal = producto.precioOferta ?? producto.precio
  const tieneOferta = producto.precioOferta !== undefined
  const archivoSeleccionado = producto.archivos[archivoActivo]
  const pct = tieneOferta ? Math.round((1 - producto.precioOferta! / producto.precio) * 100) : 0

  const handleAgregar = () => {
    agregar({ productoId: producto.id, nombre: producto.nombre, precio: producto.precio, precioOferta: producto.precioOferta, stock: producto.stock, imagenId: producto.archivos.find((a) => a.tipo === 'imagen')?.id }, cantidad)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  const handleWhatsApp = () => {
    const mensaje = `Hola, me interesa el producto: *${producto.nombre}* — ${formatPrice(precioFinal)}`
    const url = tiendaWhatsapp ? generateWhatsAppUrl(tiendaWhatsapp, mensaje) : '#'
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header simple para producto */}
      <header className="bg-surface border-b border-border-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center gap-4">
          <Link
            href={`/tienda/${tiendaSlug}`}
            className="flex items-center gap-2 text-secondary hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
            <span className="text-sm font-medium hidden sm:inline">Volver</span>
          </Link>
          <div className="h-5 w-px bg-border-light" />
          <Link href={`/tienda/${tiendaSlug}`} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent-vibrant flex items-center justify-center">
              <span className="material-symbols-outlined text-surface-deep" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
            </div>
            <span className="font-bold text-on-surface text-sm">{tiendaNombre}</span>
          </Link>
          <div className="ml-auto">
            {cantidadEnCarrito > 0 && (
              <Link
                href={`/tienda/${tiendaSlug}`}
                className="flex items-center gap-2 bg-accent-vibrant text-surface-deep font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-accent-hover transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                {cantidadEnCarrito} en carrito
              </Link>
            )}
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 pb-2">
          <nav className="text-xs text-secondary flex items-center gap-1">
            <Link href={`/tienda/${tiendaSlug}`} className="hover:text-on-surface transition-colors">{tiendaNombre}</Link>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            {producto.categoriaNombre && (
              <>
                <span>{producto.categoriaNombre}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
              </>
            )}
            <span className="text-on-surface font-medium truncate max-w-[200px]">{producto.nombre}</span>
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Galería */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-surface-container-low border border-border-light">
              {pct > 0 && (
                <span className="absolute top-4 left-4 z-10 bg-surface-deep text-accent-vibrant text-sm font-bold px-3 py-1 rounded">
                  -{pct}%
                </span>
              )}
              {archivoSeleccionado ? (
                archivoSeleccionado.tipo === 'video' ? (
                  <video key={archivoSeleccionado.id} src={`/api/archivos/${archivoSeleccionado.id}`} controls playsInline preload="metadata" className="w-full h-full object-contain bg-black">
                    Tu navegador no soporta videos.
                  </video>
                ) : (
                  <Image src={`/api/archivos/${archivoSeleccionado.id}`} alt={producto.nombre} fill className="object-contain" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-border-light" style={{ fontSize: '72px' }}>image</span>
                </div>
              )}
            </div>

            {producto.archivos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {producto.archivos.map((archivo, i) => (
                  <button
                    key={archivo.id}
                    onClick={() => setArchivoActivo(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      i === archivoActivo
                        ? 'border-accent-vibrant shadow-lg'
                        : 'border-border-light hover:border-surface-deep'
                    }`}
                  >
                    {archivo.tipo === 'video' ? (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                      </div>
                    ) : (
                      <Image src={`/api/archivos/${archivo.id}`} alt="" fill className="object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info del producto */}
          <div className="flex flex-col gap-6">
            {/* Encabezado */}
            <div>
              {producto.categoriaNombre && (
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                  {producto.categoriaNombre}
                </p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface leading-tight">
                {producto.nombre}
              </h1>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-on-surface">{formatPrice(precioFinal)}</span>
              {tieneOferta && (
                <span className="text-xl text-secondary line-through">{formatPrice(producto.precio)}</span>
              )}
              {pct > 0 && (
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  Ahorras {pct}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div>
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${
                producto.stock > 5 ? 'bg-green-50 text-green-700' :
                producto.stock > 0 ? 'bg-amber-50 text-amber-700' :
                'bg-error-container text-on-error-container'
              }`}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>
                  {producto.stock > 0 ? 'check_circle' : 'cancel'}
                </span>
                {producto.stock > 5 ? 'En stock' : producto.stock > 0 ? `Últimas ${producto.stock} unidades` : 'Agotado'}
              </span>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <div className="text-secondary text-base leading-relaxed border-t border-border-light pt-4">
                {producto.descripcion}
              </div>
            )}

            {/* Cantidad */}
            {producto.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-on-surface">Cantidad:</span>
                <div className="flex items-center border border-border-light rounded-lg overflow-hidden">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
                  </button>
                  <span className="w-12 text-center text-on-surface font-bold border-x border-border-light">
                    {cantidad}
                  </span>
                  <button
                    onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                    className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                  </button>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleAgregar}
                disabled={producto.stock === 0 || agregado}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  producto.stock === 0
                    ? 'bg-surface-container-high text-secondary cursor-not-allowed'
                    : agregado
                    ? 'bg-green-500 text-white'
                    : 'bg-surface-deep text-white hover:bg-accent-vibrant hover:text-surface-deep active:scale-[0.99]'
                }`}
              >
                {producto.stock === 0 ? (
                  'Producto agotado'
                ) : agregado ? (
                  <><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check</span> ¡Agregado al carrito!</>
                ) : cantidadEnCarrito > 0 ? (
                  <><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_shopping_cart</span> Agregar más ({cantidadEnCarrito} en carrito)</>
                ) : (
                  <><span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>shopping_cart</span> Agregar al carrito</>
                )}
              </button>

              {tiendaWhatsapp && (
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-4 rounded-xl font-bold text-base bg-[#25D366] text-white hover:bg-[#20b858] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <TiendaFooter nombre={tiendaNombre} slug={tiendaSlug} whatsapp={tiendaWhatsapp} />
    </div>
  )
}
