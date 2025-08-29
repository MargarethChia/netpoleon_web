'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  Star,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import EventForm from './components/EventForm';
import ViewEventDialog from './components/ViewEventDialog';
import { Event, FeaturedEvent, eventsApi } from '@/lib/api';
import { showToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<number | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const [eventsData, featuredData] = await Promise.all([
        eventsApi.getAll(),
        eventsApi.getFeatured(),
      ]);
      setEvents(eventsData);
      setFeaturedEvents(featuredData);
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast({
        title: 'Error',
        message: 'Failed to fetch events. Please refresh the page.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setEditingEvent(event);
      setIsFormOpen(true);
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    setDeleteEventId(eventId);
  };

  const confirmDeleteEvent = async () => {
    if (deleteEventId) {
      try {
        await eventsApi.delete(deleteEventId);
        showToast({
          title: 'Event Deleted',
          message: 'The event has been deleted successfully.',
          type: 'success',
        });
        fetchEvents(); // Refresh the list
      } catch (error) {
        console.error('Error deleting event:', error);
        showToast({
          title: 'Error',
          message: 'Failed to delete event. Please try again.',
          type: 'error',
        });
      }
    }
  };

  const handleFormSuccess = () => {
    fetchEvents(); // Refresh the list after successful operation
  };

  const getEventStatus = (eventDate: string) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);

    if (eventDateObj < today) {
      return { status: 'Past', variant: 'secondary' as const };
    } else if (eventDateObj.toDateString() === today.toDateString()) {
      return { status: 'Today', variant: 'default' as const };
    } else {
      return { status: 'Upcoming', variant: 'outline' as const };
    }
  };

  // Filter events based on search term only
  const filteredEvents = events.filter(
    event =>
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location &&
        event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.description &&
        event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleFeatured = async (eventId: number) => {
    try {
      const isCurrentlyFeatured = isFeatured(eventId);

      if (isCurrentlyFeatured) {
        // Remove from featured
        await eventsApi.removeFeatured(eventId);
        showToast({
          title: 'Success',
          message: 'Event removed from featured',
          type: 'success',
        });
      } else {
        // Add to featured (this will automatically remove any existing featured event)
        await eventsApi.addFeatured(eventId);
        showToast({
          title: 'Success',
          message: 'Event is now featured',
          type: 'success',
        });
      }

      fetchEvents(); // Refresh the data
    } catch (error) {
      console.error('Error toggling featured status:', error);
      showToast({
        title: 'Error',
        message: 'Failed to update featured status',
        type: 'error',
      });
    }
  };

  const isFeatured = (eventId: number) => {
    return featuredEvents.some(fe => fe.event_id === eventId);
  };

  if (isLoading) {
    return (
      <AdminLayout
        title="Events"
        description="Manage your upcoming events and conferences"
        currentPage="/admin/events"
        showAddButton={true}
        addButtonText="Add Event"
        onAddClick={handleAddEvent}
      >
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Search Loading */}
          <Card className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500">
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-64 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 w-full bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardContent>
          </Card>

          {/* Events Table Loading */}
          <Card
            className="animate-pulse fade-in-0 slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: '100ms' }}
          >
            <CardHeader>
              <div className="h-6 w-24 bg-muted rounded mb-2 transition-all duration-300 ease-out"></div>
              <div className="h-4 w-48 bg-muted rounded transition-all duration-300 ease-out"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-2">
                    <div className="h-4 w-40 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-24 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-32 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-5 w-20 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-4 w-16 bg-muted rounded transition-all duration-300 ease-out"></div>
                    <div className="h-8 w-8 bg-muted rounded transition-all duration-300 ease-out"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout
        title="Events"
        description="Manage your upcoming events and conferences"
        currentPage="/admin/events"
        showAddButton={true}
        addButtonText="Add Event"
        onAddClick={handleAddEvent}
      >
        <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Events</CardTitle>
              <CardDescription>
                Find specific events by title, location, or description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>
                {filteredEvents.length} events total •{' '}
                {
                  filteredEvents.filter(
                    e => getEventStatus(e.event_date).status === 'Upcoming'
                  ).length
                }{' '}
                upcoming
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? 'No events found matching your search.'
                    : 'No events found. Create your first event!'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Video</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead className="text-center">Featured</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map(event => {
                      const status = getEventStatus(event.event_date);
                      return (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                                {event.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(event.event_date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {event.location || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              {status.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {event.video ? (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={event.video}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                N/A
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {event.link && (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={event.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant={
                                isFeatured(event.id) ? 'default' : 'outline'
                              }
                              size="sm"
                              onClick={() => handleToggleFeatured(event.id)}
                              className="mx-auto"
                            >
                              <Star
                                className={`h-4 w-4 ${isFeatured(event.id) ? 'text-yellow-500' : ''}`}
                              />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  data-testid="row-menu"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditEvent(event.id)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Event
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Event
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {events.length}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Upcoming Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {
                    events.filter(
                      e => getEventStatus(e.event_date).status === 'Upcoming'
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {
                    events.filter(e => {
                      const eventDate = new Date(e.event_date);
                      const now = new Date();
                      return (
                        eventDate.getMonth() === now.getMonth() &&
                        eventDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Current month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Featured Events
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {featuredEvents.length}
                </div>
                <p className="text-xs text-muted-foreground">Highlighted</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>

      {/* Event Form Dialog */}
      <EventForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSuccess={handleFormSuccess}
      />

      {/* View Event Dialog */}
      <ViewEventDialog
        isOpen={viewingEvent !== null}
        onClose={() => setViewingEvent(null)}
        event={viewingEvent}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteEventId !== null}
        onClose={() => setDeleteEventId(null)}
        onConfirm={confirmDeleteEvent}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete Event"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}
