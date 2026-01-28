const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.plan.count()
  if (count === 0) {
    await prisma.plan.create({
      data: {
        nombre: 'Básico',
        precioMensual: 0,
        permiteVideos: false,
        maxProductos: 20,
        maxImagenesPorProducto: 3,
        activo: true,
      },
    })
    console.log('✓ Plan "Básico" creado')
  } else {
    console.log('Ya existen planes, no se crea ninguno')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
