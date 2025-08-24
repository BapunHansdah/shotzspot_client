const API_BASE_URL = "https://dashboard.shotzspot.com/api"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string // Changed from name to username to match schema
  email: string
  password: string
}

export interface User {
  _id: string // Changed from id to _id to match MongoDB schema
  username: string // Added username field
  email: string
  role: "user" | "admin" // Added role field from schema
  isActive: boolean // Added isActive field from schema
  createdAt: string
  updatedAt: string // Added updatedAt field from schema
}

export interface AuthResponse {
  user: User
  token: string
}

export interface UpdateProfileRequest {
  username?: string // Changed from name to username
  email?: string
  currentPassword?: string
  newPassword?: string
}

class AuthAPI {
  private getHeaders(includeAuth = false) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
      // Also set as cookie for middleware
      document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
    }
  }

  private removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      // Remove cookie
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    const data = await response.json()
    this.setToken(data.token)
    return data
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    const data = await response.json()
    this.setToken(data.token)
    return data
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(true),
    })

    if (!response.ok) {
      throw new Error("Failed to get current user")
    }

    return response.json()
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update profile")
    }

    return response.json()
  }

  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: this.getHeaders(true),
      })

      if (!response.ok) {
        console.warn("Logout request failed, but continuing with local cleanup")
      }
    } catch (error) {
      console.warn("Logout request failed, but continuing with local cleanup:", error)
    } finally {
      this.removeToken()
    }
  }
}

export const authAPI = new AuthAPI()
