'use client';

import { Event } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  MapPin,
  ExternalLink,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';

interface ViewEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export default function ViewEventDialog({
  isOpen,
  onClose,
  event,
}: ViewEventDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>
            View event details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                Event Date
              </h4>
              <p className="text-base">
                {new Date(event.event_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  Location
                </h4>
                <p className="text-base">{event.location}</p>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  Description
                </h4>
                <p className="text-base leading-relaxed">{event.description}</p>
              </div>
            </div>
          )}

          {/* Event Image */}
          {event.image_url && (
            <div className="flex items-start gap-3">
              <ImageIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  Event Image
                </h4>
                <div className="mt-2">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="rounded-md border max-w-full h-auto"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Event Link */}
          {event.link && (
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">
                  Event Link
                </h4>
                <Button variant="outline" size="sm" asChild className="mt-1">
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Event Page
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(event.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(event.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
