'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  FileText,
  Calendar,
  Star,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { Resource, FeaturedResource, resourcesApi } from '@/lib/api';
import { ConfirmDialog } from '../../../../components/ui/confirm-dialog';
import { showToast } from '../../../../components/ui/toast';
import { useRouter } from 'next/navigation';

interface ResourceType {
  id: number;
  name: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [featuredResources, setFeaturedResources] = useState<
    FeaturedResource[]
  >([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(
    null
  );

  // Fetch resources from API
  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const [resourcesData, featuredData, typesResponse] = await Promise.all([
        resourcesApi.getAll(),
        resourcesApi.getFeatured(),
        fetch('/api/resource-type'),
      ]);

      const typesData = await typesResponse.json();
      console.log('Fetched resource types:', typesData);

      setResources(resourcesData);
      setFeaturedResources(featuredData);
      setResourceTypes(typesData || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const router = useRouter();

  const handleAddResource = () => {
    router.push('/admin/resources/create');
  };

  const handleEditResource = (resourceId: number) => {
    router.push(`/admin/resources/${resourceId}/edit`);
  };

  const handleDeleteResource = (resourceId: number) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      setResourceToDelete(resource);
      setShowDeleteDialog(true);
    }
  };

  const handleTogglePublish = async (resourceId: number) => {
    try {
      const resource = resources.find(r => r.id === resourceId);
      if (resource) {
        await resourcesApi.update(resourceId, {
          is_published: !resource.is_published,
          published_at: !resource.is_published
            ? new Date().toISOString().split('T')[0]
            : null,
        });
        fetchResources(); // Refresh the data
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      showToast({
        title: 'Error',
        message: 'Failed to update publish status',
        type: 'error',
      });
    }
  };

  const handleToggleFeatured = async (resourceId: number) => {
    try {
      const isCurrentlyFeatured = isFeatured(resourceId);

      if (isCurrentlyFeatured) {
        // Remove from featured
        await resourcesApi.removeFeatured(resourceId);
        showToast({
          title: 'Success',
          message: 'Resource removed from featured',
          type: 'success',
        });
      } else {
        // Add to featured (this will automatically remove any existing featured resource)
        await resourcesApi.addFeatured(resourceId);
        showToast({
          title: 'Success',
          message: 'Resource is now featured',
          type: 'success',
        });
      }

      fetchResources(); // Refresh the data
    } catch (error) {
      console.error('Error toggling featured status:', error);
      showToast({
        title: 'Error',
        message: 'Failed to update featured status',
        type: 'error',
      });
    }
  };

  const isFeatured = (resourceId: number) => {
    return featuredResources.some(fr => fr.resource_id === resourceId);
  };

  // Filter resources based on search term and type
  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      !searchTerm ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description &&
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      selectedTypeId === null || resource.type_id === selectedTypeId;

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <AdminLayout
        title="Resources"
        description="Manage articles and blog posts"
        currentPage="/admin/resources"
        showAddButton={true}
        addButtonText="Add Resource"
        onAddClick={handleAddResource}
      >
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Search Loading */}
          <Card className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500">
            <CardHeader>
              <div className="h-6 w-36 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-64 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 w-full bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardContent>
          </Card>

          {/* Resources Table Loading */}
          <Card
            className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: '100ms' }}
          >
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-56 bg-muted rounded transition-all duration-300 ease-out"></div>
              <div className="h-4 w-80 bg-muted rounded mt-2 transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-2">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center transition-all duration-300 ease-out"></div>
                      <div>
                        <div className="h-4 w-40 bg-muted rounded mb-1 transition-all duration-300 ease-out"></div>
                        <div className="h-3 w-60 bg-muted rounded transition-all duration-300 ease-out"></div>
                      </div>
                    </div>
                    <div className="h-5 w-16 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-5 w-20 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-24 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-8 w-8 bg-muted rounded transition-all duration-300 ease-out"></div>
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

  return (
    <AdminLayout
      title="Resources"
      description="Manage articles and blog posts"
      currentPage="/admin/resources"
      showAddButton={true}
      addButtonText="Add Resource"
      onAddClick={handleAddResource}
    >
      <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter Resources</CardTitle>
            <CardDescription>
              Find specific resources by title, content, or type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Resource Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filter by Type</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTypeId === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTypeId(null)}
                >
                  All Types
                </Button>
                {resourceTypes.length === 0 ? (
                  <span className="text-sm text-muted-foreground">
                    No types available
                  </span>
                ) : (
                  resourceTypes.map(type => (
                    <Button
                      key={type.id}
                      variant={
                        selectedTypeId === type.id ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedTypeId(type.id)}
                    >
                      {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    </Button>
                  ))
                )}
              </div>
              {resourceTypes.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Showing {resourceTypes.length} type
                  {resourceTypes.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resources Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Resources</CardTitle>
            <CardDescription>
              {filteredResources.length} resources total •{' '}
              {filteredResources.filter(r => r.is_published).length} published •{' '}
              {featuredResources.length} featured
            </CardDescription>
            <div className="text-sm text-muted-foreground mt-2">
              💡 Only one resource can be featured at a time. Selecting a new
              featured resource will automatically remove the previous one.
            </div>
          </CardHeader>
          <CardContent>
            {filteredResources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? 'No resources found matching your search.'
                  : 'No resources found. Create your first resource!'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-center">Featured</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map(resource => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {resource.cover_image_url && (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Image
                                unoptimized
                                src={resource.cover_image_url}
                                alt={`${resource.title} cover image`}
                                width={24}
                                height={24}
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{resource.title}</div>
                            <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                              {resource.description || 'No description'}
                            </div>
                            {(resource.type === 'article' ||
                              resource.resource_type?.name === 'article') &&
                              resource.article_link && (
                                <div className="text-xs text-blue-600 mt-1">
                                  <a
                                    href={resource.article_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    View Article →
                                  </a>
                                </div>
                              )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            resource.type === 'article' ||
                            resource.resource_type?.name === 'article'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {resource.type ||
                            resource.resource_type?.name ||
                            'Unknown'}
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
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {resource.published_at
                            ? new Date(
                                resource.published_at
                              ).toLocaleDateString()
                            : 'Not published'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant={
                            isFeatured(resource.id) ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => handleToggleFeatured(resource.id)}
                          className="mx-auto"
                        >
                          <Star
                            className={`h-4 w-4 ${isFeatured(resource.id) ? 'text-yellow-500' : ''}`}
                          />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              data-testid="row-menu"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditResource(resource.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Resource
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleTogglePublish(resource.id)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {resource.is_published ? 'Unpublish' : 'Publish'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteResource(resource.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Resource
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Resources
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {resources.length}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {resources.filter(r => r.is_published).length}
              </div>
              <p className="text-xs text-muted-foreground">Live content</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Featured
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {featuredResources.length}
              </div>
              <p className="text-xs text-muted-foreground">Highlighted</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setResourceToDelete(null);
        }}
        onConfirm={async () => {
          if (resourceToDelete) {
            try {
              await resourcesApi.delete(resourceToDelete.id);
              fetchResources();
              setShowDeleteDialog(false);
              setResourceToDelete(null);
            } catch (error) {
              console.error('Error deleting resource:', error);
              showToast({
                title: 'Error',
                message: 'Failed to delete resource',
                type: 'error',
              });
            }
          }
        }}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resourceToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </AdminLayout>
  );
}
