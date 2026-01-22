'use client';

import { useState, useEffect } from 'react';
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
import { FeaturedEventVideo, featuredVideoApi } from '@/lib/api';
import { showToast } from '@/components/ui/toast';
import { Play, X, ExternalLink } from 'lucide-react';

interface FeaturedVideoFormProps {
  isOpen: boolean;
  onClose: () => void;
  featuredVideo: FeaturedEventVideo | null;
  onSuccess: () => void;
}

export default function FeaturedVideoForm({
  isOpen,
  onClose,
  featuredVideo,
  onSuccess,
}: FeaturedVideoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (featuredVideo) {
      setVideoUrl(featuredVideo.video_url);
    } else {
      setVideoUrl('');
    }
  }, [featuredVideo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (featuredVideo) {
        // Update existing featured video
        await featuredVideoApi.update(videoUrl);
        showToast({
          title: 'Featured Video Updated',
          message: 'The featured video has been updated successfully.',
          type: 'success',
        });
      } else {
        // Create new featured video
        await featuredVideoApi.set(videoUrl);
        showToast({
          title: 'Featured Video Set',
          message: 'The featured video has been set successfully.',
          type: 'success',
        });
      }

      onSuccess();
      onClose();
    } catch {
      showToast({
        title: 'Error',
        message: 'Failed to save featured video. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!featuredVideo) return;

    setIsLoading(true);
    try {
      await featuredVideoApi.remove();
      showToast({
        title: 'Featured Video Removed',
        message: 'The featured video has been removed successfully.',
        type: 'success',
      });
      onSuccess();
      onClose();
    } catch {
      showToast({
        title: 'Error',
        message: 'Failed to remove featured video. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {featuredVideo ? 'Edit Featured Video' : 'Set Featured Video'}
          </DialogTitle>
          <DialogDescription>
            {featuredVideo
              ? 'Update the featured video that displays on the events page.'
              : 'Set a featured video that will display on the events page.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video_url">YouTube Video URL *</Label>
            <div className="flex gap-2">
              <Input
                id="video_url"
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1"
                required
              />
              {videoUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setVideoUrl('')}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a YouTube video URL. This video will be displayed as the
              featured video on the events page.
            </p>
          </div>

          {/* Video Preview */}
          {embedUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                <iframe
                  src={embedUrl}
                  title="Featured Video Preview"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Play className="h-4 w-4" />
                <span>Video preview</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  asChild
                  className="ml-auto"
                >
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open in YouTube
                  </a>
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div>
              {featuredVideo && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRemove}
                  disabled={isLoading}
                >
                  Remove Featured Video
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !videoUrl.trim()}>
                {isLoading
                  ? 'Saving...'
                  : featuredVideo
                    ? 'Update Featured Video'
                    : 'Set Featured Video'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
