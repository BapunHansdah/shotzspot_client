"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  MousePointer,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Settings,
  Database,
  AlertCircle,
  Search,
  Zap,
  CheckCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  Pie
} from "recharts";

// Types
interface OverviewMetrics {
  activeUsers: number;
  sessions: number;
  bounceRate: string;
  avgSessionDuration: string;
  pageViews: number;
  conversions: number;
  revenue: string;
}

interface TrafficSource {
  source: string;
  medium: string;
  campaign: string;
  activeUsers: number;
  sessions: number;
  conversions: number;
}

interface GeographicData {
  country: string;
  city: string;
  activeUsers: number;
  sessions: number;
}

interface DeviceData {
  deviceCategory: string;
  operatingSystem: string;
  browser: string;
  activeUsers: number;
  sessions: number;
}

interface SocialMediaData {
  platform: string;
  activeUsers: number;
  sessions: number;
  conversions: number;
}

interface TrendData {
  date: string;
  activeUsers: number;
  sessions: number;
  conversions: number;
}

interface AnalyticsData {
  overview: OverviewMetrics;
  trafficSources: TrafficSource[];
  geographic: GeographicData[];
  devices: DeviceData[];
  socialMedia: SocialMediaData[];
  trends: TrendData[];
}

// Constants
const API_BASE_URL = "https://dashboard.shotzspot.com/api";
const DEFAULT_PROPERTY_ID = "480246328";

const DATE_RANGES = [
  { label: "Last 7 days", value: "7daysAgo" },
  { label: "Last 30 days", value: "30daysAgo" },
  { label: "Last 90 days", value: "90daysAgo" },
  { label: "Last year", value: "365daysAgo" },
];

const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("7daysAgo");
  const [propertyId, setPropertyId] = useState(DEFAULT_PROPERTY_ID);
  const [customPropertyId, setCustomPropertyId] = useState("");
  const [showPropertyInput, setShowPropertyInput] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchAnalyticsData = async () => {
    if (!propertyId.trim()) {
      setError("Property ID is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/dashboard/${propertyId}?dateRange=${dateRange}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Property not found. Please check your Property ID.");
        } else if (response.status === 401) {
          throw new Error("Authentication failed. Please check your credentials.");
        } else if (response.status === 403) {
          throw new Error("Access denied. You don't have permission to view this property.");
        } else {
          throw new Error(`Failed to fetch data (${response.status}). Please try again.`);
        }
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setIsFirstLoad(false);
      } else {
        throw new Error(result.error || "Failed to fetch analytics data");
      }
    } catch (error:any) {
      console.error("Analytics fetch error:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch analytics data");
      
      // Set mock data for demo purposes when API fails
      if (error instanceof TypeError || error.message.includes('fetch')) {
        setData({
          overview: {
            activeUsers: 12543,
            sessions: 18765,
            bounceRate: "42.3",
            avgSessionDuration: "135.6",
            pageViews: 45231,
            conversions: 234,
            revenue: "15675.50"
          },
          trafficSources: [
            { source: "google", medium: "organic", campaign: "(not set)", activeUsers: 8765, sessions: 12543, conversions: 145 },
            { source: "instagram.com", medium: "social", campaign: "summer_campaign", activeUsers: 2134, sessions: 3456, conversions: 67 },
            { source: "facebook.com", medium: "social", campaign: "brand_awareness", activeUsers: 1876, sessions: 2987, conversions: 22 },
          ],
          geographic: [
            { country: "United States", city: "New York", activeUsers: 3456, sessions: 5432 },
            { country: "United Kingdom", city: "London", activeUsers: 2134, sessions: 3456 },
            { country: "India", city: "Mumbai", activeUsers: 1876, sessions: 2987 },
          ],
          devices: [
            { deviceCategory: "mobile", operatingSystem: "iOS", browser: "Safari", activeUsers: 6789, sessions: 9876 },
            { deviceCategory: "desktop", operatingSystem: "Windows", browser: "Chrome", activeUsers: 4321, sessions: 6543 },
            { deviceCategory: "tablet", operatingSystem: "Android", browser: "Chrome", activeUsers: 1433, sessions: 2346 },
          ],
          socialMedia: [
            { platform: "instagram.com", activeUsers: 2134, sessions: 3456, conversions: 67 },
            { platform: "facebook.com", activeUsers: 1876, sessions: 2987, conversions: 22 },
            { platform: "twitter.com", activeUsers: 987, sessions: 1543, conversions: 12 },
          ],
          trends: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            activeUsers: Math.floor(Math.random() * 2000) + 1000,
            sessions: Math.floor(Math.random() * 3000) + 1500,
            conversions: Math.floor(Math.random() * 50) + 20,
          }))
        });
        setError("Using demo data - API connection failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyIdChange = () => {
    if (customPropertyId.trim()) {
      setPropertyId(customPropertyId.trim());
      setShowPropertyInput(false);
      setCustomPropertyId("");
    }
  };

  useEffect(() => {
    if (!isFirstLoad) {
      fetchAnalyticsData();
    }
  }, [dateRange, propertyId]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: string) => {
    const mins = Math.floor(parseFloat(seconds) / 60);
    const secs = Math.floor(parseFloat(seconds) % 60);
    return `${mins}m ${secs}s`;
  };

  const EmptyState = ({ title, description, icon: Icon, actionText, onAction }: {
    title: string;
    description: string;
    icon: any;
    actionText?: string;
    onAction?: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-slate-500/20 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-4 max-w-md">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="bg-indigo-600 hover:bg-indigo-700">
          {actionText}
        </Button>
      )}
    </div>
  );

  if (isFirstLoad) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-gray-100">
        
        <div className="relative z-10 p-6">
          <div className="max-w-2xl mx-auto mt-20">
            <div className="mb-4">
              <div className="flex items-center gap-2">
              <img className="w-10 h-10 rounded-3xl" src={'/logo.png'}/>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Shotzspot Analytics
              </h1>
              </div>
              <p className="text-slate-400 text-lg">
                Get comprehensive insights into your website performance
              </p>
            </div>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="text-center">
                <CardTitle className="text-white flex items-center justify-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configure Your Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="property-id" className="text-slate-300 mb-2 block">
                    Google Analytics Property ID
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="property-id"
                      value={propertyId}
                      onChange={(e) => setPropertyId(e.target.value)}
                      placeholder="e.g., 480246328"
                      className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                    />
                  </div>
                  <p className="text-slate-500 text-sm mt-2">
                    Enter your Google Analytics 4 property ID to start viewing your data
                  </p>
                </div>

                <div>
                  <Label className="text-slate-300 mb-2 block">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/20 text-white">
                      {DATE_RANGES.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={fetchAnalyticsData} 
                  disabled={loading || !propertyId.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading Analytics...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Load Dashboard
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Analytics</h2>
          <p className="text-slate-400">Fetching your data from Google Analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] text-gray-100">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full -translate-y-20 translate-x-20 blur-3xl"></div>
        
        <div className="relative z-10 p-6 flex items-center justify-center min-h-screen">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Analytics</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            
            <div className="space-y-3">
              <Button onClick={fetchAnalyticsData} className="w-full bg-indigo-600 hover:bg-indigo-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsFirstLoad(true)}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Change Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasData = data && (
    data.overview.activeUsers > 0 ||
    data.trafficSources.length > 0 ||
    data.geographic.length > 0 ||
    data.devices.length > 0
  );

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-gray-100">
      {/* Decorative Elements */}

      <div className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-slate-400">Property ID: {propertyId}</p>
              {error && (
                <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300">
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 backdrop-blur-sm text-white">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/20 text-white">
                {DATE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!showPropertyInput ? (
              <Button
                onClick={() => setShowPropertyInput(true)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Change Property
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  value={customPropertyId}
                  onChange={(e) => setCustomPropertyId(e.target.value)}
                  placeholder="New Property ID"
                  className="w-40 bg-white/10 border-white/20 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handlePropertyIdChange()}
                />
                <Button onClick={handlePropertyIdChange} size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button onClick={() => setShowPropertyInput(false)} variant="outline" size="sm" className="border-white/20">
                  Cancel
                </Button>
              </div>
            )}
            
            <Button
              onClick={fetchAnalyticsData}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {!hasData ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent>
              <EmptyState
                icon={Database}
                title="No Data Available"
                description="There's no analytics data available for the selected property and date range. This could be because the property is new, has no traffic, or the tracking code isn't properly installed."
                actionText="Refresh Data"
                onAction={fetchAnalyticsData}
              />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Active Users",
                  value: formatNumber(data?.overview.activeUsers || 0),
                  icon: Users,
                  color: "from-blue-500 to-cyan-500",
                  change: "+12.5%"
                },
                {
                  title: "Sessions",
                  value: formatNumber(data?.overview.sessions || 0),
                  icon: MousePointer,
                  color: "from-purple-500 to-pink-500",
                  change: "+8.2%"
                },
                {
                  title: "Page Views",
                  value: formatNumber(data?.overview.pageViews || 0),
                  icon: Eye,
                  color: "from-emerald-500 to-teal-500",
                  change: "+15.3%"
                },
                {
                  title: "Revenue",
                  value: `$${data?.overview.revenue || "0"}`,
                  icon: DollarSign,
                  color: "from-amber-500 to-orange-500",
                  change: "+22.1%"
                },
              ].map((metric, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} bg-opacity-20`}>
                        <metric.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 text-sm">
                        <ArrowUpRight className="h-4 w-4" />
                        {metric.change}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 text-sm">{metric.title}</p>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <TrendingUp className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Bounce Rate</p>
                      <p className="text-xl font-bold text-white">{data?.overview.bounceRate || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Clock className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Avg. Session Duration</p>
                      <p className="text-xl font-bold text-white">
                        {formatDuration(data?.overview.avgSessionDuration || "0")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Target className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Conversions</p>
                      <p className="text-xl font-bold text-white">{formatNumber(data?.overview.conversions || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Trends */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Traffic Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data?.trends && data.trends.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={data.trends}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="activeUsers"
                          stroke="#8B5CF6"
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                          name="Active Users"
                        />
                        <Area
                          type="monotone"
                          dataKey="sessions"
                          stroke="#06B6D4"
                          fillOpacity={1}
                          fill="url(#colorSessions)"
                          name="Sessions"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState
                      icon={BarChart3}
                      title="No Trend Data"
                      description="Trend data is not available for the selected date range."
                    />
                  )}
                </CardContent>
              </Card>

              {/* Device Categories */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Device Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data?.devices && data.devices.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={data.devices.reduce((acc: any[], device) => {
                            const existing = acc.find(item => item.name === device.deviceCategory);
                            if (existing) {
                              existing.value += device.activeUsers;
                            } else {
                              acc.push({
                                name: device.deviceCategory,
                                value: device.activeUsers
                              });
                            }
                            return acc;
                          }, [])}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {data.devices.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState
                      icon={Smartphone}
                      title="No Device Data"
                      description="Device category data is not available for the selected date range."
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Traffic Sources & Geography */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Top Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data?.trafficSources && data.trafficSources.length > 0 ? (
                    <div className="space-y-4">
                      {data.trafficSources.slice(0, 5).map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <div>
                              <p className="text-white font-medium">{source.source}</p>
                              <p className="text-slate-400 text-sm">{source.medium}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">{formatNumber(source.activeUsers)}</p>
                            <p className="text-slate-400 text-sm">{source.conversions} conversions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Search}
                      title="No Traffic Sources"
                      description="Traffic source data is not available for the selected date range."
                    />
                  )}
                </CardContent>
              </Card>

              {/* Geographic Data */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Top Countries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data?.geographic && data.geographic.length > 0 ? (
                    <div className="space-y-4">
                      {data.geographic.slice(0, 5).map((location, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-xs font-bold">{location.country.slice(0, 2).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{location.country}</p>
                              <p className="text-slate-400 text-sm">{location.city}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">{formatNumber(location.activeUsers)}</p>
                            <p className="text-slate-400 text-sm">{formatNumber(location.sessions)} sessions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Globe}
                      title="No Geographic Data"
                      description="Location data is not available for the selected date range."
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Social Media Performance */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Social Media Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.socialMedia && data.socialMedia.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.socialMedia.map((platform, index) => (
                      <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white font-medium capitalize">
                            {platform.platform.replace('.com', '')}
                          </h3>
                          <Badge variant="outline" className="bg-emerald-500/20 border-emerald-500/50 text-emerald-300">
                            Social
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400 text-sm">Users</span>
                            <span className="text-white font-medium">{formatNumber(platform.activeUsers)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 text-sm">Sessions</span>
                            <span className="text-white font-medium">{formatNumber(platform.sessions)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 text-sm">Conversions</span>
                            <span className="text-white font-medium">{platform.conversions}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Activity}
                    title="No Social Media Data"
                    description="Social media traffic data is not available for the selected date range. This could mean you haven't received any social media traffic recently."
                  />
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Error Message Banner */}
        {error && data && (
          <Card className="bg-yellow-500/10 border-yellow-500/20 border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-yellow-200 font-medium">Demo Mode Active</p>
                  <p className="text-yellow-300/80 text-sm">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}