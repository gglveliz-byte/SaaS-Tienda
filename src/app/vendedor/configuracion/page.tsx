'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button, Input, Textarea } from '@/components/ui'

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

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <span className="material-symbols-outlined text-amber-600" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  )
}

export default function ConfiguracionTiendaPage() {
  const router = useRouter()
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const [tienda, setTienda] = useState<TiendaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resolvingMap, setResolvingMap] = useState(false)
  const [mapResolved, setMapResolved] = useState(false)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    whatsapp: '',
    direccion: '',
    enlaceGoogleMaps: '',
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/vendedor/tienda')
        if (!res.ok) { router.push('/vendedor/login'); return }
        const data = await res.json()
        setTienda(data.tienda)
        setFormData({
          nombre: data.tienda.nombre || '',
          descripcion: data.tienda.descripcion || '',
          whatsapp: data.tienda.whatsapp || '',
          direccion: data.tienda.direccion || '',
          enlaceGoogleMaps: '',
        })
      } catch { router.push('/vendedor/login') }
      finally { setLoading(false) }
    }
    load()
  }, [router])

  // Logo upload en el momento de selección
  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    await uploadFile(file, 'logo')
  }

  // Banner upload en el momento de selección
  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
    await uploadFile(file, 'banner')
  }

  async function uploadFile(file: File, tipo: 'logo' | 'banner') {
    if (tipo === 'logo') setUploadingLogo(true)
    else setUploadingBanner(true)
    try {
      const fd = new FormData()
      fd.append('archivo', file)
      fd.append('tipo', tipo)
      const res = await fetch('/api/vendedor/tienda/archivos', { method: 'POST', body: fd })
      if (!res.ok) {
        setError(`Error al subir ${tipo}`)
      } else {
        setSuccess(`${tipo === 'logo' ? 'Logo' : 'Banner'} actualizado correctamente`)
        setTimeout(() => setSuccess(''), 3000)
        // Refrescar tienda
        const resGet = await fetch('/api/vendedor/tienda')
        if (resGet.ok) {
          const data = await resGet.json()
          setTienda(data.tienda)
        }
        router.refresh()
      }
    } catch { setError(`Error de conexión al subir ${tipo}`) }
    finally {
      if (tipo === 'logo') setUploadingLogo(false)
      else setUploadingBanner(false)
    }
  }

  async function resolveMapUrl(url: string) {
    if (!url.trim()) return
    setResolvingMap(true)
    setMapResolved(false)
    try {
      const res = await fetch(`/api/resolve-maps?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data.coords) {
        setMapResolved(true)
        return data.coords
      }
    } catch { /* ignore */ }
    finally { setResolvingMap(false) }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      let latitud: number | null = tienda?.latitud ?? null
      let longitud: number | null = tienda?.longitud ?? null

      if (formData.enlaceGoogleMaps.trim()) {
        const coords = await resolveMapUrl(formData.enlaceGoogleMaps)
        if (coords) { latitud = coords.lat; longitud = coords.lng }
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

      setSuccess('¡Configuración guardada correctamente!')
      setTimeout(() => setSuccess(''), 4000)
      router.refresh()
      const resGet = await fetch('/api/vendedor/tienda')
      if (resGet.ok) {
        const data = await resGet.json()
        setTienda(data.tienda)
      }
    } catch { setError('Error de conexión') }
    finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  if (!tienda) return null

  const logoSrc = logoPreview ?? (tienda.logoId ? `/api/archivos/${tienda.logoId}` : null)
  const bannerSrc = bannerPreview ?? (tienda.bannerId ? `/api/archivos/${tienda.bannerId}` : null)

  return (
    <div className="max-w-2xl space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Edita los datos que los clientes ven en tu tienda
          </p>
        </div>
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
          Plan {tienda.plan.nombre}
        </span>
      </div>

      {/* Alertas */}
      {success && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium animate-fade-in">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium animate-fade-in">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Logo y Banner ── */}
        <SectionCard icon="image" title="Logo y Banner">
          {/* Logo */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Logo de la tienda</p>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-300 transition-colors shrink-0"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoSrc ? (
                  <Image src={logoSrc} alt="Logo" width={80} height={80} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-gray-300" style={{ fontSize: '28px' }}>storefront</span>
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="inline-flex items-center gap-2 bg-[#F5AB00] hover:bg-[#DC9B00] text-gray-900 font-semibold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  {uploadingLogo ? (
                    <><div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />Subiendo...</>
                  ) : (
                    <><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload</span>Subir logo</>
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WebP — máx 5 MB</p>
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>

          {/* Banner */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Banner de la tienda</p>
            <div
              className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-300 transition-colors"
              onClick={() => bannerInputRef.current?.click()}
            >
              {bannerSrc ? (
                <div className="relative w-full h-full">
                  <Image src={bannerSrc} alt="Banner" fill className="object-cover" sizes="672px" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Cambiar banner</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <span className="material-symbols-outlined text-gray-300" style={{ fontSize: '36px' }}>add_photo_alternate</span>
                  <p className="text-sm text-gray-400 mt-1">
                    {uploadingBanner ? 'Subiendo...' : 'Clic para subir banner'}
                  </p>
                </div>
              )}
            </div>
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </div>
        </SectionCard>

        {/* ── Datos básicos ── */}
        <SectionCard icon="store" title="Datos básicos">
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
            placeholder="Breve descripción que verán tus clientes al entrar a tu tienda..."
            rows={3}
          />
          <Input
            label="WhatsApp (con código de país)"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            placeholder="5930991234567"
            required
          />
        </SectionCard>

        {/* ── Ubicación y mapa ── */}
        <SectionCard icon="location_on" title="Ubicación y mapa">
          <Input
            label="Dirección (texto visible en tienda)"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            placeholder="Ej: Av. Principal 123, Milagro, Ecuador"
          />
          <div>
            <Input
              label="Enlace de Google Maps"
              value={formData.enlaceGoogleMaps}
              onChange={(e) => { setFormData({ ...formData, enlaceGoogleMaps: e.target.value }); setMapResolved(false) }}
              placeholder="https://maps.app.goo.gl/... o URL completa"
            />
            <div className="flex items-start gap-2 mt-2">
              <span className="material-symbols-outlined text-amber-500 shrink-0" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>info</span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Abre Google Maps → busca tu negocio → toca <strong>Compartir</strong> → copia el enlace.
                Acepta URLs cortas y largas.
                {tienda.latitud && tienda.longitud && (
                  <span className="text-emerald-600 font-medium"> ✓ Mapa activo en tu tienda</span>
                )}
              </p>
            </div>
            {resolvingMap && (
              <span className="text-xs text-amber-600 flex items-center gap-1.5 mt-2">
                <span className="w-3 h-3 border-2 border-amber-400/40 border-t-amber-500 rounded-full animate-spin inline-block" />
                Obteniendo coordenadas del mapa...
              </span>
            )}
            {mapResolved && (
              <p className="text-xs text-emerald-600 flex items-center gap-1.5 mt-2 font-medium">
                <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Coordenadas detectadas — el mapa se mostrará en tu tienda
              </p>
            )}
          </div>
        </SectionCard>

        {/* ── Botón guardar ── */}
        <Button type="submit" loading={saving} size="lg" className="w-full">
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>

      </form>
    </div>
  )
}
