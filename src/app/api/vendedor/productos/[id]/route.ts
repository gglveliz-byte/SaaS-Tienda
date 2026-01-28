import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Obtener producto
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    const producto = await prisma.producto.findFirst({
      where: { id, tiendaId: session.tiendaId },
      include: {
        categoria: true,
        archivos: { orderBy: { orden: 'asc' } },
      },
    })

    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ producto })
  } catch (error) {
    console.error('Error al obtener producto:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    const formData = await request.formData()

    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string
    const precio = parseFloat(formData.get('precio') as string)
    const precioOfertaStr = formData.get('precioOferta') as string
    const precioOferta = precioOfertaStr ? parseFloat(precioOfertaStr) : null
    const stock = parseInt(formData.get('stock') as string) || 0
    const categoriaId = formData.get('categoriaId') as string || null
    const activo = formData.get('activo') === 'true'
    const destacado = formData.get('destacado') === 'true'
    const archivosAEliminar = JSON.parse(formData.get('archivosAEliminar') as string || '[]')

    // Verificar que el producto pertenece a la tienda
    const productoExistente = await prisma.producto.findFirst({
      where: { id, tiendaId: session.tiendaId },
    })

    if (!productoExistente) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Eliminar archivos marcados
    if (archivosAEliminar.length > 0) {
      await prisma.archivo.deleteMany({
        where: { id: { in: archivosAEliminar }, productoId: id },
      })
    }

    // Actualizar producto
    const producto = await prisma.producto.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        precio,
        precioOferta,
        stock,
        categoriaId: categoriaId || null,
        activo,
        destacado,
      },
    })

    // Procesar nuevos archivos
    const tienda = await prisma.tienda.findUnique({
      where: { id: session.tiendaId },
      include: { plan: true },
    })

    const archivos = formData.getAll('archivos') as File[]
    const archivosActuales = await prisma.archivo.count({ where: { productoId: id } })

    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i]
      if (!archivo.size) continue

      if (archivosActuales + i >= (tienda?.plan.maxImagenesPorProducto || 5)) break

      const tipo = archivo.type.startsWith('video/') ? 'video' : 'imagen'

      if (tipo === 'video' && !tienda?.plan.permiteVideos) continue

      const buffer = Buffer.from(await archivo.arrayBuffer())

      await prisma.archivo.create({
        data: {
          tipo,
          nombreOriginal: archivo.name,
          mimeType: archivo.type,
          tamano: archivo.size,
          data: buffer,
          orden: archivosActuales + i,
          tiendaId: session.tiendaId,
          productoId: id,
        },
      })
    }

    return NextResponse.json({ success: true, producto })
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// DELETE - Eliminar producto
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.producto.deleteMany({
      where: { id, tiendaId: session.tiendaId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
