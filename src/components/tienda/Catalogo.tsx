'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCarrito } from '@/hooks/useCarrito'
import { formatPrice } from '@/lib/utils'
import { TiendaHeader } from './TiendaHeader'
import { TiendaFooter } from './TiendaFooter'
import type { CategoriaGeneral } from '@/types'

interface Producto {
  id: string
  nombre: string
  descripcion?: string | null
  precio: number
  precioOferta?: number
  stock: number
  destacado: boolean
  categoriaId?: string | null
  categoriaNombre?: string
  imagenId?: string
}

interface Categoria { id: string; nombre: string }

interface CatalogoProps {
  productos: Producto[]
  categorias: Categoria[]
  tiendaSlug: string
  tiendaNombre: string
  tiendaWhatsapp?: string | null
  tiendaDireccion?: string | null
  tiendaLatitud?: number | null
  tiendaLongitud?: number | null
  categoriaGeneral: CategoriaGeneral
}

export function Catalogo({ productos, categorias, tiendaSlug, tiendaNombre, tiendaWhatsapp, tiendaDireccion, tiendaLatitud, tiendaLongitud }: CatalogoProps) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(
    () => categorias.length > 0 ? categorias[0].id : null
  )
  const [ordenar, setOrdenar] = useState<'reciente' | 'precio-asc' | 'precio-desc'>('reciente')
  const [productoAgregado, setProductoAgregado] = useState<string | null>(null)
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  const { items, agregar, obtenerCantidad, total, vaciar, eliminar, actualizar } = useCarrito(tiendaSlug)
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

  const productosFiltrados = useMemo(() => {
    let r = [...productos]
    if (busqueda) {
      const t = busqueda.toLowerCase()
      r = r.filter((p) => p.nombre.toLowerCase().includes(t) || p.descripcion?.toLowerCase().includes(t))
    }
    if (categoriaSeleccionada) r = r.filter((p) => p.categoriaId === categoriaSeleccionada)
    switch (ordenar) {
      case 'precio-asc': r.sort((a, b) => (a.precioOferta ?? a.precio) - (b.precioOferta ?? b.precio)); break
      case 'precio-desc': r.sort((a, b) => (b.precioOferta ?? b.precio) - (a.precioOferta ?? a.precio)); break
      default: r.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0))
    }
    return r
  }, [productos, busqueda, categoriaSeleccionada, ordenar])

  const handleAgregar = (producto: Producto) => {
    agregar({ productoId: producto.id, nombre: producto.nombre, precio: producto.precio, precioOferta: producto.precioOferta, stock: producto.stock, imagenId: producto.imagenId })
    setProductoAgregado(producto.id)
    setTimeout(() => setProductoAgregado(null), 1500)
  }

  const handleWhatsApp = () => {
    if (!tiendaWhatsapp || items.length === 0) return
    const lineas = items.map((i) => `• ${i.nombre} x${i.cantidad} = ${formatPrice((i.precioOferta ?? i.precio) * i.cantidad)}`)
    const msg = `¡Hola! Quiero hacer un pedido:\n\n${lineas.join('\n')}\n\n*Total: ${formatPrice(total)}*`
    window.open(`https://wa.me/${tiendaWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const descuento = (p: Producto) =>
    p.precioOferta ? Math.round((1 - p.precioOferta / p.precio) * 100) : 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <TiendaHeader
        nombre={tiendaNombre}
        slug={tiendaSlug}
        categorias={categorias}
        categoriaActual={categoriaSeleccionada}
        onCategoriaChange={setCategoriaSeleccionada}
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        totalCarrito={totalItems}
        onVerCarrito={() => setCarritoAbierto(true)}
      />

      {/* Hero banner */}
      <section className="bg-gradient-to-br from-surface-deep via-[#1a1a2e] to-surface-deep py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-vibrant">Tienda en línea</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{tiendaNombre}</h1>
            <p className="text-secondary-fixed-dim text-base md:text-lg">
              Descubre nuestra colección completa. Calidad garantizada y envío directo a tu puerta.
            </p>
            <button
              onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
              className="self-start bg-accent-vibrant text-surface-deep font-bold px-7 py-3 rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
            >
              Ver productos
            </button>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-surface-muted flex flex-col items-center justify-center gap-2 border border-surface-muted">
              <span className="material-symbols-outlined text-accent-vibrant" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              <span className="text-2xl font-bold text-white">{productos.length}</span>
              <span className="text-xs text-secondary-fixed-dim">Productos</span>
            </div>
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-accent-vibrant flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-surface-deep" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              <span className="text-sm font-bold text-surface-deep text-center leading-tight">Pedidos por WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de beneficios */}
      <section className="border-y border-border-light bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-border-light">
          {[
            { icon: 'support_agent', title: 'Soporte directo', sub: 'Atención por WhatsApp' },
            { icon: 'verified_user', title: 'Compra segura', sub: 'Pago contra entrega' },
            { icon: 'local_shipping', title: 'Envío rápido', sub: 'A todo el país' },
            { icon: 'replay', title: 'Garantía', sub: 'Satisfacción garantizada' },
          ].map((b) => (
            <div key={b.icon} className="flex items-center gap-3 px-4 py-5">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-amber-600" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{b.title}</p>
                <p className="text-xs text-secondary">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias visuales */}
      {categorias.length > 1 && !busqueda && (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-10 pt-8">
          <h2 className="text-lg font-bold text-on-surface mb-4">Explorar por categoría</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setCategoriaSeleccionada(null)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                categoriaSeleccionada === null
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>apps</span>
              Todos ({productos.length})
            </button>
            {categorias.map((cat, i) => {
              const count = productos.filter(p => p.categoriaId === cat.id).length
              const icons = ['category', 'sell', 'inventory_2', 'star', 'favorite', 'local_offer']
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaSeleccionada(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    categoriaSeleccionada === cat.id
                      ? 'bg-amber-500 text-gray-900 border-amber-500 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>{icons[i % icons.length]}</span>
                  {cat.nombre} ({count})
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Productos Destacados */}
      {productos.filter(p => p.destacado).length > 0 && !busqueda && !categoriaSeleccionada && (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-10 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
              <h2 className="text-lg font-bold text-on-surface">Destacados</h2>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {productos.filter(p => p.destacado).slice(0, 8).map(producto => {
              const precioFinal = producto.precioOferta ?? producto.precio
              const pct = producto.precioOferta ? Math.round((1 - producto.precioOferta / producto.precio) * 100) : 0
              return (
                <div key={producto.id} className="shrink-0 w-44 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {pct > 0 && (
                      <span className="absolute top-2 left-2 z-10 bg-gray-900 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded">-{pct}%</span>
                    )}
                    <Link href={`/tienda/${tiendaSlug}/producto/${producto.id}`} className="block w-full h-full">
                      {producto.imagenId ? (
                        <Image src={`/api/archivos/${producto.imagenId}`} alt={producto.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="176px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-200" style={{ fontSize: '40px' }}>image</span>
                        </div>
                      )}
                    </Link>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5">{producto.nombre}</p>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(precioFinal)}</p>
                    <button
                      onClick={() => handleAgregar(producto)}
                      disabled={producto.stock === 0}
                      className="mt-2 w-full py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-colors disabled:opacity-40"
                    >
                      {producto.stock === 0 ? 'Agotado' : 'Agregar'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Catálogo principal */}
      <main id="productos" className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-8">

        {/* Controles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border-light">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">
              {categoriaSeleccionada
                ? categorias.find((c) => c.id === categoriaSeleccionada)?.nombre ?? 'Productos'
                : 'Todos los productos'}
            </h2>
            <p className="text-sm text-secondary mt-0.5">{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value as typeof ordenar)}
              className="bg-surface border border-border-light rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-surface-deep focus:ring-1 focus:ring-accent-vibrant/30 cursor-pointer"
            >
              <option value="reciente">Más recientes</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-border-light" style={{ fontSize: '64px' }}>search_off</span>
            <p className="text-xl font-semibold text-on-surface">No se encontraron productos</p>
            <p className="text-secondary text-sm">Intenta con otra búsqueda o categoría</p>
            <button onClick={() => { setBusqueda(''); setCategoriaSeleccionada(null) }} className="mt-2 px-5 py-2 bg-accent-vibrant text-surface-deep font-bold rounded-lg hover:bg-accent-hover transition-colors text-sm">
              Ver todos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {productosFiltrados.map((producto) => {
              const cantidadEnCarrito = obtenerCantidad(producto.id)
              const precioFinal = producto.precioOferta ?? producto.precio
              const pct = descuento(producto)

              return (
                <div
                  key={producto.id}
                  className="group bg-surface rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border-light overflow-hidden flex flex-col"
                >
                  {/* Imagen */}
                  <div className="relative aspect-square bg-surface-container-low flex items-center justify-center overflow-hidden">
                    {pct > 0 && (
                      <span className="absolute top-3 left-3 z-10 bg-surface-deep text-accent-vibrant text-[11px] font-bold px-2 py-0.5 rounded">
                        -{pct}%
                      </span>
                    )}
                    {producto.destacado && !pct && (
                      <span className="absolute top-3 left-3 z-10 bg-accent-vibrant text-surface-deep text-[11px] font-bold px-2 py-0.5 rounded">
                        Destacado
                      </span>
                    )}
                    <Link href={`/tienda/${tiendaSlug}/producto/${producto.id}`} className="block w-full h-full">
                      {producto.imagenId ? (
                        <Image
                          src={`/api/archivos/${producto.imagenId}`}
                          alt={producto.nombre}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-darken"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-border-light" style={{ fontSize: '56px' }}>image</span>
                        </div>
                      )}
                    </Link>
                    {/* Acciones hover */}
                    <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <button
                        onClick={() => handleAgregar(producto)}
                        disabled={producto.stock === 0}
                        className="w-9 h-9 bg-surface-deep text-white rounded-full shadow flex items-center justify-center hover:bg-accent-vibrant hover:text-surface-deep transition-colors disabled:opacity-40"
                        title="Agregar al carrito"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_cart</span>
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    {producto.categoriaNombre && (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">{producto.categoriaNombre}</span>
                    )}
                    <Link href={`/tienda/${tiendaSlug}/producto/${producto.id}`}>
                      <h3 className="text-sm font-semibold text-on-surface line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {producto.nombre}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <span className="text-base font-bold text-on-surface">{formatPrice(precioFinal)}</span>
                      {pct > 0 && <span className="text-xs text-secondary line-through">{formatPrice(producto.precio)}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAgregar(producto)}
                      disabled={producto.stock === 0 || productoAgregado === producto.id}
                      className={`mt-1 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        producto.stock === 0
                          ? 'bg-surface-container-high text-secondary cursor-not-allowed'
                          : productoAgregado === producto.id
                          ? 'bg-green-500 text-white'
                          : 'bg-surface-deep text-white hover:bg-accent-vibrant hover:text-surface-deep active:scale-95'
                      }`}
                    >
                      {producto.stock === 0 ? (
                        'Agotado'
                      ) : productoAgregado === producto.id ? (
                        <><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span> Agregado</>
                      ) : cantidadEnCarrito > 0 ? (
                        <><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Agregar más ({cantidadEnCarrito})</>
                      ) : (
                        <><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>shopping_cart</span> Agregar</>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Sección Cómo comprar */}
      <section className="bg-gray-900 py-12 px-4 md:px-10 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Simple y rápido</span>
          <h2 className="text-2xl font-bold text-white mt-2 mb-8">¿Cómo hacer tu pedido?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: '01', icon: 'shopping_cart', title: 'Elige tus productos', desc: 'Navega el catálogo y agrega lo que más te gusta al carrito' },
              { num: '02', icon: 'chat', title: 'Envía tu pedido', desc: 'Con un clic enviamos tu pedido directamente por WhatsApp' },
              { num: '03', icon: 'local_shipping', title: 'Recibe en casa', desc: 'Coordinamos la entrega a tu dirección o punto de encuentro' },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-2xl border border-gray-700">
                <span className="text-5xl font-black text-gray-700">{s.num}</span>
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-900" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="text-sm text-gray-400 text-center leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          {tiendaWhatsapp && (
            <a
              href={`https://wa.me/${tiendaWhatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-8 bg-[#25D366] hover:bg-[#20b858] text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contactar por WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <TiendaFooter
        nombre={tiendaNombre}
        slug={tiendaSlug}
        whatsapp={tiendaWhatsapp}
        direccion={tiendaDireccion}
        latitud={tiendaLatitud}
        longitud={tiendaLongitud}
      />

      {/* Carrito flotante */}
      {totalItems > 0 && !carritoAbierto && (
        <button
          onClick={() => setCarritoAbierto(true)}
          className="fixed bottom-6 right-6 z-40 bg-accent-vibrant text-surface-deep w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-accent-hover transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
          <span className="absolute -top-1 -right-1 bg-surface-deep text-accent-vibrant text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        </button>
      )}

      {/* Drawer del carrito */}
      {carritoAbierto && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setCarritoAbierto(false)} />
          <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-surface z-50 shadow-2xl flex flex-col">
            {/* Header carrito */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                <h2 className="text-lg font-bold text-on-surface">Mi Carrito</h2>
                <span className="text-sm text-secondary">({totalItems} items)</span>
              </div>
              <button onClick={() => setCarritoAbierto(false)} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-border-light" style={{ fontSize: '56px' }}>shopping_cart</span>
                  <p className="text-secondary">Tu carrito está vacío</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productoId} className="flex gap-3 p-3 bg-surface-container-low rounded-xl border border-border-light">
                    <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden shrink-0">
                      {item.imagenId ? (
                        <img src={`/api/archivos/${item.imagenId}`} alt={item.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-border-light">image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{item.nombre}</p>
                      <p className="text-sm font-bold text-on-surface mt-0.5">{formatPrice(item.precioOferta ?? item.precio)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => actualizar(item.productoId, item.cantidad - 1)} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>remove</span>
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.cantidad}</span>
                        <button onClick={() => actualizar(item.productoId, item.cantidad + 1)} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                        </button>
                        <button onClick={() => eliminar(item.productoId)} className="ml-auto p-1 text-error hover:bg-error-container rounded-lg transition-colors">
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer carrito */}
            {items.length > 0 && (
              <div className="border-t border-border-light px-5 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary">Total</span>
                  <span className="text-xl font-bold text-on-surface">{formatPrice(total)}</span>
                </div>
                {tiendaWhatsapp ? (
                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-3 bg-[#25D366] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#20b858] transition-colors text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Pedir por WhatsApp
                  </button>
                ) : (
                  <button className="w-full py-3 bg-accent-vibrant text-surface-deep font-bold rounded-xl hover:bg-accent-hover transition-colors text-sm">
                    Proceder al pedido
                  </button>
                )}
                <button onClick={vaciar} className="w-full py-2 text-sm text-secondary hover:text-error transition-colors">
                  Vaciar carrito
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </div>
  )
}
