'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

import { Calendar, Upload, Save, Send, ArrowLeft, X } from 'lucide-react';
import { resourcesApi } from '@/lib/api';
import { showToast } from '@/components/ui/toast';
import AdminLayout from '@/app/(admin)/components/AdminLayout';
import { uploadImage } from '@/lib/storage';
import RichTextEditor from '@/components/ui/rich-text-editor';

export default function CreateResourcePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'article' as 'article' | 'blog',
    is_published: false,
    published_at: new Date().toISOString().split('T')[0], // Default to today's date
    cover_image_url: '',
    article_link: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File) => {
    console.log('handleFileUpload called with file:', file);
    setIsUploading(true);

    try {
      console.log('Calling uploadImage...');
      const result = await uploadImage(file);
      console.log('uploadImage result:', result);

      if (result.success && result.url) {
        console.log('Upload successful, setting URL:', result.url);
        setFormData(prev => ({ ...prev, cover_image_url: result.url! }));
        showToast({
          title: 'Success',
          message: 'Image uploaded successfully!',
          type: 'success',
        });
      } else {
        console.log('Upload failed:', result.error);
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

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type) {
      showToast({
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    // Content is only required for blog posts, not for articles
    if (formData.type === 'blog' && !formData.content) {
      showToast({
        title: 'Validation Error',
        message: 'Content is required for blog posts',
        type: 'error',
      });
      return;
    }

    // Article link is required for articles
    if (formData.type === 'article' && !formData.article_link) {
      showToast({
        title: 'Validation Error',
        message: 'Article link is required for articles',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      await resourcesApi.create({
        ...formData,
        content: formData.type === 'article' ? '' : formData.content, // Empty content for articles
        published_at: formData.published_at || null,
      });

      showToast({
        title: 'Success',
        message: 'Resource created successfully!',
        type: 'success',
      });

      router.push('/admin/resources');
    } catch (error) {
      console.error('Error creating resource:', error);
      showToast({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to create resource',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title || !formData.content || !formData.type) {
      showToast({
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      await resourcesApi.create({
        ...formData,
        is_published: false,
        published_at: null,
      });

      showToast({
        title: 'Success',
        message: 'Draft saved successfully!',
        type: 'success',
      });

      router.push('/admin/resources');
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to save draft',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Create New Resource"
      description="Create a new article or blog post with live preview"
      currentPage="/admin/resources/create"
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
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Creating...' : 'Publish Resource'}
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
                <CardDescription>
                  Basic information about your resource
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      placeholder="Enter resource title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={value => handleInputChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="blog">Blog Post</SelectItem>
                      </SelectContent>
                    </Select>
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

                {formData.type === 'article' && (
                  <div className="space-y-2">
                    <Label htmlFor="article_link">Article Link</Label>
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

          {/* Right Side - Rich Text Editor */}
          <div className="space-y-4">
            {formData.type === 'article' ? (
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
                        Article Content
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        For articles, the content is managed externally via the
                        article link. The rich text editor is disabled for
                        article type resources.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">
                    <strong>Note:</strong> Articles with external links will
                    redirect users to the source content rather than displaying
                    content in this CMS.
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
