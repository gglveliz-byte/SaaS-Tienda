'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Select, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { slugify, CATEGORIA_GENERAL_LABELS } from '@/lib/utils'
import type { Plan, CategoriaGeneral } from '@/types'

interface CrearTiendaFormProps {
  planes: Plan[]
}

export function CrearTiendaForm({ planes }: CrearTiendaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    categoriaGeneral: 'general' as CategoriaGeneral,
    whatsapp: '',
    direccion: '',
    latitud: '',
    longitud: '',
    planId: planes[0]?.id || '',
    vendedorNombre: '',
    vendedorEmail: '',
    vendedorPassword: '',
  })

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nombre = e.target.value
    setFormData({
      ...formData,
      nombre,
      slug: slugify(nombre),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/tiendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear la tienda')
        return
      }

      router.push('/admin/tiendas')
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const categoriaOptions = Object.entries(CATEGORIA_GENERAL_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  const planOptions = planes.map((plan) => ({
    value: plan.id,
    label: `${plan.nombre} - $${plan.precioMensual}/mes`,
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos de la tienda */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Tienda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la tienda"
              value={formData.nombre}
              onChange={handleNombreChange}
              placeholder="Mi Tienda"
              required
            />
            <Input
              label="URL (slug)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
              placeholder="mi-tienda"
              hint="Se usará en: /tienda/mi-tienda"
              required
            />
          </div>

          <Textarea
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Descripción de la tienda..."
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Categoría de la tienda"
              value={formData.categoriaGeneral}
              onChange={(e) => setFormData({ ...formData, categoriaGeneral: e.target.value as CategoriaGeneral })}
              options={categoriaOptions}
            />
            <Select
              label="Plan"
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              options={planOptions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card>
        <CardHeader>
          <CardTitle>Contacto y Ubicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="WhatsApp"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            placeholder="+52 123 456 7890"
            hint="Número al que llegarán los pedidos"
            required
          />

          <Textarea
            label="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            placeholder="Calle, Número, Colonia, Ciudad..."
            rows={2}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Latitud"
              type="number"
              step="any"
              value={formData.latitud}
              onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
              placeholder="19.4326"
              hint="Para Google Maps"
            />
            <Input
              label="Longitud"
              type="number"
              step="any"
              value={formData.longitud}
              onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
              placeholder="-99.1332"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vendedor */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Vendedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nombre del vendedor"
            value={formData.vendedorNombre}
            onChange={(e) => setFormData({ ...formData, vendedorNombre: e.target.value })}
            placeholder="Juan Pérez"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email del vendedor"
              type="email"
              value={formData.vendedorEmail}
              onChange={(e) => setFormData({ ...formData, vendedorEmail: e.target.value })}
              placeholder="vendedor@email.com"
              required
            />
            <Input
              label="Contraseña temporal"
              type="text"
              value={formData.vendedorPassword}
              onChange={(e) => setFormData({ ...formData, vendedorPassword: e.target.value })}
              placeholder="contraseña123"
              hint="El vendedor podrá cambiarla después"
              required
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" loading={loading}>
          Crear Tienda
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
