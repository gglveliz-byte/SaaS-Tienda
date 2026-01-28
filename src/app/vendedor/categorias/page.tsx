'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Modal, Badge } from '@/components/ui'
import type { CategoriaProducto } from '@/types'

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<(CategoriaProducto & { _count: { productos: number } })[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoriaProducto | null>(null)
  const [saving, setSaving] = useState(false)
  const [nombre, setNombre] = useState('')

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const res = await fetch('/api/vendedor/categorias')
      const data = await res.json()
      setCategorias(data.categorias || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (categoria?: CategoriaProducto) => {
    if (categoria) {
      setEditing(categoria)
      setNombre(categoria.nombre)
    } else {
      setEditing(null)
      setNombre('')
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editing
        ? `/api/vendedor/categorias/${editing.id}`
        : '/api/vendedor/categorias'

      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      })

      if (res.ok) {
        setModalOpen(false)
        fetchCategorias()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const res = await fetch(`/api/vendedor/categorias/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCategorias()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const toggleActiva = async (categoria: CategoriaProducto) => {
    try {
      await fetch(`/api/vendedor/categorias/${categoria.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: categoria.nombre, activa: !categoria.activa }),
      })
      fetchCategorias()
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
          <h1 className="text-3xl font-bold text-white">Categorías</h1>
          <p className="text-gray-400 mt-1">Organiza tus productos por categorías</p>
        </div>
        <Button onClick={() => openModal()}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Categoría
        </Button>
      </div>

      {categorias.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay categorías</h3>
            <p className="text-gray-400 mb-6">Crea categorías para organizar tus productos</p>
            <Button onClick={() => openModal()}>Crear primera categoría</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                  <th className="px-6 py-4 font-medium">Categoría</th>
                  <th className="px-6 py-4 font-medium">Productos</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {categorias.map((categoria) => (
                  <tr key={categoria.id} className="text-gray-300">
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{categoria.nombre}</span>
                    </td>
                    <td className="px-6 py-4">{categoria._count.productos}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleActiva(categoria)}>
                        <Badge variant={categoria.activa ? 'success' : 'danger'}>
                          {categoria.activa ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openModal(categoria)}>
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(categoria.id)}>
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Categoría' : 'Nueva Categoría'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre de la categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Electrónicos, Ropa, etc."
            required
            autoFocus
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={saving} className="flex-1">
              {editing ? 'Guardar' : 'Crear'}
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
