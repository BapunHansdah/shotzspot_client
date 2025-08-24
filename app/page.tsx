"use client";

import { useState, useEffect } from "react";
import { ProfileFilters } from "@/components/profile-filters";
import { ProfileList } from "@/components/profile-list";
import { ProfileDetailSheet } from "@/components/profile-detail-sheet";
import { DashboardHeader } from "@/components/dashboard-header";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import type { InstagramProfile } from "@/types/profile";
import AiSearch from "@/components/ai-search";

const API_BASE_URL = "https://dashboard.shotzspot.com/api";

export default function Dashboard() {
  const [profiles, setProfiles] = useState<InstagramProfile[]>([]);
  const [selectedProfile, setSelectedProfile] =
    useState<InstagramProfile | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [aiSearchData, setAiSearchData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, logout } = useAuth();

  const fetchProfiles = async (page = 1, filters = {}) => {
    setLoading(true);
    setError("");
    setIsAiSearch(false);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      // Add pagination
      queryParams.append("page", page.toString());
      queryParams.append("limit", "50");

      // Add filters to query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${API_BASE_URL}/profiles?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        // Token expired or invalid
        await logout();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(page);

        // Optional: Log the applied filters for debugging
        if (Object.keys(filters).length > 0) {
          console.log("Applied filters:", filters);
          console.log("Total results:", data.total);
        }
      } else {
        throw new Error("Failed to fetch profiles");
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
      setError("Failed to load profiles. Please try again.");
      setProfiles([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAiSearch) {
      fetchProfiles(currentPage, filters);
    }
  }, [currentPage, filters, isAiSearch]);

  const handleProfileClick = async (profile: InstagramProfile) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profile._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (response.ok) {
        const fullProfile = await response.json();
        console.log("Full profile details:", fullProfile);
        setSelectedProfile(fullProfile.profile);
      } else {
        setSelectedProfile(profile);
      }
    } catch (error) {
      console.error("Failed to fetch profile details:", error);
      setSelectedProfile(profile);
    }
    setIsSheetOpen(true);
  };

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsAiSearch(false);
    setAiSearchData(null);
  };

  const handleAiSearchResults = (searchData: any) => {
    console.log("AI Search Results received:", searchData);

    setProfiles(searchData.profiles || []);
    setTotalPages(searchData.totalPages || 1);
    setCurrentPage(searchData.page || 1);
    setIsAiSearch(true);
    setAiSearchData(searchData);
    setError("");
    setLoading(false);

    // Clear any existing filters when AI search is used
    setFilters({});
  };

  const handleAiSearchError = (errorMessage: string) => {
    setError(`AI Search Error: ${errorMessage}`);
  };

  const handlePageChange = (page: number) => {
    if (isAiSearch) {
      console.log("AI Search pagination not implemented yet");
      return;
    }
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    if (isAiSearch) {
      setIsAiSearch(false);
      setAiSearchData(null);
    }
    fetchProfiles(currentPage, filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setIsAiSearch(false);
    setAiSearchData(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#1a1a2e] text-gray-100 flex flex-col">
        <DashboardHeader user={user} onRefresh={handleRefresh} />

        <div className="flex-1 flex overflow-hidden max-h-[88vh]">
          {/* Fixed Left Sidebar - Filters */}
          <div className="w-80 bg-[#1a1a2e] border-r border-gray-700 flex-shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <AiSearch
              onSearchResults={handleAiSearchResults}
              onError={handleAiSearchError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
            <div className="h-full p-6">
              <ProfileFilters
                onFilterChange={handleSearch}
                onClear={handleClearFilters}
              />
            </div>
          </div>

          {/* Right Content - Main Dashboard */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border-b border-gray-700/50 shadow-lg">
              <div className="p-6 flex-shrink-0">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-semibold text-white">
                      Shotzspot Profile Dashboard
                    </h1>
                    {isAiSearch && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-blue-300 uppercase tracking-wide">
                          AI Search Active
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-300 text-base leading-relaxed">
                      Manage and view Instagram profiles with advanced analytics
                    </p>

                    {isAiSearch && aiSearchData && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-400/20 rounded-lg backdrop-blur-sm">
                        <svg
                          className="w-4 h-4 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-emerald-300">
                          Found{" "}
                          <span className="font-bold text-emerald-200">
                            {aiSearchData.total}
                          </span>{" "}
                          profiles matching your AI search criteria
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-500/10 border border-red-400/30 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-red-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-red-300 text-sm font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div> */}
            {/* Scrollable Profile List */}
            <div className="flex-1  overflow-y-auto">
              <div className="py-6">
                <ProfileList
                  profiles={profiles}
                  loading={loading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onProfileClick={handleProfileClick}
                  onPageChange={handlePageChange}
                  isAILoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile detail sheet */}
        <ProfileDetailSheet
          profile={selectedProfile}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
