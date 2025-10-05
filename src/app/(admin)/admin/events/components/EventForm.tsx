'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Event, eventsApi } from '@/lib/api';
import { showToast } from '@/components/ui/toast';
import { uploadImage } from '@/lib/storage';
import { Upload, X, Play } from 'lucide-react';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  onSuccess: () => void;
}

export default function EventForm({
  isOpen,
  onClose,
  event,
  onSuccess,
}: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    location: '',
    description: '',
    link: '',
    video: '',
    image_url: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [mediaMode, setMediaMode] = useState<'image' | 'video'>('image');

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        event_date: event.event_date,
        location: event.location || '',
        description: event.description || '',
        link: event.link || '',
        video: event.video || '',
        image_url: event.image_url || '',
      });
      // Set media mode based on existing data
      if (event.video && event.video.trim()) {
        setMediaMode('video');
      } else if (event.image_url && event.image_url.trim()) {
        setMediaMode('image');
      } else {
        setMediaMode('image'); // Default to image
      }
    } else {
      setFormData({
        title: '',
        event_date: '',
        description: '',
        location: '',
        link: '',
        video: '',
        image_url: '',
      });
      setMediaMode('image'); // Default to image for new events
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (event) {
        // Update existing event
        await eventsApi.update(event.id, {
          ...formData,
          updated_at: new Date().toISOString(),
        });
        showToast({
          title: 'Event Updated',
          message: 'The event has been updated successfully.',
          type: 'success',
        });
      } else {
        // Create new event
        await eventsApi.create({
          ...formData,
        });
        showToast({
          title: 'Event Created',
          message: 'The new event has been created successfully.',
          type: 'success',
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      showToast({
        title: 'Error',
        message: 'Failed to save event. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // If video URL is being set, clear the image
      if (field === 'video' && value.trim()) {
        newData.image_url = '';
      }

      return newData;
    });
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
        setFormData(prev => ({
          ...prev,
          image_url: result.url!,
          video: '', // Remove video when image is added
        }));
        showToast({
          title: 'Success',
          message: 'Image uploaded successfully! Video field has been cleared.',
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
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleVideoChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      video: value,
      image_url: value.trim() ? '' : prev.image_url, // Clear image if video is being set
    }));
  };

  const handleMediaModeChange = (mode: 'image' | 'video') => {
    setMediaMode(mode);
    // Clear the other field when switching modes
    if (mode === 'image') {
      setFormData(prev => ({ ...prev, video: '' }));
    } else {
      setFormData(prev => ({ ...prev, image_url: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          <DialogDescription>
            {event
              ? 'Update the event details below.'
              : 'Fill in the details for the new event.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_date">Event Date *</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={e => handleInputChange('event_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
              placeholder="Enter event location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Enter event description"
              rows={4}
            />
          </div>

          {/* Media Type Toggle */}
          <div className="space-y-2">
            <Label>Media Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={mediaMode === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMediaModeChange('image')}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Image
              </Button>
              <Button
                type="button"
                variant={mediaMode === 'video' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMediaModeChange('video')}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Video
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose whether to add an image or video. Only one media type is
              allowed per event.
            </p>
          </div>

          {/* Image Upload Section */}
          {mediaMode === 'image' && (
            <div className="space-y-2">
              <Label htmlFor="image_url">Event Image</Label>
              <div className="space-y-3">
                {/* File Upload */}
                <div className="flex gap-2">
                  <input
                    id="image_url"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById('image_url')?.click()
                    }
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  {formData.image_url && (
                    <Button
                      type="button"
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
                      alt="Event preview"
                      width={400}
                      height={128}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Event Image
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Images only display for featured events.
              </p>
            </div>
          )}

          {/* Video URL Section */}
          {mediaMode === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="video">Video URL</Label>
              <div className="flex gap-2">
                <Input
                  id="video"
                  type="url"
                  value={formData.video}
                  onChange={e => handleVideoChange(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1"
                />
                {formData.video && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleVideoChange('')}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Videos only display for featured events.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="link">Event Link</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={e => handleInputChange('link', e.target.value)}
              placeholder="https://example.com/event"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : event
                  ? 'Update Event'
                  : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
