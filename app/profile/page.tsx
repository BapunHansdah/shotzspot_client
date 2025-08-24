"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, User, Mail, Lock, Save, ArrowLeft, Loader2, AtSign, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth() // Added updateProfile from context
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Profile form state - Changed from name to username
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setUsername(user.username) // Changed from name to username
      setEmail(user.email)
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (username.length < 3 || username.length > 30) {
      setError("Username must be between 3 and 30 characters")
      setLoading(false)
      return
    }

    try {
      await updateProfile({ username, email }) // Use context method instead of direct API call
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      await updateProfile({ currentPassword, newPassword }) // Use context method
      setSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <DashboardHeader user={user} onRefresh={() => {}} />

        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-normal text-gray-100 tracking-tight font-serif mb-2">Profile Settings</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-900/20 border border-green-800 rounded-lg p-4">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-gray-100 flex items-center space-x-2">
                  <User className="w-5 h-5 text-yellow-400" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription className="text-gray-400">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-200 font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500 pl-10"
                        placeholder="Enter your username (3-30 characters)"
                        required
                        minLength={3}
                        maxLength={30}
                      />
                      <AtSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500 pl-10"
                        placeholder="Enter your email"
                        required
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-gray-100 flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-yellow-400" />
                  <span>Change Password</span>
                </CardTitle>
                <CardDescription className="text-gray-400">Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-200 font-medium">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500 pr-10"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-200 font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500 pr-10"
                        placeholder="Enter new password (min 6 characters)"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-200 font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-gray-100 focus:border-yellow-500 focus:ring-yellow-500 pr-10"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Account Information - Updated to show new schema fields */}
          <Card className="bg-gray-800/50 border-gray-700 shadow-xl mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-gray-100">Account Information</CardTitle>
              <CardDescription className="text-gray-400">Your account details and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-700">
                    <span className="font-medium text-gray-200">User ID</span>
                    <span className="text-gray-400 text-sm font-mono">{user?._id}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-700">
                    <span className="font-medium text-gray-200">Username</span>
                    <span className="text-gray-400 text-sm">@{user?.username}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-700">
                    <span className="font-medium text-gray-200">Account Created</span>
                    <span className="text-gray-400 text-sm">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-700">
                    <span className="font-medium text-gray-200">Account Status</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">{user?.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-700">
                    <span className="font-medium text-gray-200">Role</span>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm capitalize">{user?.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-700">
                    <span className="font-medium text-gray-200">Last Updated</span>
                    <span className="text-gray-400 text-sm">
                      {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
