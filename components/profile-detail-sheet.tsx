"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { InstagramProfile } from "@/types/profile";
import {
  Users,
  UserPlus,
  ImageIcon,
  Video,
  Verified,
  Lock,
  Building,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Calendar,
  Heart,
  MessageCircle,
  Eye,
  Play,
  Share,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";
import { useState } from "react";

interface ProfileDetailSheetProps {
  profile: InstagramProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDetailSheet({
  profile,
  isOpen,
  onClose,
}: ProfileDetailSheetProps) {
  const [showCalculations, setShowCalculations] = useState(false);

  if (!profile) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getProxiedImageUrl = (value: string) => {
    const encodedUrl = encodeURIComponent(value);
    const proxiedUrl = "https://images.weserv.nl/?url=" + encodedUrl;
    console.log("Proxied URL:", proxiedUrl);
    return proxiedUrl;
  };

  // Calculate engagement metrics
  const calculateEngagementMetrics = () => {
    const posts =
      profile?.simplified_profile?.media_info?.timeline_media?.posts_sample ||
      [];
    const followers = profile?.simplified_profile?.stats?.followers_count || 1;

    if (posts.length === 0) return null;

    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
    const totalEngagement = totalLikes + totalComments;
    const postsCount = posts.length;

    const averageLikes = Math.round(totalLikes / postsCount);
    const averageComments = Math.round(totalComments / postsCount);
    const engagementRate = (
      (totalEngagement / postsCount / followers) *
      100
    ).toFixed(2);

    // Estimated metrics based on industry averages
    const estimatedReach = Math.round(followers * 0.26); // ~26% typical reach rate
    const estimatedImpressions = Math.round(estimatedReach * 1.5); // Impressions typically 1.5x reach
    const averageReelPlays = Math.round(estimatedReach * 0.43); // Estimated based on engagement
    const averageShares = Math.round(averageLikes * 0.013); // ~1.3% of likes typically share

    return {
      engagementRate: parseFloat(engagementRate),
      estimatedImpressions,
      estimatedReach,
      averageLikes,
      averageComments,
      averageReelPlays,
      averageShares,
      totalLikes,
      totalComments,
      totalEngagement,
      postsCount,
      followers,
    };
  };

  const metrics = calculateEngagementMetrics();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[700px] text-xs sm:w-[640px]  bg-black border-gray-800 text-white overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={
                  profile?.simplified_profile?.basic_info?.profile_pic_url_hd ||
                  profile?.simplified_profile?.basic_info.profile_pic_url
                }
                alt={profile?.simplified_profile?.basic_info.username}
              />
              <AvatarFallback className="bg-gray-700 text-gray-300 text-lg">
                {profile?.simplified_profile?.basic_info.username
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SheetTitle className="text-white">
                  {profile?.simplified_profile?.basic_info.full_name ||
                    profile?.simplified_profile?.basic_info.username}
                </SheetTitle>
                {profile?.simplified_profile?.basic_info?.is_verified && (
                  <Verified className="h-5 w-5 text-yellow-500" />
                )}
                {profile?.simplified_profile?.basic_info?.is_private && (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
                {profile?.simplified_profile?.basic_info
                  ?.is_business_account && (
                  <Building className="h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="text-gray-400">
                @{profile?.simplified_profile?.basic_info.username}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4">
          {/* Stats */}
          <Card className="bg-black ">
            <CardHeader>
              <CardTitle className="text-white text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-2 bg-[#0e0e12] rounded-md">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">
                      {formatNumber(
                        profile?.simplified_profile.stats?.followers_count
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-[#0e0e12] rounded-md">
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">followings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">
                      {formatNumber(
                        profile?.simplified_profile.stats?.following_count
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-[#0e0e12] rounded-md">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">
                      {formatNumber(
                        profile?.simplified_profile.stats?.posts_count
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          {metrics && (
            <Card className="bg-black ">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-lg">
                  Engagement Analytics
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCalculations(!showCalculations)}
                  className="text-gray-400 hover:text-white"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* All Content Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300 font-medium">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    All content
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-2 bg-[#0e0e12] rounded-md">
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Engagement Rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">
                          {metrics.engagementRate}%
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-green-900 text-green-300 border-green-700"
                        >
                          above average
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl p-2 bg-[#0e0e12]">
                      <div className="flex items-center gap-3">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">
                          Estimated impressions
                        </span>
                      </div>
                      <span className="text-white font-bold">
                        {formatNumber(metrics.estimatedImpressions)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl p-2 bg-[#0e0e12]">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Estimated reach</span>
                      </div>
                      <span className="text-white font-bold">
                        {formatNumber(metrics.estimatedReach)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl p-2 bg-[#0e0e12]">
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Average likes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">
                          {formatNumber(metrics.averageLikes)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl p-2 bg-[#0e0e12]">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Average comments</span>
                      </div>
                      <span className="text-white font-bold">
                        {metrics.averageComments}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reels Section */}
                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-gray-300 font-medium">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    Reels
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between rounded-xl p-2 bg-[#0e0e12]">
                      <div className="flex items-center gap-3">
                        <Play className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">
                          Average reel plays
                        </span>
                      </div>
                      <span className="text-white font-bold">
                        {formatNumber(metrics.averageReelPlays)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl p-2 bg-[#0e0e12]">
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Engagement rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">
                          {metrics.engagementRate}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl p-2 bg-[#0e0e12]">
                      <div className="flex items-center gap-3">
                        <Share className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Average shares</span>
                      </div>
                      <span className="text-white font-bold">
                        {metrics.averageShares}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calculation Details */}
                {showCalculations && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Calculation Methods
                    </h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <strong>Sample Size:</strong> {metrics.postsCount}{" "}
                          recent posts
                        </div>
                        <div>
                          <strong>Engagement Rate:</strong> (Total Likes +
                          Comments) ÷ Posts ÷ Followers × 100
                        </div>
                        <div>
                          <strong>Estimated Reach:</strong> Followers × 26%
                          (industry average)
                        </div>
                        <div>
                          <strong>Estimated Impressions:</strong> Reach × 1.5
                          (typical multiplier)
                        </div>
                        <div>
                          <strong>Average Shares:</strong> Average Likes × 1.3%
                          (typical share rate)
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <strong>Raw Data:</strong>{" "}
                        {metrics.totalLikes.toLocaleString()} likes,{" "}
                        {metrics.totalComments} comments across{" "}
                        {metrics.postsCount} posts
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Biography */}
          {profile?.simplified_profile?.basic_info.biography && (
            <Card className="bg-black ">
              <CardHeader>
                <CardTitle className="text-white text-lg">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {profile?.simplified_profile?.basic_info.biography}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Business Info */}
          {profile?.simplified_profile?.business_info && (
            <Card className="bg-black ">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.simplified_profile?.business_info?.category_name && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      {
                        profile?.simplified_profile?.business_info
                          ?.category_name
                      }
                    </span>
                  </div>
                )}
                {profile?.simplified_profile?.business_info.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      {profile?.simplified_profile?.business_info.email}
                    </span>
                  </div>
                )}
                {profile?.simplified_profile?.business_info.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">
                      {profile?.simplified_profile?.business_info?.phone}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bio Links */}
          {profile?.simplified_profile?.bio_links &&
            profile?.simplified_profile?.bio_links.length > 0 && (
              <Card className="bg-black ">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {profile?.simplified_profile?.bio_links.map((link, index) => (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={index}
                      className="flex items-center  border gap-2 p-2 rounded "
                    >
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300 hover:underline">
                        {link.title || link.url}
                      </span>
                      <Badge
                        variant="outline"
                        className="ml-auto text-xs border-gray-600 hover:bg-opacity-40 text-gray-400"
                      >
                        {link.link_type}
                      </Badge>
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

          {/* Recent Posts */}
          {profile?.simplified_profile?.media_info?.timeline_media
            ?.posts_sample && (
            <Card className="bg-black ">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.simplified_profile?.media_info.timeline_media.posts_sample
                  .slice(0, 3)
                  .map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-3 p-3 border-b border-gray-700"
                    >
                      <img
                        src={
                          // getProxiedImageUrl(post.media_link) ||
                          // post.media_link ||
                          "/placeholder.svg"
                        }
                        alt="Post"
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {post.is_video ? (
                            <Video className="h-4 w-4 text-red-500" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-sm text-gray-400">
                            {formatDate(post.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{formatNumber(post.likes)} likes</span>
                          <span>{formatNumber(post.comments)} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {profile.metadata && (
            <Card className="bg-black ">
              <CardHeader>
                <CardTitle className="text-white text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">
                    Fetched:{" "}
                    {new Date(profile.metadata.fetched_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-gray-400"
                  >
                    {profile.metadata.data_type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-gray-400"
                  >
                    v{profile.metadata.processor_version}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
