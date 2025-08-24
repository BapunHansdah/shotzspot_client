import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

interface AiSearchProps {
  onSearchResults?: (results: any) => void;
  onError?: (error: string) => void;
  setIsLoading?: any
  isLoading?: boolean;
}

const API_BASE_URL = "https://dashboard.shotzspot.com/api";

function AiSearch({ onSearchResults, onError, setIsLoading, isLoading  }: AiSearchProps) {
  const [query, setQuery] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSearch, setLastSearch] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    if (query.length < 3) {
      setError("Search query must be at least 3 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        q: query.trim(),
        page: "1",
        limit: "10"
      });

      const response = await fetch(
        `${API_BASE_URL}/profiles/ai-search?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        setLastSearch(query);
        console.log("AI Search Results:", data);
        
        // Call the callback function if provided
        if (onSearchResults) {
          onSearchResults(data);
        }
        
        // Clear the input after successful search
        setQuery("");
      } else {
        throw new Error(data.message || "Search failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      console.error("AI Search Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSearch();
    }
  };

  const clearError = () => {
    setError("");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-gray-100  mb-2">
          Find Influencers
        </h1>
        <p className="text-gray-400 text-sm">
          Search for Influencer with AI Search
        </p>
        {lastSearch && (
          <p className="text-green-400 text-xs mt-1">
            Last search: "{lastSearch}"
          </p>
        )}
      </div>

      {error && (
        <Alert className="mb-4 bg-red-900/20 border-red-800">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">
            {error}
            <button
              onClick={clearError}
              className="ml-2 text-red-300 hover:text-red-200 underline text-xs"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      <Textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe the influencers you're looking for...'Tech reviewers with high engagement rates'"
        className="mb-4 h-32 border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 resize-none"
        disabled={isLoading}
        maxLength={500}
      />

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">
          {query.length}/500 characters
        </span>
        <span className="text-xs text-gray-400">
          Press Ctrl+Enter to search
        </span>
      </div>

      <Button
        onClick={handleSearch}
        disabled={isLoading || !query.trim() || query.length < 3}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 mr-2" />
        )}
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
}

export default AiSearch;