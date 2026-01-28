import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, hashPassword } from '@/lib/auth'
import type { CategoriaGeneral } from '@prisma/client'

// GET - Listar tiendas
export async function GET() {
  const session = await getSession('admin')
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const tiendas = await prisma.tienda.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        plan: true,
        vendedor: true,
        _count: {
          select: { productos: true, pedidos: true },
        },
      },
    })

    return NextResponse.json({ tiendas })
  } catch (error) {
    console.error('Error al obtener tiendas:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST - Crear tienda
export async function POST(request: Request) {
  const session = await getSession('admin')
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      nombre,
      slug,
      descripcion,
      categoriaGeneral,
      whatsapp,
      direccion,
      latitud,
      longitud,
      planId,
      vendedorNombre,
      vendedorEmail,
      vendedorPassword,
    } = body

    // Validaciones
    if (!nombre || !slug || !whatsapp || !planId || !vendedorNombre || !vendedorEmail || !vendedorPassword) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar slug único
    const slugExiste = await prisma.tienda.findUnique({ where: { slug } })
    if (slugExiste) {
      return NextResponse.json(
        { error: 'Ya existe una tienda con ese URL' },
        { status: 400 }
      )
    }

    // Verificar email único
    const emailExiste = await prisma.vendedor.findUnique({ where: { email: vendedorEmail } })
    if (emailExiste) {
      return NextResponse.json(
        { error: 'Ya existe un vendedor con ese email' },
        { status: 400 }
      )
    }

    // Crear tienda y vendedor en transacción
    const tienda = await prisma.$transaction(async (tx) => {
      // Crear tienda
      const nuevaTienda = await tx.tienda.create({
        data: {
          nombre,
          slug,
          descripcion,
          categoriaGeneral: categoriaGeneral as CategoriaGeneral,
          whatsapp,
          direccion,
          latitud: latitud ? parseFloat(latitud) : null,
          longitud: longitud ? parseFloat(longitud) : null,
          planId,
          activa: true,
        },
      })

      // Crear vendedor
      const passwordHash = await hashPassword(vendedorPassword)
      await tx.vendedor.create({
        data: {
          nombre: vendedorNombre,
          email: vendedorEmail,
          passwordHash,
          tiendaId: nuevaTienda.id,
        },
      })

      return nuevaTienda
    })

    return NextResponse.json({ success: true, tienda })
  } catch (error) {
    console.error('Error al crear tienda:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
