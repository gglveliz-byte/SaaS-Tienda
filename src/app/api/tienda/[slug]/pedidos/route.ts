import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const body = await request.json()
    const {
      clienteNombre,
      clienteTelefono,
      clienteDireccion,
      notas,
      items,
    } = body

    // Validar campos requeridos
    if (!clienteNombre || !clienteTelefono || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Obtener tienda
    const tienda = await prisma.tienda.findUnique({
      where: { slug, activa: true },
    })

    if (!tienda) {
      return NextResponse.json(
        { error: 'Tienda no encontrada' },
        { status: 404 }
      )
    }

    // Obtener productos
    const productosIds = items.map((item: { productoId: string }) => item.productoId)
    const productos = await prisma.producto.findMany({
      where: {
        id: { in: productosIds },
        tiendaId: tienda.id,
        activo: true,
      },
    })

    if (productos.length !== items.length) {
      return NextResponse.json(
        { error: 'Algunos productos no están disponibles' },
        { status: 400 }
      )
    }

    // Calcular totales y crear items
    let subtotal = 0
    const itemsData = items.map((item: { productoId: string; cantidad: number }) => {
      const producto = productos.find((p) => p.id === item.productoId)!
      const precioUnitario = producto.precioOferta ?? producto.precio
      const itemSubtotal = Number(precioUnitario) * item.cantidad
      subtotal += itemSubtotal

      return {
        productoId: item.productoId,
        nombreProducto: producto.nombre,
        precioUnitario,
        cantidad: item.cantidad,
        subtotal: itemSubtotal,
      }
    })

    // Obtener siguiente número de pedido para la tienda
    const ultimoPedido = await prisma.pedido.findFirst({
      where: { tiendaId: tienda.id },
      orderBy: { numeroPedido: 'desc' },
    })
    const numeroPedido = (ultimoPedido?.numeroPedido || 0) + 1

    // Crear pedido con items
    const pedido = await prisma.pedido.create({
      data: {
        tiendaId: tienda.id,
        numeroPedido,
        clienteNombre,
        clienteTelefono,
        clienteDireccion,
        notas,
        subtotal,
        total: subtotal, // Por ahora sin impuestos ni envío
        enviadoWhatsapp: true,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    })

    // Actualizar stock de productos
    for (const item of items) {
      await prisma.producto.update({
        where: { id: item.productoId },
        data: {
          stock: {
            decrement: item.cantidad,
          },
        },
      })
    }

    return NextResponse.json({ success: true, pedido })
  } catch (error) {
    console.error('Error al crear pedido:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
