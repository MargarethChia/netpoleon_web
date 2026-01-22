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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Switch } from '@/components/ui/switch';
import { Calendar, Upload, Save, ArrowLeft, X } from 'lucide-react';
import { resourcesApi } from '@/lib/api';
import { showToast } from '../../../../../../components/ui/toast';
import AdminLayout from '../../../../components/AdminLayout';
import { uploadImage } from '../../../../../../lib/storage';
import { Resource } from '@/lib/api';
import RichTextEditor from '@/components/ui/rich-text-editor';

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const resourceId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type_id: 1,
    is_published: false,
    published_at: new Date().toISOString().split('T')[0], // Default to today's date
    cover_image_url: '',
    article_link: '',
  });
  const [resourceTypes, setResourceTypes] = useState<
    Array<{
      id: number;
      name: string;
    }>
  >([]);
  const [contentMode, setContentMode] = useState<'content' | 'link'>('content'); // Track whether user wants to create content or use a link

  // Fetch resource types on mount
  useEffect(() => {
    fetch('/api/resource-type')
      .then(res => res.json())
      .then(data => {
        setResourceTypes(data);
      })
      .catch(() => {});
  }, []);

  // Fetch resource data on component mount
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await resourcesApi.getById(resourceId);
        setResource(data);

        // Determine content mode based on existing data
        const hasContent = data.content && data.content.trim().length > 0;
        const hasLink =
          data.article_link && data.article_link.trim().length > 0;

        // Set content mode based on what data exists
        if (hasLink && !hasContent) {
          setContentMode('link');
        } else {
          setContentMode('content');
        }

        setFormData({
          title: data.title,
          description: data.description || '',
          content: data.content,
          type_id: data.type_id,
          is_published: data.is_published,
          published_at:
            data.published_at || new Date().toISOString().split('T')[0],
          cover_image_url: data.cover_image_url || '',
          article_link: data.article_link || '',
        });
      } catch {
        showToast({
          title: 'Error',
          message: 'Failed to load resource',
          type: 'error',
        });
        router.push('/admin/resources');
      } finally {
        setIsLoading(false);
      }
    };

    if (resourceId) {
      fetchResource();
    }
  }, [resourceId, router]);

  const handleInputChange = (
    field: string,
    value: string | boolean | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const result = await uploadImage(file);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, cover_image_url: result.url! }));
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
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, cover_image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type_id) {
      showToast({
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    // Validate that either content or article_link is provided, but not both
    const hasContent = formData.content.trim().length > 0;
    const hasArticleLink = formData.article_link.trim().length > 0;

    if (!hasContent && !hasArticleLink) {
      showToast({
        title: 'Validation Error',
        message: 'Please provide either content or an article link',
        type: 'error',
      });
      return;
    }

    if (hasContent && hasArticleLink) {
      showToast({
        title: 'Validation Error',
        message: 'Please provide either content OR an article link, not both',
        type: 'error',
      });
      return;
    }

    setIsSaving(true);

    try {
      await resourcesApi.update(resourceId, {
        ...formData,
        // Clear the field that shouldn't be used based on content mode
        content: contentMode === 'content' ? formData.content : '',
        article_link: contentMode === 'link' ? formData.article_link : '',
        published_at: formData.published_at || null,
      });

      showToast({
        title: 'Success',
        message: 'Resource updated successfully!',
        type: 'success',
      });

      router.push('/admin/resources');
    } catch (error) {
      showToast({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to update resource',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentModeChange = (mode: 'content' | 'link') => {
    setContentMode(mode);
    // Clear the other field when switching modes
    if (mode === 'content') {
      setFormData(prev => ({ ...prev, article_link: '' }));
    } else {
      setFormData(prev => ({ ...prev, content: '' }));
    }
  };

  if (isLoading) {
    return (
      <AdminLayout
        title="Edit Resource"
        description="Loading resource..."
        currentPage="/admin/resources"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading resource...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!resource) {
    return (
      <AdminLayout
        title="Resource Not Found"
        description="The requested resource could not be found"
        currentPage="/admin/resources"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg mb-4">Resource not found</div>
            <Button onClick={() => router.push('/admin/resources')}>
              Back to Resources
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Edit Resource"
      description="Update resource information and content"
      currentPage="/admin/resources"
    >
      <div className="space-y-4">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/resources')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Update Resource'}
            </Button>
          </div>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Side - Form */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Details</CardTitle>
                <CardDescription>Update resource information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      placeholder="Enter resource title"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Enter a brief description of the resource"
                  />
                </div>

                {/* Type and Content Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type_id">Type *</Label>
                    <Select
                      value={formData.type_id.toString()}
                      onValueChange={value =>
                        handleInputChange('type_id', parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceTypes.map(type => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name.charAt(0).toUpperCase() +
                              type.name.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Content Mode</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          contentMode === 'content' ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => handleContentModeChange('content')}
                      >
                        Create Content
                      </Button>
                      <Button
                        type="button"
                        variant={contentMode === 'link' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleContentModeChange('link')}
                      >
                        Use External Link
                      </Button>
                    </div>
                  </div>
                </div>

                {contentMode === 'link' && (
                  <div className="space-y-2">
                    <Label htmlFor="article_link">External Link *</Label>
                    <Input
                      id="article_link"
                      value={formData.article_link}
                      onChange={e =>
                        handleInputChange('article_link', e.target.value)
                      }
                      placeholder="https://example.com/article"
                      type="url"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="cover_image">Cover Image</Label>
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="flex gap-2">
                      <input
                        id="cover_image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById('cover_image')?.click()
                        }
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      {formData.cover_image_url && (
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
                    {formData.cover_image_url && (
                      <div className="relative">
                        <Image
                          unoptimized
                          src={formData.cover_image_url}
                          alt="Cover preview"
                          width={400}
                          height={128}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          Cover Image
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="published_at">Publish Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="published_at"
                        value={formData.published_at}
                        onChange={e =>
                          handleInputChange('published_at', e.target.value)
                        }
                        type="date"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="is_published">Publish Status</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={checked =>
                          handleInputChange('is_published', checked)
                        }
                      />
                      <Label htmlFor="is_published" className="text-sm">
                        {formData.is_published ? 'Published' : 'Draft'}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Rich Text Editor or External Link Info */}
          <div className="space-y-4">
            {contentMode === 'link' ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-blue-600 mt-0.5">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">
                        External Link Mode
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        This resource will link to external content. Users will
                        be redirected to the provided URL when they access this
                        resource.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">
                    <strong>Note:</strong> Resources with external links will
                    redirect users to the source content rather than displaying
                    content in this CMS. You can switch to &ldquo;Create
                    Content&rdquo; mode to write content directly in the editor.
                  </div>
                </div>
              </div>
            ) : (
              <RichTextEditor
                content={formData.content}
                onContentChange={handleContentChange}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
