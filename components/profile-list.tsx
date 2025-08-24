"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { InstagramProfile } from "@/types/profile"
import { Users, Image, ChevronLeft, ChevronRight, Verified, Lock, Building, Eye, Heart, MessageCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { useState, useMemo } from "react"
import AIInfluencerScrollerLoader from "./list-animation"

type SortField = 'followers' | 'posts' | 'engagement' | 'category' | 'username'
type SortOrder = 'asc' | 'desc'

interface SortConfig {
  field: SortField
  order: SortOrder
}

interface ProfileListProps {
  profiles: InstagramProfile[]
  loading: boolean
  currentPage: number
  totalPages: number
  onProfileClick: (profile: InstagramProfile) => void
  onPageChange: (page: number) => void
  isAILoading: boolean
}

export function ProfileList({
  profiles,
  loading,
  currentPage,
  totalPages,
  onProfileClick,
  onPageChange,
  isAILoading
}: ProfileListProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const handleSort = (field: SortField) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.field === field) {
        // If clicking the same field, toggle order
        return {
          field,
          order: prevConfig.order === 'asc' ? 'desc' : 'asc'
        }
      } else {
        // If clicking a new field, default to desc for numeric fields, asc for text fields
        return {
          field,
          order: ['followers', 'posts', 'engagement'].includes(field) ? 'desc' : 'asc'
        }
      }
    })
  }

  const getSortIcon = (field: SortField) => {
    if (!sortConfig || sortConfig.field !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400" />
    }
    return sortConfig.order === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-indigo-400" />
      : <ArrowDown className="w-3 h-3 text-indigo-400" />
  }

  const sortedProfiles = useMemo(() => {
    if (!sortConfig) return profiles

    return [...profiles].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortConfig.field) {
        case 'followers':
          aValue = a.simplified_profile.stats.followers_count
          bValue = b.simplified_profile.stats.followers_count
          break
        case 'posts':
          aValue = a.simplified_profile.stats.posts_count
          bValue = b.simplified_profile.stats.posts_count
          break
        case 'engagement':
          // Calculate engagement rate (this is a mock calculation)
          aValue = (a.simplified_profile.stats.followers_count / 100) * Math.random() * 5
          bValue = (b.simplified_profile.stats.followers_count / 100) * Math.random() * 5
          break
        case 'category':
          aValue = a.simplified_profile.business_info?.category_name || ''
          bValue = b.simplified_profile.business_info?.category_name || ''
          break
        case 'username':
          aValue = a.simplified_profile.basic_info.username.toLowerCase()
          bValue = b.simplified_profile.basic_info.username.toLowerCase()
          break
        default:
          return 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue)
        return sortConfig.order === 'asc' ? result : -result
      }

      if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1
      return 0
    })
  }, [profiles, sortConfig])

  if(isAILoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <AIInfluencerScrollerLoader />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="overflow-hidden  rounded-3xl shadow-2xl border border-slate-700 h-full">
        <CardContent className="">
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="rounded-full bg-white/20 backdrop-blur-sm h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 backdrop-blur-sm rounded w-1/4"></div>
                    <div className="h-3 bg-white/20 backdrop-blur-sm rounded w-1/6"></div>
                  </div>
                  <div className="h-4 bg-white/20 backdrop-blur-sm rounded w-16"></div>
                  <div className="h-4 bg-white/20 backdrop-blur-sm rounded w-12"></div>
                  <div className="h-4 bg-white/20 backdrop-blur-sm rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    )
  }

  return (
    <div className="overflow-hidden h-full flex flex-col relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full -translate-y-20 translate-x-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full translate-y-16 -translate-x-16 blur-3xl"></div>

      <CardContent className="flex-1 relative z-10">
        {/* Table */}
        <div className="flex-1 overflow-hidden rounded-2xl bg-white/5 w-full backdrop-blur-sm border border-white/10">
          {/* Table Header */}
          <div className="bg-white/10 backdrop-blur-sm border-b border-white/10">
            <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <button 
                onClick={() => handleSort('username')}
                className="col-span-5 flex items-center gap-2 hover:text-white transition-colors cursor-pointer text-left"
              >
                Profile
                {getSortIcon('username')}
              </button>
              <button 
                onClick={() => handleSort('followers')}
                className="col-span-1 flex items-center justify-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                Followers
                {getSortIcon('followers')}
              </button>
              <button 
                onClick={() => handleSort('posts')}
                className="col-span-1 flex items-center justify-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                Posts
                {getSortIcon('posts')}
              </button>
              <button 
                onClick={() => handleSort('engagement')}
                className="col-span-1 flex items-center justify-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                Engagement
                {getSortIcon('engagement')}
              </button>
              <button 
                onClick={() => handleSort('category')}
                className="col-span-3 flex items-center justify-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                Category
                {getSortIcon('category')}
              </button>
              <div className="col-span-1 text-center">Action</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="flex-1">
            {sortedProfiles.map((profile, index) => (
              <div
                key={profile._id}
                onClick={() => onProfileClick(profile)}
                className="group grid grid-cols-12 gap-4 items-center p-4 hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-b-0 cursor-pointer"
              >
                {/* Profile Column */}
                <div className="col-span-5">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12 ring-2 ring-white/20 shadow-lg group-hover:ring-white/40 transition-all duration-300">
                        <AvatarImage
                          src={profile.simplified_profile.basic_info.profile_pic_url || "/placeholder.svg"}
                          alt={profile.simplified_profile.basic_info.username}
                        />
                        <AvatarFallback className="bg-white/20 backdrop-blur-sm text-white font-bold text-sm">
                          {profile.simplified_profile.basic_info.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {profile.simplified_profile.basic_info.is_verified && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-[#1a1a2e] flex items-center justify-center shadow-lg">
                          <Verified className="h-3 w-3 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate text-sm">
                          {profile.simplified_profile.basic_info.full_name ||
                            profile.simplified_profile.basic_info.username}
                        </h3>
                        <div className="flex items-center gap-1">
                          {profile.simplified_profile.basic_info.is_private && (
                            <div className="p-0.5 bg-white/20 backdrop-blur-sm rounded">
                              <Lock className="h-2.5 w-2.5 text-white/80" />
                            </div>
                          )}
                          {profile.simplified_profile.basic_info.is_business_account && (
                            <div className="p-0.5 bg-emerald-500/30 backdrop-blur-sm rounded">
                              <Building className="h-2.5 w-2.5 text-emerald-300" />
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs truncate">
                        @{profile.simplified_profile.basic_info.username}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Followers Column */}
                <div className="col-span-1 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-white font-medium text-sm">
                        {formatNumber(profile.simplified_profile.stats.followers_count)}
                      </span>
                    </div>
                    <span className="text-slate-400 text-xs">followers</span>
                  </div>
                </div>

                {/* Posts Column */}
                <div className="col-span-1 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-white font-medium text-sm">
                        {formatNumber(profile.simplified_profile.stats.posts_count)}
                      </span>
                    </div>
                    <span className="text-slate-400 text-xs">posts</span>
                  </div>
                </div>

                {/* Engagement Column */}
                <div className="col-span-1 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-white font-medium text-sm">
                        {
                          profile.simplified_profile.stats?.engagement_rate
                            ? profile.simplified_profile.stats?.engagement_rate.toFixed(1)
                            : "-"
                        }
                        {/* {((profile.simplified_profile.stats.followers_count / 100) * Math.random() * 5).toFixed(1)}% */}
                      </span>
                    </div>
                    <span className="text-slate-400 text-xs">rate</span>
                  </div>
                </div>

                {/* Category Column */}
                <div className="col-span-3 text-center text-xs">
                  {profile.simplified_profile.business_info?.category_name ? (
                     profile.simplified_profile.business_info.category_name
                  ) : (
                    <span className="text-slate-500 text-xs">-</span>
                  )}
                </div>
                <div className="col-span-1">
                     <Badge 
                     variant="outline" 
                     className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 border-amber-400/50 text-amber-200 backdrop-blur-sm shadow-lg text-xs px-2 py-1"
                    >
                      Show
                    </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 pt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full mb-6"></div>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 px-6 py-3"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                <span className="text-white font-medium">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 px-6 py-3"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  )
}