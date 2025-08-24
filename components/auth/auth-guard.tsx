"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === "/login" || pathname === "/register"
      const isProtectedPage = pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/profile")

      // Redirect authenticated users away from auth pages
      if (user && isAuthPage) {
        router.push("/")
        return
      }

      // Redirect unauthenticated users to login for protected pages
      if (!user && isProtectedPage) {
        const redirectUrl = pathname !== "/" ? `?redirect=${encodeURIComponent(pathname)}` : ""
        router.push(`/login${redirectUrl}`)
        return
      }
    }
  }, [user, loading, pathname, router])

  return <>{children}</>
}
