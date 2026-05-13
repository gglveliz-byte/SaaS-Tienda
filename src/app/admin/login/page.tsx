'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-8">
        <span className="text-5xl mb-4 block">🏪</span>
        <h1 className="text-2xl font-bold text-gray-900">Tienda SaaS</h1>
        <p className="text-gray-400 mt-2">Panel de Administración</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Iniciar sesión
        </Button>

        <p className="text-center text-sm text-gray-500">
          <Link href="/admin/olvide-contrasena" className="text-indigo-400 hover:underline">
            Olvidé mi contraseña
          </Link>
        </p>
      </form>
    </Card>
  )
}
