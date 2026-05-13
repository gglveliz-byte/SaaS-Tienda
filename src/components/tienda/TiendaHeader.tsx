'use client'

import { useState } from 'react'
import Link from 'next/link'

interface TiendaHeaderProps {
  nombre: string
  slug: string
  categorias: { id: string; nombre: string }[]
  categoriaActual?: string | null
  onCategoriaChange: (id: string | null) => void
  busqueda: string
  onBusquedaChange: (v: string) => void
  totalCarrito: number
  onVerCarrito: () => void
}

export function TiendaHeader({
  nombre,
  slug,
  categorias,
  categoriaActual,
  onCategoriaChange,
  busqueda,
  onBusquedaChange,
  totalCarrito,
  onVerCarrito,
}: TiendaHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-surface border-b border-border-light shadow-sm sticky top-0 z-50">
      {/* Barra superior */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex flex-col md:flex-row items-center gap-3 md:gap-0 justify-between">

        {/* Logo + Búsqueda */}
        <div className="flex items-center gap-6 w-full md:w-auto">
          {/* Logo */}
          <Link href={`/tienda/${slug}`} className="shrink-0 flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-accent-vibrant flex items-center justify-center">
              <span
                className="material-symbols-outlined text-surface-deep"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
              >
                shopping_cart
              </span>
            </div>
            <span className="text-xl font-bold text-on-surface leading-tight">
              {nombre}
            </span>
          </Link>

          {/* Buscador desktop */}
          <div className="hidden md:flex flex-1 items-center bg-surface-container-low rounded-full px-4 py-2 border border-border-light focus-within:border-surface-deep focus-within:ring-1 focus-within:ring-accent-vibrant transition-all min-w-[260px]">
            <span className="material-symbols-outlined text-secondary mr-2" style={{ fontSize: '20px' }}>search</span>
            <input
              className="bg-transparent border-none outline-none w-full text-sm text-on-surface placeholder:text-secondary"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              type="text"
            />
            {busqueda && (
              <button
                onClick={() => onBusquedaChange('')}
                className="text-secondary hover:text-on-surface transition-colors ml-1"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Carrito */}
          <button
            onClick={onVerCarrito}
            className="relative flex flex-col items-center text-on-surface hover:text-accent-hover transition-colors"
            aria-label="Ver carrito"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
            {totalCarrito > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-vibrant text-surface-deep w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold">
                {totalCarrito}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase mt-0.5 hidden md:block">Carrito</span>
          </button>

          {/* Botón menú móvil */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-on-surface hover:text-accent-hover transition-colors"
            aria-label="Menú"
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Buscador móvil */}
        <div className="w-full flex md:hidden items-center bg-surface-container-low rounded-full px-4 py-2 border border-border-light">
          <span className="material-symbols-outlined text-secondary mr-2" style={{ fontSize: '18px' }}>search</span>
          <input
            className="bg-transparent border-none outline-none w-full text-sm text-on-surface placeholder:text-secondary"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            type="text"
          />
        </div>
      </div>

      {/* Barra de categorías */}
      {categorias.length > 0 && (
        <nav className="border-t border-border-light bg-surface">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
              <button
                onClick={() => onCategoriaChange(null)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !categoriaActual
                    ? 'bg-surface-deep text-white'
                    : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                Todo
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoriaChange(cat.id)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    categoriaActual === cat.id
                      ? 'bg-accent-vibrant text-surface-deep font-bold'
                      : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
