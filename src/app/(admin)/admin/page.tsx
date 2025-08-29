'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Plus,
  Calendar,
  FileText,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '../components/AdminLayout';
import {
  Event,
  Resource,
  Vendor,
  FeaturedResource,
  FeaturedEvent,
  eventsApi,
  resourcesApi,
  vendorsApi,
} from '@/lib/api';

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [featuredResources, setFeaturedResources] = useState<
    FeaturedResource[]
  >([]);
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        eventsData,
        resourcesData,
        vendorsData,
        featuredResourcesData,
        featuredEventsData,
      ] = await Promise.all([
        eventsApi.getAll(),
        resourcesApi.getAll(),
        vendorsApi.getAll(),
        resourcesApi.getFeatured(),
        eventsApi.getFeatured(),
      ]);

      setEvents(eventsData);
      setResources(resourcesData);
      setVendors(vendorsData);
      setFeaturedResources(featuredResourcesData);
      setFeaturedEvents(featuredEventsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout
        title="Dashboard"
        description="Manage your content and data"
        currentPage="/admin"
      >
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Loading Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <Card
                key={i}
                className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-muted rounded transition-all duration-300 ease-out"></div>
                  <div className="h-4 w-4 bg-muted rounded transition-all duration-300 ease-out"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
                  <div className="h-3 w-32 bg-muted rounded transition-all duration-300 ease-out"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events Table Loading */}
            <Card
              className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: '200ms' }}
            >
              <CardHeader>
                <div className="h-6 w-32 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
                <div className="h-4 w-48 bg-muted rounded transition-all duration-300 ease-out"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 py-2">
                      <div className="h-4 w-32 bg-muted rounded transition-all duration-300 ease-out"></div>
                      <div className="h-4 w-20 bg-muted rounded transition-all duration-300 ease-out"></div>
                      <div className="h-4 w-24 bg-muted rounded transition-all duration-300 ease-out"></div>
                      <div className="h-8 w-8 bg-muted rounded transition-all duration-300 ease-out"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resources Table Loading */}
            <Card
              className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: '300ms' }}
            >
              <CardHeader>
                <div className="h-6 w-24 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
                <div className="h-4 w-40 bg-muted rounded transition-all duration-300 ease-out"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 py-2">
                      <div className="h-4 w-36 bg-muted rounded transition-all duration-300 ease-out"></div>
                      <div className="h-4 w-16 bg-muted rounded transition-all duration-300 ease-out"></div>
                      <div className="h-4 w-20 bg-muted rounded transition-all duration-300 ease-out"></div>
                      <div className="h-8 w-8 bg-muted rounded transition-all duration-300 ease-out"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendors Table Loading */}
          <Card
            className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: '400ms' }}
          >
            <CardHeader>
              <div className="h-6 w-20 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-52 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-2">
                    <div className="h-4 w-28 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-40 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-8 w-8 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-20 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-8 w-8 bg-muted rounded transition-all duration-300 ease-out"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout
        title="Dashboard"
        description="Manage your content and data"
        currentPage="/admin"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading dashboard data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchDashboardData}
            >
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Dashboard"
      description="Manage your content and data"
      currentPage="/admin"
    >
      <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {events.length}
              </div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published Resources
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {resources.filter((r: Resource) => r.is_published).length}
              </div>
              <p className="text-xs text-muted-foreground">+1 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Vendors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {vendors.length}
              </div>
              <p className="text-xs text-muted-foreground">+1 new vendor</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Featured Resources
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {featuredResources.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently featured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Featured Events
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {featuredEvents.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently featured
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Events</span>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your upcoming events and conferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.slice(0, 3).map((event: Event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell>
                        {new Date(event.event_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{event.location || 'N/A'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Resources Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resources</span>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </CardTitle>
              <CardDescription>Manage articles and blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.slice(0, 3).map((resource: Resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">
                        {resource.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            resource.type === 'article'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {resource.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            resource.is_published ? 'default' : 'outline'
                          }
                        >
                          {resource.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Vendors Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Vendors</span>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </Button>
            </CardTitle>
            <CardDescription>
              Manage partner vendors and their information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor: Vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {vendor.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      {vendor.logo_url && (
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs">Logo</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(vendor.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
