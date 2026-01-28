'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button, Input, Select, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import type { CategoriaProducto, Producto, Archivo } from '@/types'

interface ProductoFormProps {
  producto?: Producto & { archivos: Archivo[] }
  categorias: CategoriaProducto[]
  permiteVideos: boolean
  maxImagenes: number
}

export function ProductoForm({
  producto,
  categorias,
  permiteVideos,
  maxImagenes,
}: ProductoFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio?.toString() || '',
    precioOferta: producto?.precioOferta?.toString() || '',
    stock: producto?.stock?.toString() || '0',
    categoriaId: producto?.categoriaId || '',
    activo: producto?.activo ?? true,
    destacado: producto?.destacado ?? false,
  })

  const [archivos, setArchivos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [archivosExistentes, setArchivosExistentes] = useState<Archivo[]>(
    producto?.archivos || []
  )
  const [archivosAEliminar, setArchivosAEliminar] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalArchivos = archivos.length + archivosExistentes.length - archivosAEliminar.length

    if (totalArchivos + files.length > maxImagenes) {
      setError(`Máximo ${maxImagenes} archivos permitidos`)
      return
    }

    // Filtrar archivos válidos
    const archivosValidos = files.filter((file) => {
      if (file.type.startsWith('video/') && !permiteVideos) {
        return false
      }
      // Límite de tamaño
      if (file.type.startsWith('video/') && file.size > 50 * 1024 * 1024) {
        setError('Videos máximo 50MB')
        return false
      }
      if (file.type.startsWith('image/') && file.size > 5 * 1024 * 1024) {
        setError('Imágenes máximo 5MB')
        return false
      }
      return true
    })

    setArchivos([...archivos, ...archivosValidos])

    // Crear previews
    archivosValidos.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviews((prev) => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      } else {
        setPreviews((prev) => [...prev, 'video'])
      }
    })
  }

  const removeArchivo = (index: number) => {
    setArchivos(archivos.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const removeArchivoExistente = (id: string) => {
    setArchivosAEliminar([...archivosAEliminar, id])
    setArchivosExistentes(archivosExistentes.filter((a) => a.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const form = new FormData()
      form.append('nombre', formData.nombre)
      form.append('descripcion', formData.descripcion)
      form.append('precio', formData.precio)
      if (formData.precioOferta) form.append('precioOferta', formData.precioOferta)
      form.append('stock', formData.stock)
      if (formData.categoriaId) form.append('categoriaId', formData.categoriaId)
      form.append('activo', formData.activo.toString())
      form.append('destacado', formData.destacado.toString())

      archivos.forEach((archivo) => {
        form.append('archivos', archivo)
      })

      if (producto) {
        form.append('archivosAEliminar', JSON.stringify(archivosAEliminar))
      }

      const url = producto
        ? `/api/vendedor/productos/${producto.id}`
        : '/api/vendedor/productos'

      const res = await fetch(url, {
        method: producto ? 'PUT' : 'POST',
        body: form,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al guardar')
        return
      }

      router.push('/vendedor/productos')
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const categoriaOptions = [
    { value: '', label: 'Sin categoría' },
    ...categorias.map((c) => ({ value: c.id, label: c.nombre })),
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nombre del producto"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej: iPhone 15 Pro Max"
            required
          />

          <Textarea
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Describe tu producto..."
            rows={4}
          />

          <Select
            label="Categoría"
            value={formData.categoriaId}
            onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
            options={categoriaOptions}
          />
        </CardContent>
      </Card>

      {/* Precios y stock */}
      <Card>
        <CardHeader>
          <CardTitle>Precios y Stock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Precio"
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              placeholder="0.00"
              required
            />
            <Input
              label="Precio de oferta (opcional)"
              type="number"
              step="0.01"
              value={formData.precioOferta}
              onChange={(e) => setFormData({ ...formData, precioOferta: e.target.value })}
              placeholder="0.00"
              hint="Déjalo vacío si no hay oferta"
            />
            <Input
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Imágenes y videos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Imágenes {permiteVideos && 'y Videos'}
            <span className="text-sm font-normal text-gray-400 ml-2">
              (Máximo {maxImagenes} archivos)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={permiteVideos ? 'image/*,video/*' : 'image/*'}
            multiple
            className="hidden"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Archivos existentes */}
            {archivosExistentes.map((archivo) => (
              <div key={archivo.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group">
                {archivo.tipo === 'imagen' ? (
                  <Image
                    src={`/api/archivos/${archivo.id}`}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeArchivoExistente(archivo.id)}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Nuevos archivos */}
            {previews.map((preview, i) => (
              <div key={i} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group">
                {preview === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <Image src={preview} alt="" fill className="object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeArchivo(i)}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Botón agregar */}
            {archivos.length + archivosExistentes.length - archivosAEliminar.length < maxImagenes && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg hover:border-indigo-500 transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-indigo-400"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm">Agregar</span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Opciones */}
      <Card>
        <CardHeader>
          <CardTitle>Opciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="text-white font-medium">Producto activo</span>
              <p className="text-sm text-gray-400">Visible en la tienda para los clientes</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.destacado}
              onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
              className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="text-white font-medium">Producto destacado</span>
              <p className="text-sm text-gray-400">Se mostrará en la sección principal</p>
            </div>
          </label>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" loading={loading}>
          {producto ? 'Guardar Cambios' : 'Crear Producto'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
