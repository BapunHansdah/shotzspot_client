"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
