'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Select, Textarea, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'
import { CATEGORIA_GENERAL_LABELS } from '@/lib/utils'
import type { Plan, Tienda, Vendedor, CategoriaGeneral } from '@/types'

interface EditarTiendaFormProps {
  tienda: Tienda & { vendedor: Vendedor | null; plan: Plan }
  planes: Plan[]
}

export function EditarTiendaForm({ tienda, planes }: EditarTiendaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    nombre: tienda.nombre,
    descripcion: tienda.descripcion || '',
    categoriaGeneral: tienda.categoriaGeneral,
    whatsapp: tienda.whatsapp,
    direccion: tienda.direccion || '',
    latitud: tienda.latitud?.toString() || '',
    longitud: tienda.longitud?.toString() || '',
    planId: tienda.planId,
    activa: tienda.activa,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/tiendas/${tienda.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al actualizar')
        return
      }

      setSuccess('Tienda actualizada correctamente')
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta tienda? Esta acción no se puede deshacer.')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/tiendas/${tienda.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al eliminar')
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
      {/* Estado de la tienda */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <h3 className="font-medium text-white">Estado de la tienda</h3>
            <p className="text-sm text-gray-400">
              {formData.activa ? 'La tienda está visible para los clientes' : 'La tienda está oculta'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.activa}
              onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </CardContent>
      </Card>

      {/* Datos de la tienda */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Tienda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nombre de la tienda"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />

          <div className="p-3 bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-400">URL: </span>
            <code className="text-indigo-400">/tienda/{tienda.slug}</code>
          </div>

          <Textarea
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Categoría"
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
            required
          />

          <Textarea
            label="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            rows={2}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Latitud"
              type="number"
              step="any"
              value={formData.latitud}
              onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
            />
            <Input
              label="Longitud"
              type="number"
              step="any"
              value={formData.longitud}
              onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vendedor Info */}
      {tienda.vendedor && (
        <Card>
          <CardHeader>
            <CardTitle>Vendedor Asignado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Nombre:</span>
                <span className="text-white ml-2">{tienda.vendedor.nombre}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="text-white ml-2">{tienda.vendedor.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-900/50 border border-green-800 rounded-lg text-green-400">
          {success}
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex gap-4">
          <Button type="submit" loading={loading}>
            Guardar Cambios
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
        <Button type="button" variant="danger" onClick={handleDelete} disabled={loading}>
          Eliminar Tienda
        </Button>
      </div>
    </form>
  )
}
