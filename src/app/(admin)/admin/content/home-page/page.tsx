'use client';

import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Edit, Save, Plus, Trash2, Megaphone, Images } from 'lucide-react';
import AdminLayout from '@/app/(admin)/components/AdminLayout';
import { showToast } from '@/components/ui/toast';
import {
  announcementBarApi,
  slideGalleryApi,
  AnnouncementBar,
  SlideGallery,
} from '@/lib/api';

export default function HomePageManagement() {
  const [announcementBar, setAnnouncementBar] =
    useState<AnnouncementBar | null>(null);
  const [slideGallery, setSlideGallery] = useState<SlideGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideGallery | null>(null);
  const [showSlideForm, setShowSlideForm] = useState(false);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [announcementData, slidesData] = await Promise.all([
          announcementBarApi.get(),
          slideGalleryApi.getAll(),
        ]);

        setAnnouncementBar(announcementData);
        setSlideGallery(slidesData);
      } catch (error) {
        console.error('Error loading data:', error);
        showToast({
          title: 'Error',
          message: 'Failed to load home page data',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAnnouncementBarSave = async () => {
    if (!announcementBar) return;

    setIsSaving(true);
    try {
      const updatedAnnouncement = await announcementBarApi.save({
        text: announcementBar.text,
        is_active: announcementBar.is_active,
        link: announcementBar.link,
        link_text: announcementBar.link_text,
      });

      setAnnouncementBar(updatedAnnouncement);
      showToast({
        title: 'Success',
        message: 'Announcement bar updated successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating announcement bar:', error);
      showToast({
        title: 'Error',
        message: 'Failed to update announcement bar',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSlideSave = async (
    slide: Omit<SlideGallery, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setIsSaving(true);
    try {
      let savedSlide: SlideGallery;

      if (editingSlide) {
        savedSlide = await slideGalleryApi.update(editingSlide.id, slide);
        setSlideGallery(prev =>
          prev.map(s => (s.id === savedSlide.id ? savedSlide : s))
        );
        showToast({
          title: 'Success',
          message: 'Slide updated successfully',
          type: 'success',
        });
      } else {
        savedSlide = await slideGalleryApi.create(slide);
        setSlideGallery(prev => [...prev, savedSlide]);
        showToast({
          title: 'Success',
          message: 'Slide added successfully',
          type: 'success',
        });
      }

      setEditingSlide(null);
      setShowSlideForm(false);
    } catch (error) {
      console.error('Error saving slide:', error);
      showToast({
        title: 'Error',
        message: 'Failed to save slide',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSlideDelete = async (slideId: number) => {
    try {
      await slideGalleryApi.delete(slideId);
      setSlideGallery(prev => prev.filter(s => s.id !== slideId));
      showToast({
        title: 'Success',
        message: 'Slide deleted successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting slide:', error);
      showToast({
        title: 'Error',
        message: 'Failed to delete slide',
        type: 'error',
      });
    }
  };

  const handleEditSlide = (slide: SlideGallery) => {
    setEditingSlide(slide);
    setShowSlideForm(true);
  };

  const handleAddSlide = () => {
    setEditingSlide(null);
    setShowSlideForm(true);
  };

  if (isLoading) {
    return (
      <AdminLayout
        title="Home Page Management"
        description="Manage announcement bar and slide gallery"
        currentPage="/admin/content/banner"
      >
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-48 bg-muted rounded mb-2"></div>
                  <div className="h-4 w-64 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-10 w-full bg-muted rounded"></div>
                    <div className="h-20 w-full bg-muted rounded"></div>
                    <div className="h-10 w-24 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Home Page Management"
      description="Manage announcement bar and slide gallery"
      currentPage="/admin/content/banner"
    >
      <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        {/* Announcement Bar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Announcement Bar
            </CardTitle>
            <CardDescription>
              Manage the announcement bar that appears at the top of your
              website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="announcement-active"
                checked={announcementBar?.is_active || false}
                onCheckedChange={async checked => {
                  const updatedAnnouncement = announcementBar
                    ? { ...announcementBar, is_active: checked }
                    : null;

                  setAnnouncementBar(updatedAnnouncement);

                  // Auto-save when disabling the announcement bar
                  if (!checked && updatedAnnouncement) {
                    setIsSaving(true);
                    try {
                      const savedAnnouncement = await announcementBarApi.save({
                        text: updatedAnnouncement.text,
                        is_active: updatedAnnouncement.is_active,
                        link: updatedAnnouncement.link,
                        link_text: updatedAnnouncement.link_text,
                      });
                      setAnnouncementBar(savedAnnouncement);
                      showToast({
                        title: 'Success',
                        message: 'Announcement bar disabled successfully',
                        type: 'success',
                      });
                    } catch (error) {
                      console.error('Error disabling announcement bar:', error);
                      showToast({
                        title: 'Error',
                        message: 'Failed to disable announcement bar',
                        type: 'error',
                      });
                      // Revert the state on error
                      setAnnouncementBar(announcementBar);
                    } finally {
                      setIsSaving(false);
                    }
                  }
                }}
              />
              <Label htmlFor="announcement-active">
                Enable announcement bar
              </Label>
            </div>

            {(announcementBar?.is_active || false) && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-text">Announcement Text</Label>
                  <Input
                    id="announcement-text"
                    value={announcementBar?.text || ''}
                    onChange={e =>
                      setAnnouncementBar(prev =>
                        prev ? { ...prev, text: e.target.value } : null
                      )
                    }
                    placeholder="Enter announcement text..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="announcement-link">
                      Link URL (optional)
                    </Label>
                    <Input
                      id="announcement-link"
                      value={announcementBar?.link || ''}
                      onChange={e =>
                        setAnnouncementBar(prev =>
                          prev ? { ...prev, link: e.target.value } : null
                        )
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcement-link-text">
                      Link Text (optional)
                    </Label>
                    <Input
                      id="announcement-link-text"
                      value={announcementBar?.link_text || ''}
                      onChange={e =>
                        setAnnouncementBar(prev =>
                          prev ? { ...prev, link_text: e.target.value } : null
                        )
                      }
                      placeholder="Learn More"
                    />
                  </div>
                </div>

                <Button onClick={handleAnnouncementBarSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Announcement Bar'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slide Gallery Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Images className="w-5 h-5" />
              Slide Gallery
            </CardTitle>
            <CardDescription>
              Manage the slides in your homepage gallery. Only text content can
              be edited.
            </CardDescription>
            <div className="flex justify-end">
              <Button onClick={handleAddSlide}>
                <Plus className="w-4 h-4 mr-2" />
                Add Slide
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {slideGallery.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No slides found. Add your first slide to get started.
                </div>
              ) : (
                slideGallery
                  .sort((a, b) => a.display_order - b.display_order)
                  .map(slide => (
                    <div
                      key={slide.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Slide {slide.display_order}
                          </span>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={slide.is_active}
                              onCheckedChange={checked =>
                                setSlideGallery(prev =>
                                  prev.map(s =>
                                    s.id === slide.id
                                      ? { ...s, is_active: checked }
                                      : s
                                  )
                                )
                              }
                            />
                            <span className="text-sm">
                              {slide.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSlide(slide)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSlideDelete(slide.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">{slide.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {slide.subtitle}
                        </p>
                        <p className="text-sm">{slide.description}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Button: {slide.button_text}</span>
                          <span>Link: {slide.button_link}</span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Slide Form Modal */}
        {showSlideForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>
                  {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                </CardTitle>
                <CardDescription>
                  Configure the slide content and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SlideForm
                  slide={editingSlide}
                  onSave={handleSlideSave}
                  onCancel={() => {
                    setShowSlideForm(false);
                    setEditingSlide(null);
                  }}
                  isSaving={isSaving}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Slide Form Component
function SlideForm({
  slide,
  onSave,
  onCancel,
  isSaving,
}: {
  slide: SlideGallery | null;
  onSave: (
    slide: Omit<SlideGallery, 'id' | 'created_at' | 'updated_at'>
  ) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState<
    Omit<SlideGallery, 'id' | 'created_at' | 'updated_at'>
  >({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    description: slide?.description || '',
    button_text: slide?.button_text || '',
    button_link: slide?.button_link || '',
    is_active: slide?.is_active ?? true,
    display_order: slide?.display_order || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slide-title">Title *</Label>
          <Input
            id="slide-title"
            value={formData.title}
            onChange={e =>
              setFormData(prev => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slide-subtitle">Subtitle</Label>
          <Input
            id="slide-subtitle"
            value={formData.subtitle || ''}
            onChange={e =>
              setFormData(prev => ({ ...prev, subtitle: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slide-description">Description</Label>
        <Textarea
          id="slide-description"
          value={formData.description || ''}
          onChange={e =>
            setFormData(prev => ({ ...prev, description: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slide-button-text">Button Text</Label>
          <Input
            id="slide-button-text"
            value={formData.button_text || ''}
            onChange={e =>
              setFormData(prev => ({ ...prev, button_text: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slide-button-link">Button Link</Label>
          <Input
            id="slide-button-link"
            value={formData.button_link || ''}
            onChange={e =>
              setFormData(prev => ({ ...prev, button_link: e.target.value }))
            }
            placeholder="/contact"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slide-order">Display Order</Label>
          <Input
            id="slide-order"
            type="number"
            value={formData.display_order}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                display_order: parseInt(e.target.value) || 1,
              }))
            }
            min="1"
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="slide-active"
            checked={formData.is_active}
            onCheckedChange={checked =>
              setFormData(prev => ({ ...prev, is_active: checked }))
            }
          />
          <Label htmlFor="slide-active">Active</Label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Slide'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
