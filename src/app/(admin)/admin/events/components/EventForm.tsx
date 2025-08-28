'use client';

import { useState, useEffect } from 'react';
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
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        event_date: event.event_date,
        location: event.location || '',
        description: event.description || '',
        link: event.link || '',
      });
    } else {
      setFormData({
        title: '',
        event_date: '',
        location: '',
        description: '',
        link: '',
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
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
