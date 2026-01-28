'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCarrito } from '@/hooks/useCarrito'
import { formatPrice } from '@/lib/utils'
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

interface Categoria {
  id: string
  nombre: string
}

interface CatalogoProps {
  productos: Producto[]
  categorias: Categoria[]
  tiendaSlug: string
  categoriaGeneral: CategoriaGeneral
}

export function Catalogo({
  productos,
  categorias,
  tiendaSlug,
}: CatalogoProps) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null)
  const [ordenar, setOrdenar] = useState<'reciente' | 'precio-asc' | 'precio-desc'>('reciente')

  const { agregar, obtenerCantidad } = useCarrito(tiendaSlug)

  const productosFiltrados = useMemo(() => {
    let resultado = [...productos]

    // Filtrar por búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase()
      resultado = resultado.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.descripcion?.toLowerCase().includes(termino)
      )
    }

    // Filtrar por categoría
    if (categoriaSeleccionada) {
      resultado = resultado.filter((p) => p.categoriaId === categoriaSeleccionada)
    }

    // Ordenar
    switch (ordenar) {
      case 'precio-asc':
        resultado.sort((a, b) => (a.precioOferta ?? a.precio) - (b.precioOferta ?? b.precio))
        break
      case 'precio-desc':
        resultado.sort((a, b) => (b.precioOferta ?? b.precio) - (a.precioOferta ?? a.precio))
        break
      default:
        // Mantener destacados primero
        resultado.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0))
    }

    return resultado
  }, [productos, busqueda, categoriaSeleccionada, ordenar])

  const handleAgregar = (producto: Producto) => {
    agregar({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precioOferta: producto.precioOferta,
      stock: producto.stock,
      imagenId: producto.imagenId,
    })
  }

  return (
    <div className="space-y-8">
      {/* Buscador y filtros */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 pl-11 sm:pl-12 bg-white border border-[var(--muted)]/30 rounded-xl text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent shadow-sm"
          />
          <svg
            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={ordenar}
          onChange={(e) => setOrdenar(e.target.value as typeof ordenar)}
          className="w-full sm:w-auto px-4 py-3 bg-white border border-[var(--muted)]/30 rounded-xl text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm appearance-none cursor-pointer bg-no-repeat bg-[length:1rem] bg-[right_0.75rem_center] pr-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")' }}
        >
          <option value="reciente">Más recientes</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
        </select>
      </div>

      {/* Categorías */}
      {categorias.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoriaSeleccionada(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              !categoriaSeleccionada
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-white text-[var(--text)] border-[var(--muted)]/30 hover:border-[var(--primary)]/50'
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSeleccionada(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                categoriaSeleccionada === cat.id
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-white text-[var(--text)] border-[var(--muted)]/30 hover:border-[var(--primary)]/50'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Productos */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--muted)] text-lg">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {productosFiltrados.map((producto) => {
            const cantidadEnCarrito = obtenerCantidad(producto.id)
            const precioFinal = producto.precioOferta ?? producto.precio
            const tieneOferta = producto.precioOferta !== undefined

            return (
              <div
                key={producto.id}
                className="group bg-white rounded-2xl overflow-hidden border border-[var(--muted)]/20 hover:border-[var(--primary)]/40 hover:shadow-md transition-all duration-300"
              >
                <Link href={`/tienda/${tiendaSlug}/producto/${producto.id}`}>
                  <div className="aspect-square relative overflow-hidden bg-[var(--secondary)]/30">
                    {producto.imagenId ? (
                      <Image
                        src={`/api/archivos/${producto.imagenId}`}
                        alt={producto.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-[var(--muted)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {producto.destacado && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-[var(--primary)] text-white text-xs font-medium rounded-full shadow">
                        Destacado
                      </span>
                    )}
                    {tieneOferta && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full shadow">
                        Oferta
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-3 sm:p-4">
                  <Link href={`/tienda/${tiendaSlug}/producto/${producto.id}`}>
                    <h3 className="font-medium text-[var(--text)] line-clamp-2 hover:text-[var(--primary)] transition-colors">
                      {producto.nombre}
                    </h3>
                  </Link>

                  {producto.categoriaNombre && (
                    <p className="text-[var(--muted)] text-sm mt-1">{producto.categoriaNombre}</p>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-[var(--primary)]">
                        {formatPrice(precioFinal)}
                      </p>
                      {tieneOferta && (
                        <p className="text-sm text-[var(--muted)] line-through">
                          {formatPrice(producto.precio)}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAgregar(producto)}
                    disabled={producto.stock === 0}
                    className={`mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      producto.stock === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[var(--primary)] text-white hover:brightness-110 shadow-sm'
                    }`}
                  >
                    {producto.stock === 0 ? (
                      'Agotado'
                    ) : cantidadEnCarrito > 0 ? (
                      `En carrito (${cantidadEnCarrito})`
                    ) : (
                      'Agregar al carrito'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
