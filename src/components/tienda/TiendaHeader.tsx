'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const { totalItems, isLoaded } = useCarrito(tienda.slug)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const prevTotalRef = useRef(totalItems)

  // Verificar si estamos en la página del carrito o checkout
  const isCartPage = pathname.includes('/carrito') || pathname.includes('/checkout')

  // Detectar cuando se agregan productos al carrito
  useEffect(() => {
    if (isLoaded && totalItems > prevTotalRef.current) {
      setIsAnimating(true)
      setShowTooltip(true)

      const animTimer = setTimeout(() => setIsAnimating(false), 600)
      const tooltipTimer = setTimeout(() => setShowTooltip(false), 2500)

      return () => {
        clearTimeout(animTimer)
        clearTimeout(tooltipTimer)
      }
    }
    prevTotalRef.current = totalItems
  }, [totalItems, isLoaded])

  return (
    <header className="sticky top-0 z-50 bg-[var(--secondary)]/95 backdrop-blur-sm border-b border-[var(--muted)]/30 safe-area-inset-top">
      <div className="max-w-7xl mx-auto px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3">
        <Link href={`/tienda/${tienda.slug}`} className="flex items-center gap-2 min-w-0 min-h-[44px] items-center touch-manipulation active:opacity-80">
          {tienda.logoId ? (
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0">
              <Image
                src={`/api/archivos/${tienda.logoId}`}
                alt={tienda.nombre}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {tienda.nombre[0]}
            </div>
          )}
          <span className="text-base sm:text-lg font-bold text-[var(--text)] truncate">{tienda.nombre}</span>
        </Link>

        <div className="relative flex items-center gap-2">
          {/* Flecha constante cuando hay productos y NO estamos en carrito/checkout */}
          {totalItems > 0 && !isCartPage && !showTooltip && (
            <div className="hidden sm:flex items-center gap-1 text-[var(--primary)] animate-pulse-soft">
              <span className="text-xs font-medium">Completa tu compra</span>
              <svg className="w-5 h-5 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          )}

          {/* Tooltip de producto agregado */}
          {showTooltip && (
            <div className="absolute right-0 -bottom-14 sm:-bottom-12 z-50 animate-fade-in-up">
              <div className="bg-green-500 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Agregado al carrito
                <div className="absolute -top-1.5 right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-green-500" />
              </div>
            </div>
          )}

          <Link
            href={`/tienda/${tienda.slug}/carrito`}
            className={`relative flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 py-2.5 sm:px-3 sm:py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-md shrink-0 touch-manipulation ${
              isAnimating ? 'animate-cart-bounce scale-105' : ''
            } ${totalItems > 0 && !isCartPage ? 'ring-2 ring-[var(--primary)]/50 ring-offset-2 ring-offset-[var(--secondary)]' : ''}`}
          >
            <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isAnimating ? 'animate-wiggle' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="hidden sm:inline text-sm">Carrito</span>
            {totalItems > 0 && (
              <span className={`bg-white text-[var(--primary)] min-w-[1.1rem] h-4 sm:h-5 px-1 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                isAnimating ? 'animate-ping-once' : ''
              }`}>
                {totalItems}
              </span>
            )}

            {/* Flecha móvil constante */}
            {totalItems > 0 && !isCartPage && !showTooltip && (
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 sm:hidden">
                <svg className="w-6 h-6 text-[var(--primary)] animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes cart-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes ping-once {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-cart-bounce {
          animation: cart-bounce 0.35s ease-in-out;
        }
        .animate-wiggle {
          animation: wiggle 0.35s ease-in-out;
        }
        .animate-ping-once {
          animation: ping-once 0.35s ease-in-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.25s ease-out;
        }
        .animate-bounce-x {
          animation: bounce-x 1s ease-in-out infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  )
}
