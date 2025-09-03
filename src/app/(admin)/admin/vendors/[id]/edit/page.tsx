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
  Save,
  ArrowLeft,
  Building2,
  X,
  Globe,
} from 'lucide-react';
import { vendorsApi } from '@/lib/api';
import { showToast } from '../../../../../../components/ui/toast';
import AdminLayout from '../../../../components/AdminLayout';
import { uploadImage } from '../../../../../../lib/storage';
import { Vendor } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingDiagram, setIsUploadingDiagram] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    logo_url: '',
    image_url: '',
    link: '',
    type: '',
    diagram_url: '',
  });

  // Fetch vendor data on component mount
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await vendorsApi.getById(vendorId);
        setVendor(data);
        setFormData({
          name: data.name,
          description: data.description || '',
          content: data.content || '',
          logo_url: data.logo_url || '',
          image_url: data.image_url || '',
          link: data.link || '',
          type: data.type || '',
          diagram_url: data.diagram_url || '',
        });
      } catch (error) {
        console.error('Error fetching vendor:', error);
        showToast({
          title: 'Error',
          message: 'Failed to load vendor',
          type: 'error',
        });
        router.push('/admin/vendors');
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    } catch (error) {
      console.error('Upload error:', error);
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
    } catch (error) {
      console.error('Upload error:', error);
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
    } catch (error) {
      console.error('Upload error:', error);
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

    setIsSaving(true);

    try {
      await vendorsApi.update(vendorId, {
        ...formData,
      });

      showToast({
        title: 'Success',
        message: 'Vendor updated successfully!',
        type: 'success',
      });

      router.push('/admin/vendors');
    } catch (error) {
      console.error('Error updating vendor:', error);
      showToast({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to update vendor',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout
        title="Edit Vendor"
        description="Loading vendor..."
        currentPage="/admin/vendors"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading vendor...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!vendor) {
    return (
      <AdminLayout
        title="Vendor Not Found"
        description="The requested vendor could not be found"
        currentPage="/admin/vendors"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg mb-4">Vendor not found</div>
            <Button onClick={() => router.push('/admin/vendors')}>
              Back to Vendors
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Edit Vendor"
      description="Update vendor information"
      currentPage="/admin/vendors"
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
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Update Vendor'}
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
                <CardDescription>Update vendor information</CardDescription>
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
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={value => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Application & Cloud Security">
                        Application & Cloud Security
                      </SelectItem>
                      <SelectItem value="Identity & Access">
                        Identity & Access
                      </SelectItem>
                      <SelectItem value="Security Operations">
                        Security Operations
                      </SelectItem>
                      <SelectItem value="Emerging Security">
                        Emerging Security
                      </SelectItem>
                      <SelectItem value="Network & Perimeter Security">
                        Network & Perimeter Security
                      </SelectItem>
                      <SelectItem value="Endpoint Security">
                        Endpoint Security
                      </SelectItem>
                      <SelectItem value="Data Security">
                        Data Security
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                </div>{' '}
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
                <CardDescription>Update the vendor&apos;s logo</CardDescription>
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
                  Update the featured image for the vendor
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

            <Card>
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
          <div className="space-y-4">
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
                        {formData.link && (
                          <a
                            href={formData.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
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
