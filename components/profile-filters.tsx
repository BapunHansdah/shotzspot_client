"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  Shield, 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Tag, 
  User,
  CheckCircle,
  XCircle,
  TrendingUp,
  Hash,
  Briefcase,
  RotateCcw
} from "lucide-react"

// Mock categories for demo
const categories = [
  "Technology",
  "Fashion", 
  "Food & Cooking",
  "Travel",
  "Fitness",
  "Art & Design",
  "Music",
  "Photography",
  "Business",
  "Education"
]

interface FilterParams {
  username?: string
  full_name?: string
  is_verified?: boolean
  min_followers?: number
  max_followers?: number
  min_posts?: number
  max_posts?: number
  category_name?: string
}

interface ProfileFiltersProps {
  onFilterChange: (filters: FilterParams) => void
  onClear: () => void
}

// Follower ranges
const followerOptions = [
  { label: "Any Followers", value: "any", icon: Users },
  { label: "Less than 1K", min: 0, max: 999, icon: Users },
  { label: "1K - 10K", min: 1000, max: 9999, icon: Users },
  { label: "10K - 50K", min: 10000, max: 49999, icon: TrendingUp },
  { label: "50K - 100K", min: 50000, max: 99999, icon: TrendingUp },
  { label: "100K - 500K", min: 100000, max: 499999, icon: TrendingUp },
  { label: "500K+", min: 500000, max: undefined, icon: Sparkles },
]

// Post ranges
const postOptions = [
  { label: "Any Posts", value: "any", icon: MessageSquare },
  { label: "Less than 10", min: 0, max: 9, icon: MessageSquare },
  { label: "10 - 50", min: 10, max: 49, icon: MessageSquare },
  { label: "50 - 100", min: 50, max: 99, icon: Hash },
  { label: "100 - 500", min: 100, max: 499, icon: Hash },
  { label: "500+", min: 500, max: undefined, icon: TrendingUp },
]

export function ProfileFilters({ onFilterChange, onClear }: ProfileFiltersProps) {
  const [filters, setFilters] = useState<FilterParams>({})
  const [usernameInput, setUsernameInput] = useState("")

  const handleSelectChange = (field: keyof FilterParams, value: string) => {
    const newFilters: any = { ...filters }
    
    if (value === "any" || value === "" || value === undefined) {
      delete newFilters[field]
    } else {
      if (field === "is_verified") {
        newFilters[field] = value === "true"
      } else {
        newFilters[field] = value
      }
    }
    
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleFollowerChange = (value: string) => {
    const newFilters: any = { ...filters }
    
    delete newFilters.min_followers
    delete newFilters.max_followers
    
    if (value !== "any") {
      const option = followerOptions.find(opt => opt.label === value)
      if (option && 'min' in option) {
        if (option.min !== undefined) newFilters.min_followers = option.min
        if (option.max !== undefined) newFilters.max_followers = option.max
      }
    }
    
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePostChange = (value: string) => {
    const newFilters: any = { ...filters }
    
    delete newFilters.min_posts
    delete newFilters.max_posts
    
    if (value !== "any") {
      const option = postOptions.find(opt => opt.label === value)
      if (option && 'min' in option) {
        if (option.min !== undefined) newFilters.min_posts = option.min
        if (option.max !== undefined) newFilters.max_posts = option.max
      }
    }
    
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleUsernameSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newFilters: any = { ...filters }
      
      if (usernameInput.trim() === "") {
        delete newFilters.username
      } else {
        newFilters.username = usernameInput.trim()
      }
      
      setFilters(newFilters)
      onFilterChange(newFilters)
    }
  }

  const handleNameStartsWith = (value: string) => {
    const newFilters: any = { ...filters }
    
    if (value === "any") {
      delete newFilters.full_name
    } else {
      newFilters.full_name = value
    }
    
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClear = () => {
    setFilters({})
    setUsernameInput("")
    onClear()
  }

  const applyVerifiedFilter = () => {
    const newFilters = { is_verified: true }
    setFilters(newFilters)
    setUsernameInput("")
    onFilterChange(newFilters)
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  // Get current selections for display
  const getCurrentFollowerOption = () => {
    const current = followerOptions.find(opt => 
      'min' in opt && opt.min === filters.min_followers && opt.max === filters.max_followers
    )
    return current?.label || "Any Followers"
  }

  const getCurrentPostOption = () => {
    const current = postOptions.find(opt => 
      'min' in opt && opt.min === filters.min_posts && opt.max === filters.max_posts
    )
    return current?.label || "Any Posts"
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-yellow-400" />
          <h2 className="text-lg font-medium text-white">Search & Filter</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Username Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search username (press Enter)..."
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          onKeyDown={handleUsernameSearch}
          className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 rounded-lg"
        />
        {filters.username && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <User className="h-3 w-3 text-blue-400" />
            <span className="text-blue-400">Searching: "{filters.username}"</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newFilters = { ...filters }
                delete newFilters.username
                setFilters(newFilters)
                setUsernameInput("")
                onFilterChange(newFilters)
              }}
              className="h-5 w-5 p-0 text-gray-500 hover:text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Filters Grid */}
      <div className="space-y-3">

        {/* Verification Status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-gray-400" />
            <label className="text-sm text-gray-400">Verification</label>
          </div>
          <Select 
            onValueChange={(value) => handleSelectChange("is_verified", value)}
            value={filters.is_verified === true ? "true" : filters.is_verified === false ? "false" : "any"}
          >
            <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 rounded-lg">
              <SelectItem value="any">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  All accounts
                </div>
              </SelectItem>
              <SelectItem value="true">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Verified only
                </div>
              </SelectItem>
              <SelectItem value="false">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-gray-500" />
                  Not verified
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Followers Range */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-gray-400" />
            <label className="text-sm text-gray-400">Followers</label>
          </div>
          <Select onValueChange={handleFollowerChange} value={getCurrentFollowerOption()}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 rounded-lg">
              {followerOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <SelectItem key={option.label} value={option.label}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-gray-400" />
                      {option.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Posts Range */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <label className="text-sm text-gray-400">Posts</label>
          </div>
          <Select onValueChange={handlePostChange} value={getCurrentPostOption()}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 rounded-lg">
              {postOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <SelectItem key={option.label} value={option.label}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-gray-400" />
                      {option.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Business Category */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <label className="text-sm text-gray-400">Category</label>
          </div>
          <Select onValueChange={(value) => handleSelectChange("category_name", value)} value={filters.category_name || "any"}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 rounded-lg">
              <SelectItem value="any">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  All categories
                </div>
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    {category}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Action */}
      {/* <div className="pt-4 border-t border-gray-700/50">
        <Button
          onClick={applyVerifiedFilter}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="h-4 w-4" />
          Show Verified Only
        </Button>
      </div> */}

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="text-center flex items-center justify-center gap-2">
          <Filter className="h-3 w-3 text-gray-500" />
          <span className="text-xs text-gray-500">
            {Object.keys(filters).length} filter{Object.keys(filters).length > 1 ? 's' : ''} active
          </span>
        </div>
      )}
    </div>
  )
}