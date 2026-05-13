import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { TEMAS_CATEGORIA } from '@/types'

async function getTienda(slug: string) {
  return prisma.tienda.findUnique({
    where: { slug, activa: true },
    select: { categoriaGeneral: true },
  })
}

export default async function TiendaLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tienda = await getTienda(slug)

  if (!tienda) {
    notFound()
  }

  const tema = TEMAS_CATEGORIA[tienda.categoriaGeneral]

  return (
    <div
      style={{
        ['--primary' as string]: tema.primary,
        ['--secondary' as string]: tema.secondary,
        ['--accent' as string]: tema.accent,
        ['--muted' as string]: tema.muted,
        ['--text' as string]: tema.text,
        ['--background' as string]: tema.background,
      }}
    >
      {children}
    </div>
  )
}
