'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { parseGoogleMapsUrl } from '@/lib/utils'

interface TiendaData {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  categoriaGeneral: string
  whatsapp: string
  direccion: string | null
  latitud: number | null
  longitud: number | null
  plan: { nombre: string }
  logoId: string | null
  bannerId: string | null
}

export default function ConfiguracionTiendaPage() {
  const router = useRouter()
  const [tienda, setTienda] = useState<TiendaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    whatsapp: '',
    direccion: '',
    enlaceGoogleMaps: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/vendedor/tienda')
        if (!res.ok) {
          router.push('/vendedor/login')
          return
        }
        const data = await res.json()
        setTienda(data.tienda)
        setFormData({
          nombre: data.tienda.nombre || '',
          descripcion: data.tienda.descripcion || '',
          whatsapp: data.tienda.whatsapp || '',
          direccion: data.tienda.direccion || '',
          enlaceGoogleMaps: '',
        })
      } catch {
        router.push('/vendedor/login')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      let latitud: number | null = tienda?.latitud ?? null
      let longitud: number | null = tienda?.longitud ?? null

      if (formData.enlaceGoogleMaps.trim()) {
        const coords = parseGoogleMapsUrl(formData.enlaceGoogleMaps)
        if (coords) {
          latitud = coords.lat
          longitud = coords.lng
        }
      }

      const res = await fetch('/api/vendedor/tienda', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          whatsapp: formData.whatsapp,
          direccion: formData.direccion || null,
          latitud,
          longitud,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al guardar')
        return
      }

      if (logoFile) {
        const fd = new FormData()
        fd.append('archivo', logoFile)
        fd.append('tipo', 'logo')
        const rLogo = await fetch('/api/vendedor/tienda/archivos', { method: 'POST', body: fd })
        if (!rLogo.ok) setError('Tienda guardada pero falló subir logo')
      }
      if (bannerFile) {
        const fd = new FormData()
        fd.append('archivo', bannerFile)
        fd.append('tipo', 'banner')
        const rBanner = await fetch('/api/vendedor/tienda/archivos', { method: 'POST', body: fd })
        if (!rBanner.ok) setError('Tienda guardada pero falló subir banner')
      }

      router.refresh()
      setLogoFile(null)
      setBannerFile(null)
      const resGet = await fetch('/api/vendedor/tienda')
      if (resGet.ok) {
        const data = await resGet.json()
        setTienda(data.tienda)
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  if (!tienda) return null

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Configuración de tienda</h1>
        <p className="text-gray-400 mt-1">Edita los datos que los clientes ven (plan y URL los gestiona el admin)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nombre de la tienda"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            <Textarea
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Breve descripción para los clientes"
              rows={3}
            />
            <Input
              label="WhatsApp (número con código de país)"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="5215512345678"
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubicación y mapa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Dirección (texto)"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Calle, número, colonia, ciudad"
            />
            <Input
              label="Enlace de Google Maps"
              value={formData.enlaceGoogleMaps}
              onChange={(e) => setFormData({ ...formData, enlaceGoogleMaps: e.target.value })}
              placeholder="Pega el enlace de tu ubicación en Google Maps"
              hint="Abre Google Maps, busca tu negocio o ubica el pin, comparte y copia el enlace. Así el mapa se verá correcto."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo y banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Logo (se ve en el header)</label>
              <div className="flex flex-wrap items-center gap-4">
                {tienda.logoId && !logoFile && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700 shrink-0">
                    <Image src={`/api/archivos/${tienda.logoId}`} alt="Logo" width={80} height={80} className="object-cover" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Banner (imagen de cabecera de tu tienda)</label>
              <div className="space-y-2">
                {tienda.bannerId && !bannerFile && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-700">
                    <Image src={`/api/archivos/${tienda.bannerId}`} alt="Banner" fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" loading={saving}>
          Guardar cambios
        </Button>
      </form>
    </div>
  )
}
