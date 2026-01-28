import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET - Listar productos
export async function GET() {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const productos = await prisma.producto.findMany({
      where: { tiendaId: session.tiendaId },
      orderBy: { createdAt: 'desc' },
      include: {
        categoria: true,
        archivos: true,
      },
    })

    return NextResponse.json({ productos })
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST - Crear producto
export async function POST(request: Request) {
  const session = await getSession('vendedor')
  if (!session?.tiendaId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()

    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string
    const precio = parseFloat(formData.get('precio') as string)
    const precioOferta = formData.get('precioOferta') ? parseFloat(formData.get('precioOferta') as string) : null
    const stock = parseInt(formData.get('stock') as string) || 0
    const categoriaId = formData.get('categoriaId') as string || null
    const activo = formData.get('activo') === 'true'
    const destacado = formData.get('destacado') === 'true'

    // Verificar límite de productos según plan
    const tienda = await prisma.tienda.findUnique({
      where: { id: session.tiendaId },
      include: { plan: true, _count: { select: { productos: true } } },
    })

    if (!tienda) {
      return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 })
    }

    if (tienda._count.productos >= tienda.plan.maxProductos) {
      return NextResponse.json(
        { error: `Has alcanzado el límite de ${tienda.plan.maxProductos} productos de tu plan` },
        { status: 400 }
      )
    }

    // Crear producto
    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio,
        precioOferta,
        stock,
        categoriaId: categoriaId || null,
        activo,
        destacado,
        tiendaId: session.tiendaId,
      },
    })

    // Procesar archivos (imágenes y videos)
    const archivos = formData.getAll('archivos') as File[]

    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i]
      if (!archivo.size) continue

      const tipo = archivo.type.startsWith('video/') ? 'video' : 'imagen'

      // Verificar si puede subir videos
      if (tipo === 'video' && !tienda.plan.permiteVideos) {
        continue // Saltar videos si el plan no lo permite
      }

      const buffer = Buffer.from(await archivo.arrayBuffer())

      await prisma.archivo.create({
        data: {
          tipo,
          nombreOriginal: archivo.name,
          mimeType: archivo.type,
          tamano: archivo.size,
          data: buffer,
          orden: i,
          tiendaId: session.tiendaId,
          productoId: producto.id,
        },
      })
    }

    return NextResponse.json({ success: true, producto })
  } catch (error) {
    console.error('Error al crear producto:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
