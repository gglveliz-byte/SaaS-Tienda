'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui'

function RestablecerForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) setError('Falta el enlace de restablecimiento.')
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (newPassword.length < 6) {
      setError('Mínimo 6 caracteres')
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/vendedor/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/vendedor/login'), 2000)
      } else {
        setError(data.error || 'Error al restablecer')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <div className="text-center py-6">
          <p className="text-red-400 mb-4">Enlace inválido. Solicita uno nuevo.</p>
          <Link href="/vendedor/olvide-contrasena" className="text-indigo-400 hover:underline">
            Solicitar enlace
          </Link>
        </div>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <div className="text-center py-6">
          <p className="text-green-400 mb-2">Contraseña actualizada.</p>
          <p className="text-gray-400 text-sm">Redirigiendo al login...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Nueva contraseña</h1>
        <p className="text-gray-400 mt-2">Elige una contraseña segura</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Confirmar contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repite la contraseña"
          required
        />

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Restablecer contraseña
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        <Link href="/vendedor/login" className="text-indigo-400 hover:underline">
          Volver al login
        </Link>
      </p>
    </Card>
  )
}

export default function VendedorRestablecerPage() {
  return (
    <Suspense fallback={<Card className="w-full max-w-md"><div className="p-8 text-center text-gray-500">Cargando...</div></Card>}>
      <RestablecerForm />
    </Suspense>
  )
}
