"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Users, Eye, Calendar, FileText, Building2, Star, BarChart3, Activity } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";

// Mock analytics data
const analyticsData = {
  overview: {
    totalVisitors: 15420,
    totalPageViews: 45680,
    totalEvents: 5,
    totalResources: 8,
    totalVendors: 6,
    featuredResources: 3
  },
  trends: {
    visitors: {
      current: 15420,
      previous: 12850,
      change: 20.0,
      trend: "up"
    },
    pageViews: {
      current: 45680,
      previous: 38920,
      change: 17.4,
      trend: "up"
    },
    events: {
      current: 5,
      previous: 3,
      change: 66.7,
      trend: "up"
    },
    resources: {
      current: 8,
      previous: 6,
      change: 33.3,
      trend: "up"
    }
  },
  topPages: [
    { name: "Home", views: 12500, change: 12.5 },
    { name: "About", views: 8900, change: 8.2 },
    { name: "Services", views: 7200, change: 15.3 },
    { name: "Events", views: 5400, change: 22.1 },
    { name: "Resources", views: 4800, change: 18.7 }
  ],
  topResources: [
    { title: "Getting Started with Cloud Migration", views: 3200, type: "article" },
    { title: "The Future of Web Development", views: 2800, type: "blog" },
    { title: "Digital Transformation Strategies", views: 2400, type: "article" },
    { title: "Cybersecurity in the Cloud Era", views: 2100, type: "blog" },
    { title: "Mobile App Development Best Practices", views: 1800, type: "article" }
  ],
  recentActivity: [
    { type: "event", action: "New event created", item: "Mobile App Development Conference", time: "2 hours ago" },
    { type: "resource", action: "Resource published", item: "Cybersecurity in the Cloud Era", time: "1 day ago" },
    { type: "vendor", action: "Vendor added", item: "SecureNet Technologies", time: "2 days ago" },
    { type: "resource", action: "Resource featured", item: "Digital Transformation Strategies", time: "3 days ago" },
    { type: "event", action: "Event updated", item: "Cloud Solutions Workshop", time: "4 days ago" }
  ]
};

export default function AnalyticsPage() {
  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "resource":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "vendor":
        return <Building2 className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AdminLayout
      title="Analytics"
      description="Track website performance and content analytics"
      currentPage="/admin/analytics"
    >
      <div className="space-y-6">
        {/* Date Range Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Website performance and content analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select defaultValue="30">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Export Data</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {analyticsData.trends.visitors.current.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {getTrendIcon(analyticsData.trends.visitors.trend)}
                <span className={getTrendColor(analyticsData.trends.visitors.trend)}>
                  +{analyticsData.trends.visitors.change}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {analyticsData.trends.pageViews.current.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {getTrendIcon(analyticsData.trends.pageViews.trend)}
                <span className={getTrendColor(analyticsData.trends.pageViews.trend)}>
                  +{analyticsData.trends.pageViews.change}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {analyticsData.trends.events.current}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {getTrendIcon(analyticsData.trends.events.trend)}
                <span className={getTrendColor(analyticsData.trends.events.trend)}>
                  +{analyticsData.trends.events.change}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Published Resources</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {analyticsData.trends.resources.current}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {getTrendIcon(analyticsData.trends.resources.trend)}
                <span className={getTrendColor(analyticsData.trends.resources.trend)}>
                  +{analyticsData.trends.resources.change}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={page.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{page.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {page.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">+{page.change}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Top Resources</CardTitle>
              <CardDescription>Most viewed articles and blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topResources.map((resource, index) => (
                  <div key={resource.title} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium line-clamp-1">{resource.title}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          {resource.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes and updates in your admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">{activity.item}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Session Duration</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">4m 32s</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bounce Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">32.4%</div>
              <p className="text-xs text-muted-foreground">-5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured Resources</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{analyticsData.overview.featuredResources}</div>
              <p className="text-xs text-muted-foreground">Currently featured</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 