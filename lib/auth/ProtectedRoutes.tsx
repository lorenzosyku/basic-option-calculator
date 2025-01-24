'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './context/AuthContext'

export function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to home if the user is logged out
        if (pathname !== '/' && pathname !== '/login' && pathname !== '/signup') {
          router.push('/')
        }
      }
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return <div>Loading...</div>
  }

  return children
}
