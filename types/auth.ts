export interface User {
  _id: string
  username: string
  email: string
  role: "user" | "admin"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface UpdateProfileRequest {
  username?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}
