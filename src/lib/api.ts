// Client-side API wrapper functions
// These functions provide a clean interface for calling our API routes

// Types for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Events API
export const eventsApi = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch events');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get single event
  getById: async (id: number): Promise<Event> => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch event');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  // Create new event
  create: async (
    eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Event> => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event
  update: async (id: number, eventData: Partial<Event>): Promise<Event> => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update event');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Get featured events
  getFeatured: async (): Promise<FeaturedEvent[]> => {
    try {
      const response = await fetch('/api/events/featured');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch featured events');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured events:', error);
      throw error;
    }
  },

  // Add featured event
  addFeatured: async (eventId: number): Promise<FeaturedEvent> => {
    try {
      const response = await fetch('/api/events/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: eventId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add featured event');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding featured event:', error);
      throw error;
    }
  },

  // Remove featured event
  removeFeatured: async (eventId: number): Promise<void> => {
    try {
      const response = await fetch('/api/events/featured', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: eventId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove featured event');
      }
    } catch (error) {
      console.error('Error removing featured event:', error);
      throw error;
    }
  },
};

// Resources API
export const resourcesApi = {
  // Get all resources
  getAll: async (): Promise<Resource[]> => {
    try {
      const response = await fetch('/api/resources');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch resources');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Get single resource
  getById: async (id: number): Promise<Resource> => {
    try {
      const response = await fetch(`/api/resources/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch resource');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  // Create new resource
  create: async (
    resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Resource> => {
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create resource');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  },

  // Update resource
  update: async (
    id: number,
    resourceData: Partial<Resource>
  ): Promise<Resource> => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update resource');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  // Delete resource
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete resource');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  // Get featured resources
  getFeatured: async (): Promise<FeaturedResource[]> => {
    try {
      const response = await fetch('/api/resources/featured');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch featured resources');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured resources:', error);
      throw error;
    }
  },

  // Add featured resource
  addFeatured: async (resourceId: number): Promise<FeaturedResource> => {
    try {
      const response = await fetch('/api/resources/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resource_id: resourceId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add featured resource');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding featured resource:', error);
      throw error;
    }
  },

  // Remove featured resource
  removeFeatured: async (resourceId: number): Promise<void> => {
    try {
      const response = await fetch('/api/resources/featured', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resource_id: resourceId }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove featured resource');
      }
    } catch (error) {
      console.error('Error removing featured resource:', error);
      throw error;
    }
  },
};

// Vendors API
export const vendorsApi = {
  // Get all vendors
  getAll: async (): Promise<Vendor[]> => {
    try {
      const response = await fetch('/api/vendors');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch vendors');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  // Get single vendor
  getById: async (id: number): Promise<Vendor> => {
    try {
      const response = await fetch(`/api/vendors/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch vendor');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  },

  // Create new vendor
  create: async (
    vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Vendor> => {
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create vendor');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  },

  // Update vendor
  update: async (id: number, vendorData: Partial<Vendor>): Promise<Vendor> => {
    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update vendor');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw error;
    }
  },

  // Delete vendor
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete vendor');
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw error;
    }
  },
};

// Team Members API
export const teamMembersApi = {
  // Get all team members
  getAll: async (): Promise<TeamMember[]> => {
    try {
      const response = await fetch('/api/team-members');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch team members');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  // Get single team member
  getById: async (id: number): Promise<TeamMember> => {
    try {
      const response = await fetch(`/api/team-members/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch team member');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching team member:', error);
      throw error;
    }
  },

  // Create new team member
  create: async (
    teamMemberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TeamMember> => {
    try {
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamMemberData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create team member');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  // Update team member
  update: async (
    id: number,
    teamMemberData: Partial<TeamMember>
  ): Promise<TeamMember> => {
    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamMemberData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update team member');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  // Delete team member
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },
};

// Announcement Bar API
export const announcementBarApi = {
  // Get announcement bar
  get: async (): Promise<AnnouncementBar> => {
    try {
      const response = await fetch('/api/announcement-bar');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch announcement bar');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching announcement bar:', error);
      throw error;
    }
  },

  // Create or update announcement bar
  save: async (
    announcementData: Omit<AnnouncementBar, 'id' | 'created_at' | 'updated_at'>
  ): Promise<AnnouncementBar> => {
    try {
      const response = await fetch('/api/announcement-bar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcementData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save announcement bar');
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving announcement bar:', error);
      throw error;
    }
  },
};

// Slide Gallery API
export const slideGalleryApi = {
  // Get all slides
  getAll: async (): Promise<SlideGallery[]> => {
    try {
      const response = await fetch('/api/slide-gallery');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch slides');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching slides:', error);
      throw error;
    }
  },

  // Get single slide
  getById: async (id: number): Promise<SlideGallery> => {
    try {
      const response = await fetch(`/api/slide-gallery/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch slide');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching slide:', error);
      throw error;
    }
  },

  // Create new slide
  create: async (
    slideData: Omit<SlideGallery, 'id' | 'created_at' | 'updated_at'>
  ): Promise<SlideGallery> => {
    try {
      const response = await fetch('/api/slide-gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create slide');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating slide:', error);
      throw error;
    }
  },

  // Update slide
  update: async (
    id: number,
    slideData: Partial<SlideGallery>
  ): Promise<SlideGallery> => {
    try {
      const response = await fetch(`/api/slide-gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update slide');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating slide:', error);
      throw error;
    }
  },

  // Delete slide
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/api/slide-gallery/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete slide');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      throw error;
    }
  },
};

// Import types from supabase
import type {
  Event,
  Resource,
  Vendor,
  FeaturedResource,
  FeaturedEvent,
  TeamMember,
  AnnouncementBar,
  SlideGallery,
} from './supabase';

// Re-export types for use in components
export type {
  Event,
  Resource,
  Vendor,
  FeaturedResource,
  FeaturedEvent,
  TeamMember,
  AnnouncementBar,
  SlideGallery,
};
