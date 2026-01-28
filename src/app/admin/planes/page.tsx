'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Modal, Badge } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { Plan } from '@/types'

export default function PlanesPage() {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    nombre: '',
    precioMensual: '',
    permiteVideos: false,
    maxProductos: '50',
    maxImagenesPorProducto: '5',
  })

  useEffect(() => {
    fetchPlanes()
  }, [])

  const fetchPlanes = async () => {
    try {
      const res = await fetch('/api/admin/planes')
      const data = await res.json()
      setPlanes(data.planes || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan)
      setFormData({
        nombre: plan.nombre,
        precioMensual: plan.precioMensual.toString(),
        permiteVideos: plan.permiteVideos,
        maxProductos: plan.maxProductos.toString(),
        maxImagenesPorProducto: plan.maxImagenesPorProducto.toString(),
      })
    } else {
      setEditingPlan(null)
      setFormData({
        nombre: '',
        precioMensual: '',
        permiteVideos: false,
        maxProductos: '50',
        maxImagenesPorProducto: '5',
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingPlan
        ? `/api/admin/planes/${editingPlan.id}`
        : '/api/admin/planes'

      const res = await fetch(url, {
        method: editingPlan ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precioMensual: parseFloat(formData.precioMensual),
          maxProductos: parseInt(formData.maxProductos),
          maxImagenesPorProducto: parseInt(formData.maxImagenesPorProducto),
        }),
      })

      if (res.ok) {
        setModalOpen(false)
        fetchPlanes()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este plan?')) return

    try {
      const res = await fetch(`/api/admin/planes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchPlanes()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Planes</h1>
          <p className="text-gray-400 mt-1">Gestiona los planes de suscripción</p>
        </div>
        <Button onClick={() => openModal()}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Plan
        </Button>
      </div>

      {planes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay planes</h3>
            <p className="text-gray-400 mb-6">Crea el primer plan para poder crear tiendas</p>
            <Button onClick={() => openModal()}>Crear primer plan</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.nombre}</CardTitle>
                  {!plan.activo && <Badge variant="danger">Inactivo</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-4">
                  {formatPrice(Number(plan.precioMensual))}
                  <span className="text-sm font-normal text-gray-400">/mes</span>
                </div>

                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Hasta {plan.maxProductos} productos
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {plan.maxImagenesPorProducto} imágenes por producto
                  </li>
                  <li className="flex items-center gap-2">
                    {plan.permiteVideos ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {plan.permiteVideos ? 'Videos incluidos' : 'Sin videos'}
                  </li>
                </ul>

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openModal(plan)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del plan"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: Básico, Premium, etc."
            required
          />

          <Input
            label="Precio mensual"
            type="number"
            step="0.01"
            value={formData.precioMensual}
            onChange={(e) => setFormData({ ...formData, precioMensual: e.target.value })}
            placeholder="99.00"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Máx. productos"
              type="number"
              value={formData.maxProductos}
              onChange={(e) => setFormData({ ...formData, maxProductos: e.target.value })}
              required
            />
            <Input
              label="Máx. imágenes/producto"
              type="number"
              value={formData.maxImagenesPorProducto}
              onChange={(e) => setFormData({ ...formData, maxImagenesPorProducto: e.target.value })}
              required
            />
          </div>

          <label className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.permiteVideos}
              onChange={(e) => setFormData({ ...formData, permiteVideos: e.target.checked })}
              className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="text-white font-medium">Permitir videos</span>
              <p className="text-sm text-gray-400">Los vendedores podrán subir videos de productos</p>
            </div>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={saving} className="flex-1">
              {editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
