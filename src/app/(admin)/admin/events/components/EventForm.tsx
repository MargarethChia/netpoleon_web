'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Upload, X } from 'lucide-react';

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
    link: '',
    image_url: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        event_date: event.event_date,
        location: event.location || '',
        link: event.link || '',
        image_url: event.image_url || '',
      });
    } else {
      setFormData({
        title: '',
        event_date: '',
        location: '',
        link: '',
        image_url: '',
      });
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
          description: null, // Always keep description blank
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
          description: null, // Always keep description blank
        });
        showToast({
          title: 'Event Created',
          message: 'The new event has been created successfully.',
          type: 'success',
        });
      }

      onSuccess();
      onClose();
    } catch {
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

      // If image URL is being set, clear any existing video
      if (field === 'image_url' && value.trim()) {
        // No video field to clear anymore
      }

      return newData;
    });
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const result = await uploadImage(file);

      if (result.success && result.url) {
        setFormData(prev => ({
          ...prev,
          image_url: result.url!,
        }));
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
    setFormData(prev => ({ ...prev, image_url: '' }));
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

          {/* Image Upload Section */}
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
                  onClick={() => document.getElementById('image_url')?.click()}
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
                    unoptimized
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
