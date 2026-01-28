'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui'

export default function VendedorCambiarContrasenaPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('La nueva contraseña y la confirmación no coinciden.')
      return
    }
    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/vendedor/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => router.push('/vendedor'), 1500)
      } else {
        setError(data.error || 'Error al cambiar la contraseña.')
      }
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <div className="text-center py-6">
          <p className="text-green-400 mb-2">Contraseña actualizada correctamente.</p>
          <p className="text-gray-400 text-sm">Redirigiendo al panel...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Cambiar contraseña</h1>
        <p className="text-gray-400 mt-2">Indica tu contraseña actual y la nueva que quieres usar.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Contraseña actual"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Contraseña que usas ahora"
          required
        />
        <Input
          label="Nueva contraseña"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
        />
        <Input
          label="Confirmar nueva contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repite la nueva contraseña"
          required
        />

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Cambiar contraseña
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        <Link href="/vendedor" className="text-indigo-400 hover:underline">
          Volver al panel
        </Link>
      </p>
    </Card>
  )
}
