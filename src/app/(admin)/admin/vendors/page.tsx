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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Building2,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  Globe,
  Upload,
  FileText,
  Download,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { Vendor, vendorsApi } from '@/lib/api';
import { ConfirmDialog } from '../../../../components/ui/confirm-dialog';
import { showToast } from '../../../../components/ui/toast';
import { useRouter } from 'next/navigation';
import { uploadVendorPortfolio, getVendorPortfolioUrl } from '@/lib/storage';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null);

  const router = useRouter();

  // Fetch vendors from API
  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const data = await vendorsApi.getAll();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current portfolio URL
  const fetchPortfolioUrl = () => {
    try {
      const url = getVendorPortfolioUrl();
      console.log('Portfolio URL:', url);
      setPortfolioUrl(url);
    } catch (error) {
      console.error('Error getting portfolio URL:', error);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchPortfolioUrl();
  }, []);

  const handleAddVendor = () => {
    router.push('/admin/vendors/create');
  };

  const handleEditVendor = (vendorId: number) => {
    router.push(`/admin/vendors/${vendorId}/edit`);
  };

  const handleDeleteVendor = (vendorId: number) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setVendorToDelete(vendor);
      setShowDeleteDialog(true);
    }
  };

  const handleVisitWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePortfolioUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPortfolio(true);

    try {
      const result = await uploadVendorPortfolio(file);

      if (result.success && result.url) {
        setPortfolioUrl(result.url);
        showToast({
          title: 'Success',
          message: 'Vendor portfolio updated successfully!',
          type: 'success',
        });
        // Refresh the portfolio URL
        fetchPortfolioUrl();
      } else {
        showToast({
          title: 'Upload Failed',
          message: result.error || 'Failed to upload portfolio',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Portfolio upload error:', error);
      showToast({
        title: 'Upload Failed',
        message: 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setIsUploadingPortfolio(false);
    }
  };

  const handleDownloadPortfolio = () => {
    if (portfolioUrl) {
      window.open(portfolioUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(
    vendor =>
      !searchTerm ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.description &&
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <AdminLayout
        title="Vendors"
        description="Manage partner vendors and their information"
        currentPage="/admin/vendors"
        showAddButton={true}
        addButtonText="Add Vendor"
        onAddClick={handleAddVendor}
      >
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Portfolio Upload Loading */}
          <Card className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500">
            <CardHeader>
              <div className="h-6 w-48 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-64 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 w-32 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardContent>
          </Card>

          {/* Search Loading */}
          <Card className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500">
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-64 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 w-full bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardContent>
          </Card>

          {/* Vendors Table Loading */}
          <Card
            className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: '100ms' }}
          >
            <CardHeader>
              <div className="h-6 w-24 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-48 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-2">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center transition-all duration-300 ease-out"></div>
                      <div>
                        <div className="h-4 w-32 bg-muted rounded mb-1 transition-all duration-300 ease-out"></div>
                        <div className="h-3 w-20 bg-muted rounded transition-all duration-300 ease-out"></div>
                      </div>
                    </div>
                    <div className="h-4 w-60 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-5 w-16 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-16 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-24 bg-muted rounded transition-all duration-300 ease-out"></div>
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
      title="Vendors"
      description="Manage partner vendors and their information"
      currentPage="/admin/vendors"
      showAddButton={true}
      addButtonText="Add Vendor"
      onAddClick={handleAddVendor}
    >
      <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        {/* Portfolio Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Vendor Portfolio Management
            </CardTitle>
            <CardDescription>
              Upload and manage the Netpoleon ANZ Vendor Portfolio PDF document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <input
                  id="portfolio-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handlePortfolioUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById('portfolio-upload')?.click()
                  }
                  disabled={isUploadingPortfolio}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isUploadingPortfolio ? 'Uploading...' : 'Upload Portfolio'}
                </Button>
                {portfolioUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPortfolio}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    View Portfolio
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {portfolioUrl ? (
                  <span className="text-green-600">✓ Portfolio available</span>
                ) : (
                  <span className="text-amber-600">No portfolio uploaded</span>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Upload a PDF file to replace the existing vendor portfolio.
              Maximum file size: 10MB.
            </p>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Vendors</CardTitle>
            <CardDescription>
              Find specific vendors by name or description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vendors..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vendors Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Vendors</CardTitle>
            <CardDescription>
              {filteredVendors.length} vendors total • Partner network
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredVendors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? 'No vendors found matching your search.'
                  : 'No vendors found. Create your first vendor!'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Diagram</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map(vendor => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {vendor.logo_url && (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{vendor.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {vendor.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {vendor.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[120px] truncate">
                          {vendor.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        {vendor.logo_url ? (
                          <Badge variant="outline">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Logo
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No logo
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {vendor.diagram_url ? (
                          <Badge variant="outline">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Diagram
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No diagram
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {vendor.link ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVisitWebsite(vendor.link!)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No website
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(vendor.created_at).toLocaleDateString()}
                        </div>
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
                              onClick={() => handleEditVendor(vendor.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Vendor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteVendor(vendor.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Vendor
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
                Total Vendors
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {vendors.length}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                With Logos
              </CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {vendors.filter(v => v.logo_url).length}
              </div>
              <p className="text-xs text-muted-foreground">Branded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                With Websites
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {vendors.filter(v => v.link).length}
              </div>
              <p className="text-xs text-muted-foreground">Online presence</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setVendorToDelete(null);
        }}
        onConfirm={async () => {
          if (vendorToDelete) {
            try {
              await vendorsApi.delete(vendorToDelete.id);
              fetchVendors(); // Refresh the data
              setShowDeleteDialog(false);
              setVendorToDelete(null);
              showToast({
                title: 'Success',
                message: 'Vendor deleted successfully',
                type: 'success',
              });
            } catch (error) {
              console.error('Error deleting vendor:', error);
              showToast({
                title: 'Error',
                message: 'Failed to delete vendor',
                type: 'error',
              });
            }
          }
        }}
        title="Delete Vendor"
        message={`Are you sure you want to delete "${vendorToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </AdminLayout>
  );
}
