'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CarritoItem } from '@/types'

const CARRITO_KEY = 'tienda_saas_carrito'

interface UseCarritoReturn {
  items: CarritoItem[]
  tiendaSlug: string | null
  total: number
  totalItems: number
  isLoaded: boolean
  agregar: (item: Omit<CarritoItem, 'cantidad'>, cantidad?: number) => void
  eliminar: (productoId: string) => void
  actualizar: (productoId: string, cantidad: number) => void
  vaciar: () => void
  obtenerCantidad: (productoId: string) => number
}

export function useCarrito(slugTienda?: string): UseCarritoReturn {
  const [items, setItems] = useState<CarritoItem[]>([])
  const [tiendaSlug, setTiendaSlug] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar carrito del localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(CARRITO_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Si hay un slug de tienda y es diferente al almacenado, limpiar carrito
        if (slugTienda && data.tiendaSlug !== slugTienda) {
          setItems([])
          setTiendaSlug(slugTienda)
        } else {
          setItems(data.items || [])
          setTiendaSlug(data.tiendaSlug || null)
        }
      } catch {
        setItems([])
        setTiendaSlug(slugTienda || null)
      }
    } else {
      setTiendaSlug(slugTienda || null)
    }
    setIsLoaded(true)
  }, [slugTienda])

  // Guardar carrito en localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return

    localStorage.setItem(
      CARRITO_KEY,
      JSON.stringify({ tiendaSlug, items })
    )
  }, [items, tiendaSlug, isLoaded])

  const agregar = useCallback(
    (item: Omit<CarritoItem, 'cantidad'>, cantidad = 1) => {
      setItems((prev) => {
        const existente = prev.find((i) => i.productoId === item.productoId)
        if (existente) {
          const nuevaCantidad = Math.min(
            existente.cantidad + cantidad,
            item.stock
          )
          return prev.map((i) =>
            i.productoId === item.productoId
              ? { ...i, cantidad: nuevaCantidad }
              : i
          )
        }
        return [...prev, { ...item, cantidad: Math.min(cantidad, item.stock) }]
      })
      if (slugTienda) setTiendaSlug(slugTienda)
    },
    [slugTienda]
  )

  const eliminar = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId))
  }, [])

  const actualizar = useCallback((productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminar(productoId)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productoId === productoId
          ? { ...i, cantidad: Math.min(cantidad, i.stock) }
          : i
      )
    )
  }, [eliminar])

  const vaciar = useCallback(() => {
    setItems([])
  }, [])

  const obtenerCantidad = useCallback(
    (productoId: string) => {
      const item = items.find((i) => i.productoId === productoId)
      return item?.cantidad || 0
    },
    [items]
  )

  const total = items.reduce((acc, item) => {
    const precio = item.precioOferta ?? item.precio
    return acc + precio * item.cantidad
  }, 0)

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)

  return {
    items,
    tiendaSlug,
    total,
    totalItems,
    isLoaded,
    agregar,
    eliminar,
    actualizar,
    vaciar,
    obtenerCantidad,
  }
}
