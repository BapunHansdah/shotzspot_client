"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  authAPI,
  type User,
  type LoginCredentials,
  type RegisterCredentials,
  type UpdateProfileRequest,
} from "@/lib/auth-api"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<void> // Added updateProfile method
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const currentUser = await authAPI.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          console.error("Failed to get current user:", error)
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const { user, token } = await authAPI.login(credentials)
      localStorage.setItem("token", token)
      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { user, token } = await authAPI.register(credentials)
      localStorage.setItem("token", token)
      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      const updatedUser = await authAPI.updateProfile(data)
      setUser(updatedUser)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    updateProfile, // Added updateProfile to context value
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
