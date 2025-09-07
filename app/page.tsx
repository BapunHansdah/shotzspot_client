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
