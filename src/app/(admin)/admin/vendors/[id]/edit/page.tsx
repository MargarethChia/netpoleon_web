'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload,
  Eye,
  Send,
  ArrowLeft,
  Building2,
  X,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { vendorsApi } from '@/lib/api';
import { showToast } from '../../../../../../components/ui/toast';
import AdminLayout from '../../../../components/AdminLayout';
import { uploadImage } from '../../../../../../lib/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const VENDOR_TYPES = [
  'Application & Cloud Security',
  'Identity & Access',
  'Security Operations',
  'Emerging Security',
  'Network & Perimeter Security',
  'Endpoint Security',
  'Data Security',
];

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingDiagram, setIsUploadingDiagram] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    logo_url: '',
    image_url: '',
    link: '',
    types: [] as string[],
    diagram_url: '',
  });

  // Load vendor data on mount
  useEffect(() => {
    const loadVendor = async () => {
      if (!vendorId) return;

      try {
        const vendor = await vendorsApi.getById(parseInt(vendorId));
        setFormData({
          name: vendor.name || '',
          description: vendor.description || '',
          content: vendor.content || '',
          logo_url: vendor.logo_url || '',
          image_url: vendor.image_url || '',
          link: vendor.link || '',
          types: vendor.type ? vendor.type.split(', ').filter(Boolean) : [],
          diagram_url: vendor.diagram_url || '',
        });
      } catch {
        showToast({
          title: 'Error',
          message: 'Failed to load vendor data',
          type: 'error',
        });
      }
    };

    loadVendor();
  }, [vendorId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type],
    }));
  };

  const removeType = (typeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.filter(t => t !== typeToRemove),
    }));
  };

  const handleLogoUpload = async (file: File) => {
    setIsUploadingLogo(true);

    try {
      const result = await uploadImage(file);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, logo_url: result.url! }));
        showToast({
          title: 'Success',
          message: 'Logo uploaded successfully!',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Upload Failed',
          message: result.error || 'Failed to upload logo',
          type: 'error',
        });
      }
    } catch {
      showToast({
        title: 'Upload Failed',
        message: 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);

    try {
      const result = await uploadImage(file);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, image_url: result.url! }));
        showToast({
          title: 'Success',
          message: 'Image uploaded successfully!',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Upload Failed',
          message: result.error || 'Failed to upload image',
          type: 'error',
        });
      }
    } catch {
      showToast({
        title: 'Upload Failed',
        message: 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDiagramUpload = async (file: File) => {
    setIsUploadingDiagram(true);

    try {
      const result = await uploadImage(file);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, diagram_url: result.url! }));
        showToast({
          title: 'Success',
          message: 'Diagram uploaded successfully!',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Upload Failed',
          message: result.error || 'Failed to upload diagram',
          type: 'error',
        });
      }
    } catch {
      showToast({
        title: 'Upload Failed',
        message: 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setIsUploadingDiagram(false);
    }
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'image' | 'diagram'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'logo') {
        handleLogoUpload(file);
      } else if (type === 'image') {
        handleImageUpload(file);
      } else {
        handleDiagramUpload(file);
      }
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo_url: '' }));
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const removeDiagram = () => {
    setFormData(prev => ({ ...prev, diagram_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      showToast({
        title: 'Validation Error',
        message: 'Please fill in the vendor name',
        type: 'error',
      });
      return;
    }

    if (!vendorId) {
      showToast({
        title: 'Error',
        message: 'Vendor ID not found',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      await vendorsApi.update(parseInt(vendorId), {
        ...formData,
        type: formData.types.join(', '), // Convert array to comma-separated string for DB
      });

      showToast({
        title: 'Success',
        message: 'Vendor updated successfully!',
        type: 'success',
      });

      router.push('/admin/vendors');
    } catch (error) {
      showToast({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to update vendor',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Edit Vendor"
      description="Update vendor information"
      currentPage="/admin/vendors/edit"
    >
      <div className="space-y-4">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/vendors')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vendors
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Updating...' : 'Update Vendor'}
            </Button>
          </div>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - Form */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Details</CardTitle>
                <CardDescription>
                  Basic information about the vendor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vendor Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Enter vendor name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Describe the vendor and their services..."
                    className="h-24 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="types">Vendor Types</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span>
                          {formData.types.length === 0
                            ? 'Select vendor types'
                            : `${formData.types.length} type${formData.types.length === 1 ? '' : 's'} selected`}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[400px]">
                      {VENDOR_TYPES.map(type => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={formData.types.includes(type)}
                          onCheckedChange={() => handleTypeToggle(type)}
                        >
                          {type}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Selected types display */}
                  {formData.types.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.types.map(type => (
                        <div
                          key={type}
                          className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm"
                        >
                          <span>{type}</span>
                          <button
                            type="button"
                            onClick={() => removeType(type)}
                            className="hover:bg-secondary/40 rounded p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={e => handleInputChange('content', e.target.value)}
                    placeholder="Enter the main content about the vendor (supports HTML)..."
                    className="h-32 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    This field supports HTML content and will be displayed on
                    the vendor detail page.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={e => handleInputChange('link', e.target.value)}
                      placeholder="https://example.com"
                      type="url"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logo</CardTitle>
                <CardDescription>Upload the vendor&apos;s logo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="flex gap-2">
                    <input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileSelect(e, 'logo')}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('logo')?.click()}
                      disabled={isUploadingLogo}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    </Button>
                    {formData.logo_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeLogo}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Logo Preview */}
                  {formData.logo_url && (
                    <div className="relative">
                      <Image
                        unoptimized
                        src={formData.logo_url}
                        alt="Logo preview"
                        width={96}
                        height={96}
                        className="object-contain rounded-md border"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Logo
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>
                  Upload a featured image for the vendor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="flex gap-2">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileSelect(e, 'image')}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('image')?.click()}
                      disabled={isUploadingImage}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    {formData.image_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Image Preview */}
                  {formData.image_url && (
                    <div className="relative">
                      <Image
                        unoptimized
                        src={formData.image_url}
                        alt="Image preview"
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Featured Image
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Diagram</CardTitle>
                <CardDescription>
                  Upload a diagram or architecture image for the vendor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="flex gap-2">
                    <input
                      id="diagram"
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileSelect(e, 'diagram')}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById('diagram')?.click()
                      }
                      disabled={isUploadingDiagram}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploadingDiagram ? 'Uploading...' : 'Upload Diagram'}
                    </Button>
                    {formData.diagram_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeDiagram}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Diagram Preview */}
                  {formData.diagram_url && (
                    <div className="relative">
                      <Image
                        unoptimized
                        src={formData.diagram_url}
                        alt="Diagram preview"
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Diagram
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview */}
          <div className="space-y-4 mb-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Vendor Preview
                </CardTitle>
                <CardDescription>
                  See how the vendor will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
                {formData.name ||
                formData.description ||
                formData.content ||
                formData.logo_url ||
                formData.image_url ? (
                  <div className="space-y-6">
                    {/* Logo and Name */}
                    <div className="flex items-center gap-4">
                      {formData.logo_url && (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <Image
                            unoptimized
                            src={formData.logo_url}
                            alt="Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                            onError={e => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <h1 className="text-2xl font-bold text-foreground">
                          {formData.name || 'Vendor Name'}
                        </h1>
                        {formData.types.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {formData.types.map(type => (
                              <span
                                key={type}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        )}
                        {formData.link && (
                          <a
                            href={formData.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-2"
                          >
                            <Globe className="h-3 w-3" />
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Featured Image */}
                    {formData.image_url && (
                      <div className="w-full">
                        <Image
                          unoptimized
                          src={formData.image_url}
                          alt="Featured"
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover rounded-lg shadow-sm"
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Description */}
                    {formData.description && (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground leading-relaxed">
                          {formData.description}
                        </p>
                      </div>
                    )}

                    {/* Content */}
                    {formData.content && (
                      <div className="prose prose-sm max-w-none">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Main Content
                        </h3>
                        <div
                          className="text-foreground leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formData.content }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start adding vendor details to see a preview...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
