import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { VendedorLayoutClient } from '@/components/vendedor/VendedorLayoutClient'

export default async function VendedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession('vendedor')

  let tienda = null
  if (session?.tiendaId) {
    tienda = await prisma.tienda.findUnique({
      where: { id: session.tiendaId },
      select: {
        id: true,
        nombre: true,
        slug: true,
        activa: true,
        vendedor: { select: { mustChangePassword: true } },
      },
    })
  }

  return (
    <VendedorLayoutClient session={session} tienda={tienda}>
      {children}
    </VendedorLayoutClient>
  )
}
