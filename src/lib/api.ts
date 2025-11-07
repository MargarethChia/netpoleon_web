// Client-side API wrapper functions
// These functions provide a clean interface for calling Supabase directly

import { supabaseClient } from './supabase-client';
import type {
  Event,
  Resource,
  Vendor,
  FeaturedResource,
  FeaturedEvent,
  FeaturedEventVideo,
  TeamMember,
  AnnouncementBar,
  SlideGallery,
  ResourceType,
} from './supabase';

// Types for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Events API - Now using Supabase directly
export const eventsApi = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        throw new Error(error.message || 'Failed to fetch events');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get single event
  getById: async (id: number): Promise<Event> => {
    try {
      const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to fetch event');
      }

      if (!data) {
        throw new Error('Event not found');
      }

      return data;
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
      const { data, error } = await supabaseClient
        .from('events')
        .insert([
          {
            ...eventData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to create event');
      }

      if (!data) {
        throw new Error('Failed to create event');
      }

      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event
  update: async (id: number, eventData: Partial<Event>): Promise<Event> => {
    try {
      const { data, error } = await supabaseClient
        .from('events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update event');
      }

      if (!data) {
        throw new Error('Event not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event
  delete: async (id: number): Promise<void> => {
    try {
      const { error } = await supabaseClient
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Get featured events
  getFeatured: async (): Promise<FeaturedEvent[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('featured_event')
        .select('*, events(*)')
        .order('display_order', { ascending: true })
        .order('featured_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to fetch featured events');
      }

      // Transform the data to match the FeaturedEvent interface
      return (data || []).map(
        (item: {
          id: number;
          event_id: number;
          featured_at: string;
          display_order: number;
          events?: Event | null;
        }) => ({
          id: item.id,
          event_id: item.event_id,
          featured_at: item.featured_at,
          display_order: item.display_order,
          events: item.events || undefined,
        })
      );
    } catch (error) {
      console.error('Error fetching featured events:', error);
      throw error;
    }
  },

  // Add featured event
  addFeatured: async (eventId: number): Promise<FeaturedEvent> => {
    try {
      // Get the current max display_order
      const { data: existing } = await supabaseClient
        .from('featured_event')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .single();

      const displayOrder =
        existing?.display_order !== undefined ? existing.display_order + 1 : 0;

      const { data, error } = await supabaseClient
        .from('featured_event')
        .insert([
          {
            event_id: eventId,
            display_order: displayOrder,
            featured_at: new Date().toISOString(),
          },
        ])
        .select('*, events(*)')
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to add featured event');
      }

      if (!data) {
        throw new Error('Failed to add featured event');
      }

      return {
        id: data.id,
        event_id: data.event_id,
        featured_at: data.featured_at,
        display_order: data.display_order,
        events: data.events,
      };
    } catch (error) {
      console.error('Error adding featured event:', error);
      throw error;
    }
  },

  // Remove featured event
  removeFeatured: async (eventId: number): Promise<void> => {
    try {
      const { error } = await supabaseClient
        .from('featured_event')
        .delete()
        .eq('event_id', eventId);

      if (error) {
        throw new Error(error.message || 'Failed to remove featured event');
      }
    } catch (error) {
      console.error('Error removing featured event:', error);
      throw error;
    }
  },
};

// Featured Event Video API - Now using Supabase directly
export const featuredVideoApi = {
  // Get featured event video
  get: async (): Promise<FeaturedEventVideo | null> => {
    try {
      const { data, error } = await supabaseClient
        .from('featured_event_video')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(
          error.message || 'Failed to fetch featured event video'
        );
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching featured event video:', error);
      throw error;
    }
  },

  // Set featured event video (deletes existing and creates new)
  set: async (videoUrl: string): Promise<FeaturedEventVideo> => {
    try {
      // Delete existing featured video
      await supabaseClient.from('featured_event_video').delete().neq('id', 0); // Delete all records

      // Insert new featured video
      const { data, error } = await supabaseClient
        .from('featured_event_video')
        .insert([
          {
            video_url: videoUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to set featured event video');
      }

      if (!data) {
        throw new Error('Failed to set featured event video');
      }

      return data;
    } catch (error) {
      console.error('Error setting featured event video:', error);
      throw error;
    }
  },

  // Update featured event video
  update: async (videoUrl: string): Promise<FeaturedEventVideo> => {
    try {
      // Get existing video
      const { data: existing } = await supabaseClient
        .from('featured_event_video')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!existing) {
        // If no existing video, create one
        return await featuredVideoApi.set(videoUrl);
      }

      // Update existing video
      const { data, error } = await supabaseClient
        .from('featured_event_video')
        .update({
          video_url: videoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        throw new Error(
          error.message || 'Failed to update featured event video'
        );
      }

      if (!data) {
        throw new Error('Failed to update featured event video');
      }

      return data;
    } catch (error) {
      console.error('Error updating featured event video:', error);
      throw error;
    }
  },

  // Remove featured event video
  remove: async (): Promise<void> => {
    try {
      const { error } = await supabaseClient
        .from('featured_event_video')
        .delete()
        .neq('id', 0); // Delete all records

      if (error) {
        throw new Error(
          error.message || 'Failed to remove featured event video'
        );
      }
    } catch (error) {
      console.error('Error removing featured event video:', error);
      throw error;
    }
  },
};

// Resources API - Now using Supabase directly
export const resourcesApi = {
  // Get all resources
  getAll: async (): Promise<Resource[]> => {
    try {
      // Fetch resources
      const { data: resources, error: resourcesError } = await supabaseClient
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (resourcesError) {
        throw new Error(resourcesError.message || 'Failed to fetch resources');
      }

      // Fetch all resource types separately
      const { data: resourceTypes, error: typesError } = await supabaseClient
        .from('resource_type')
        .select('id, name');

      if (typesError) {
        console.error('Error fetching resource types:', typesError);
        // Continue without types rather than failing
      }

      // Create a map of type_id -> type object
      const typeMap = new Map(
        (resourceTypes || []).map(type => [type.id, type])
      );

      // Transform data to include type name for backwards compatibility
      return (resources || []).map(
        (resource: {
          id: number;
          title: string;
          description: string | null;
          content: string;
          type_id: number;
          published_at: string | null;
          is_published: boolean;
          cover_image_url: string | null;
          article_link: string | null;
          created_at: string;
          updated_at: string;
        }) => {
          const resourceType = typeMap.get(resource.type_id);
          return {
            ...resource,
            type: resourceType?.name || null, // Add type name for display
            resource_type: resourceType || undefined,
          };
        }
      );
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  // Get single resource
  getById: async (id: number): Promise<Resource> => {
    try {
      // Fetch resource
      const { data: resource, error: resourceError } = await supabaseClient
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

      if (resourceError) {
        throw new Error(resourceError.message || 'Failed to fetch resource');
      }

      if (!resource) {
        throw new Error('Resource not found');
      }

      // Fetch resource type if type_id exists
      let resourceType = undefined;
      if (resource.type_id) {
        const { data: typeData } = await supabaseClient
          .from('resource_type')
          .select('id, name')
          .eq('id', resource.type_id)
          .single();

        resourceType = typeData || undefined;
      }

      return {
        ...resource,
        type: resourceType?.name || null,
        resource_type: resourceType || undefined,
      };
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
      const { data, error } = await supabaseClient
        .from('resources')
        .insert([
          {
            ...resourceData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to create resource');
      }

      if (!data) {
        throw new Error('Failed to create resource');
      }

      // Fetch resource type if type_id exists
      let resourceType = undefined;
      if (data.type_id) {
        const { data: typeData } = await supabaseClient
          .from('resource_type')
          .select('id, name')
          .eq('id', data.type_id)
          .single();

        resourceType = typeData || undefined;
      }

      return {
        ...data,
        type: resourceType?.name || null,
        resource_type: resourceType || undefined,
      };
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
      const { data, error } = await supabaseClient
        .from('resources')
        .update({
          ...resourceData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update resource');
      }

      if (!data) {
        throw new Error('Resource not found');
      }

      // Fetch resource type if type_id exists
      let resourceType = undefined;
      if (data.type_id) {
        const { data: typeData } = await supabaseClient
          .from('resource_type')
          .select('id, name')
          .eq('id', data.type_id)
          .single();

        resourceType = typeData || undefined;
      }

      return {
        ...data,
        type: resourceType?.name || null,
        resource_type: resourceType || undefined,
      };
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  // Delete resource
  delete: async (id: number): Promise<void> => {
    try {
      const { error } = await supabaseClient
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete resource');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  // Get featured resources
  getFeatured: async (): Promise<FeaturedResource[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('featured_resource')
        .select('*')
        .order('featured_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to fetch featured resources');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching featured resources:', error);
      throw error;
    }
  },

  // Add featured resource
  addFeatured: async (resourceId: number): Promise<FeaturedResource> => {
    try {
      const { data, error } = await supabaseClient
        .from('featured_resource')
        .insert([
          {
            resource_id: resourceId,
            featured_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to add featured resource');
      }

      if (!data) {
        throw new Error('Failed to add featured resource');
      }

      return data;
    } catch (error) {
      console.error('Error adding featured resource:', error);
      throw error;
    }
  },

  // Remove featured resource
  removeFeatured: async (resourceId: number): Promise<void> => {
    try {
      const { error } = await supabaseClient
        .from('featured_resource')
        .delete()
        .eq('resource_id', resourceId);

      if (error) {
        throw new Error(error.message || 'Failed to remove featured resource');
      }
    } catch (error) {
      console.error('Error removing featured resource:', error);
      throw error;
    }
  },
};

// Vendors API - Now using Supabase directly
export const vendorsApi = {
  // Get all vendors
  getAll: async (): Promise<Vendor[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('vendors')
        .select(
          'id, name, logo_url, description, image_url, link, content, type, diagram_url, created_at, updated_at'
        )
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to fetch vendors');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  // Get single vendor
  getById: async (id: number): Promise<Vendor> => {
    try {
      const { data, error } = await supabaseClient
        .from('vendors')
        .select(
          'id, name, logo_url, description, image_url, link, content, type, diagram_url, created_at, updated_at'
        )
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to fetch vendor');
      }

      if (!data) {
        throw new Error('Vendor not found');
      }

      return data;
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
      // Filter out any invalid fields (like 'types' which doesn't exist in schema)
      // Only include valid Vendor fields
      const insertData: {
        name: string;
        logo_url: string | null;
        description: string | null;
        image_url: string | null;
        link: string | null;
        content: string | null;
        type: string | null;
        diagram_url: string | null;
        created_at: string;
        updated_at: string;
      } = {
        name: vendorData.name,
        logo_url: vendorData.logo_url || null,
        description: vendorData.description || null,
        image_url: vendorData.image_url || null,
        link: vendorData.link || null,
        content: vendorData.content || null,
        type: vendorData.type || null,
        diagram_url: vendorData.diagram_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseClient
        .from('vendors')
        .insert([insertData])
        .select(
          'id, name, logo_url, description, image_url, link, content, type, diagram_url, created_at, updated_at'
        )
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to create vendor');
      }

      if (!data) {
        throw new Error('Failed to create vendor');
      }

      return data;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  },

  // Update vendor
  update: async (id: number, vendorData: Partial<Vendor>): Promise<Vendor> => {
    try {
      // Only include valid Vendor fields, explicitly exclude 'types' if present
      const updateData: Partial<{
        name: string;
        logo_url: string | null;
        description: string | null;
        image_url: string | null;
        link: string | null;
        content: string | null;
        type: string | null;
        diagram_url: string | null;
        updated_at: string;
      }> = {
        updated_at: new Date().toISOString(),
      };

      if (vendorData.name !== undefined) updateData.name = vendorData.name;
      if (vendorData.logo_url !== undefined)
        updateData.logo_url = vendorData.logo_url;
      if (vendorData.description !== undefined)
        updateData.description = vendorData.description;
      if (vendorData.image_url !== undefined)
        updateData.image_url = vendorData.image_url;
      if (vendorData.link !== undefined) updateData.link = vendorData.link;
      if (vendorData.content !== undefined)
        updateData.content = vendorData.content;
      if (vendorData.type !== undefined) updateData.type = vendorData.type;
      if (vendorData.diagram_url !== undefined)
        updateData.diagram_url = vendorData.diagram_url;

      const { data, error } = await supabaseClient
        .from('vendors')
        .update(updateData)
        .eq('id', id)
        .select(
          'id, name, logo_url, description, image_url, link, content, type, diagram_url, created_at, updated_at'
        )
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update vendor');
      }

      if (!data) {
        throw new Error('Vendor not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw error;
    }
  },

  // Delete vendor
  delete: async (id: number): Promise<void> => {
    try {
      const { error } = await supabaseClient
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete vendor');
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw error;
    }
  },
};

// Team Members API - Now using Supabase directly
export const teamMembersApi = {
  // Get all team members
  getAll: async (): Promise<TeamMember[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to fetch team members');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  // Get single team member
  getById: async (id: number): Promise<TeamMember> => {
    try {
      const { data, error } = await supabaseClient
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to fetch team member');
      }

      if (!data) {
        throw new Error('Team member not found');
      }

      return data;
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
      const { data, error } = await supabaseClient
        .from('team_members')
        .insert([
          {
            ...teamMemberData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to create team member');
      }

      if (!data) {
        throw new Error('Failed to create team member');
      }

      return data;
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
      const { data, error } = await supabaseClient
        .from('team_members')
        .update({
          ...teamMemberData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update team member');
      }

      if (!data) {
        throw new Error('Team member not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  // Delete team member
  delete: async (id: number): Promise<void> => {
    try {
      const { error } = await supabaseClient
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },
};

// Announcement Bar API - Now using Supabase directly
export const announcementBarApi = {
  // Get announcement bar
  get: async (): Promise<AnnouncementBar> => {
    try {
      const { data, error } = await supabaseClient
        .from('announcement_bar')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message || 'Failed to fetch announcement bar');
      }

      if (!data) {
        throw new Error('Announcement bar not found');
      }

      return data;
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
      // Check if announcement bar exists
      const { data: existing } = await supabaseClient
        .from('announcement_bar')
        .select('id')
        .limit(1)
        .single();

      let data, error;

      if (existing) {
        // Update existing
        const result = await supabaseClient
          .from('announcement_bar')
          .update({
            ...announcementData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Create new
        const result = await supabaseClient
          .from('announcement_bar')
          .insert([
            {
              ...announcementData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) {
        throw new Error(error.message || 'Failed to save announcement bar');
      }

      if (!data) {
        throw new Error('Failed to save announcement bar');
      }

      return data;
    } catch (error) {
      console.error('Error saving announcement bar:', error);
      throw error;
    }
  },
};

// Public Announcement Bar API (for frontend use) - Now using Supabase directly
export const publicAnnouncementBarApi = {
  // Get active announcement bar (public endpoint)
  get: async (): Promise<{
    text: string;
    link: string | null;
    link_text: string | null;
  } | null> => {
    try {
      const { data, error } = await supabaseClient
        .from('announcement_bar')
        .select('text, link, link_text')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message || 'Failed to fetch announcement bar');
      }

      if (!data) {
        return null;
      }

      return {
        text: data.text,
        link: data.link,
        link_text: data.link_text,
      };
    } catch (error) {
      console.error('Error fetching announcement bar:', error);
      throw error;
    }
  },
};

// Slide Gallery API - Now using Supabase directly
export const slideGalleryApi = {
  // Get all slides
  getAll: async (): Promise<SlideGallery[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('slide_gallery')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to fetch slides');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching slides:', error);
      throw error;
    }
  },

  // Get single slide
  getById: async (id: number): Promise<SlideGallery> => {
    try {
      const { data, error } = await supabaseClient
        .from('slide_gallery')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to fetch slide');
      }

      if (!data) {
        throw new Error('Slide not found');
      }

      return data;
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
      const { data, error } = await supabaseClient
        .from('slide_gallery')
        .insert([
          {
            ...slideData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to create slide');
      }

      if (!data) {
        throw new Error('Failed to create slide');
      }

      return data;
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
      const { data, error } = await supabaseClient
        .from('slide_gallery')
        .update({
          ...slideData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update slide');
      }

      if (!data) {
        throw new Error('Slide not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating slide:', error);
      throw error;
    }
  },

  // Delete slide
  delete: async (id: number): Promise<void> => {
    try {
      const { error } = await supabaseClient
        .from('slide_gallery')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete slide');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      throw error;
    }
  },
};

// Resource Type API - Now using Supabase directly
export const resourceTypeApi = {
  // Get all resource types
  getAll: async (): Promise<ResourceType[]> => {
    try {
      const { data, error } = await supabaseClient
        .from('resource_type')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(error.message || 'Failed to fetch resource types');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching resource types:', error);
      throw error;
    }
  },

  // Get single resource type
  getById: async (id: number): Promise<ResourceType> => {
    try {
      const { data, error } = await supabaseClient
        .from('resource_type')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to fetch resource type');
      }

      if (!data) {
        throw new Error('Resource type not found');
      }

      return data;
    } catch (error) {
      console.error('Error fetching resource type:', error);
      throw error;
    }
  },

  // Create new resource type
  create: async (
    resourceTypeData: Omit<ResourceType, 'id'>
  ): Promise<ResourceType> => {
    try {
      const { data, error } = await supabaseClient
        .from('resource_type')
        .insert([
          {
            name: resourceTypeData.name.toLowerCase().replace(/\s+/g, '-'), // Normalize name
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Resource type already exists');
        }
        throw new Error(error.message || 'Failed to create resource type');
      }

      if (!data) {
        throw new Error('Failed to create resource type');
      }

      return data;
    } catch (error) {
      console.error('Error creating resource type:', error);
      throw error;
    }
  },

  // Delete resource type
  delete: async (id: number): Promise<void> => {
    try {
      // Check if any resources are using this type
      const { data: resources, error: checkError } = await supabaseClient
        .from('resources')
        .select('id')
        .eq('type_id', id)
        .limit(1);

      if (checkError) {
        console.error('Error checking resource usage:', checkError);
        throw new Error('Failed to check if resource type is in use');
      }

      if (resources && resources.length > 0) {
        throw new Error('Cannot delete resource type that is in use');
      }

      const { error } = await supabaseClient
        .from('resource_type')
        .delete()
        .eq('id', id);

      if (error) {
        // Check if it's a foreign key constraint error
        if (error.code === '23503') {
          throw new Error(
            'Cannot delete resource type that is referenced by resources'
          );
        }
        throw new Error(error.message || 'Failed to delete resource type');
      }
    } catch (error) {
      console.error('Error deleting resource type:', error);
      throw error;
    }
  },
};

// Re-export types for use in components
export type {
  Event,
  Resource,
  Vendor,
  FeaturedResource,
  FeaturedEvent,
  FeaturedEventVideo,
  TeamMember,
  AnnouncementBar,
  SlideGallery,
  ResourceType,
};
