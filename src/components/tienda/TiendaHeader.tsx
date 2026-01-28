'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCarrito } from '@/hooks/useCarrito'
import type { CategoriaGeneral } from '@/types'

interface TiendaHeaderProps {
  tienda: {
    nombre: string
    slug: string
    categoriaGeneral: CategoriaGeneral
    logoId?: string
  }
}

export function TiendaHeader({ tienda }: TiendaHeaderProps) {
  const { totalItems } = useCarrito(tienda.slug)

  return (
    <header className="sticky top-0 z-50 bg-[var(--secondary)]/95 backdrop-blur-sm border-b border-[var(--muted)]/30">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        <Link href={`/tienda/${tienda.slug}`} className="flex items-center gap-2 sm:gap-3 min-w-0">
          {tienda.logoId ? (
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0">
              <Image
                src={`/api/archivos/${tienda.logoId}`}
                alt={tienda.nombre}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold shrink-0">
              {tienda.nombre[0]}
            </div>
          )}
          <span className="text-lg sm:text-xl font-bold text-[var(--text)] truncate">{tienda.nombre}</span>
        </Link>

        <Link
          href={`/tienda/${tienda.slug}/carrito`}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity shadow-md shrink-0"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="hidden sm:inline">Ver carrito</span>
          {totalItems > 0 && (
            <span className="bg-white text-[var(--primary)] min-w-[1.25rem] h-5 px-1.5 rounded-full flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
