import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventsPage from '../admin/events/page';

const getAll = vi.fn();
const del = vi.fn();
const create = vi.fn();
const update = vi.fn();
const getFeatured = vi.fn();
const addFeatured = vi.fn();
const removeFeatured = vi.fn();
const getFeaturedVideo = vi.fn();
const setFeaturedVideo = vi.fn();
const updateFeaturedVideo = vi.fn();
const removeFeaturedVideo = vi.fn();

vi.mock('@/lib/api', () => ({
  eventsApi: {
    getAll: (...args: any[]) => getAll(...args),
    delete: (...args: any[]) => del(...args),
    create: (...args: any[]) => create(...args),
    update: (...args: any[]) => update(...args),
    getFeatured: (...args: any[]) => getFeatured(...args),
    addFeatured: (...args: any[]) => addFeatured(...args),
    removeFeatured: (...args: any[]) => removeFeatured(...args),
  },
  featuredVideoApi: {
    get: (...args: any[]) => getFeaturedVideo(...args),
    set: (...args: any[]) => setFeaturedVideo(...args),
    update: (...args: any[]) => updateFeaturedVideo(...args),
    remove: (...args: any[]) => removeFeaturedVideo(...args),
  },
}));

vi.mock('@/components/ui/toast', () => ({
  showToast: vi.fn(),
}));

// Mock components
vi.mock('../admin/events/components/EventForm', () => ({
  default: ({ isOpen, onClose, event, onSuccess }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="event-form">
        <h2>{event ? 'Edit Event' : 'Add New Event'}</h2>
        <form
          onSubmit={async e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const title = formData.get('title') as string;
            const date = formData.get('date') as string;

            try {
              if (event) {
                // Simulate update call
                await update({ ...event, title, event_date: date });
              } else {
                // Simulate create call
                await create({
                  title,
                  event_date: date,
                  description: '',
                  location: '',
                  link: '',
                  video: '',
                  image_url: '',
                });
              }
            } catch (error) {
              // Handle error silently for testing
            }

            onSuccess();
            onClose();
          }}
        >
          <label>
            Event Title
            <input name="title" defaultValue={event?.title || ''} required />
          </label>
          <label>
            Event Date
            <input
              name="date"
              type="date"
              defaultValue={event?.event_date || ''}
              required
            />
          </label>
          <button type="submit">
            {event ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    );
  },
}));

vi.mock('../admin/events/components/FeaturedVideoForm', () => ({
  default: ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="featured-video-form">
        <h2>Featured Video Form</h2>
        <button onClick={onClose}>Close</button>
      </div>
    );
  },
}));

vi.mock('@/components/ui/confirm-dialog', () => ({
  ConfirmDialog: ({ isOpen, onClose, onConfirm, title, confirmText }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="confirm-dialog">
        <h2>{title}</h2>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText || 'Delete Event'}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  },
}));

// Mock storage
vi.mock('@/lib/storage', () => ({
  uploadImage: vi.fn().mockResolvedValue('https://example.com/image.jpg'),
}));

// Mock supabase client used by AdminLayout
vi.mock('@/lib/supabase-client', () => ({
  supabaseClient: {
    auth: { signOut: vi.fn().mockResolvedValue({ error: null }) },
  },
}));

// Mock Next.js app router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Admin Events Page', () => {
  beforeEach(() => {
    getAll.mockReset();
    del.mockReset();
    create.mockReset();
    update.mockReset();
    getFeatured.mockReset();
    addFeatured.mockReset();
    removeFeatured.mockReset();
    getFeaturedVideo.mockReset();
    setFeaturedVideo.mockReset();
    updateFeaturedVideo.mockReset();
    removeFeaturedVideo.mockReset();
    // Mock featured events API to return empty array by default
    getFeatured.mockResolvedValue([]);
    // Mock featured video API to return null by default
    getFeaturedVideo.mockResolvedValue(null);
  });

  function seed() {
    getAll.mockResolvedValue([
      {
        id: 1,
        title: 'Security Conference',
        event_date: '2099-10-10',
        description: 'Future conf',
        location: 'SG',
        link: '',
        video: '',
        image_url: 'https://example.com/image1.jpg',
      },
      {
        id: 2,
        title: 'Past Summit',
        event_date: '2000-01-01',
        description: 'Old event',
        location: 'US',
        link: '',
        video: '',
        image_url: '',
      },
    ]);
  }

  it('lists events and shows counts', async () => {
    seed();
    render(<EventsPage />);
    expect(await screen.findByText(/all events/i)).toBeInTheDocument();
    expect(screen.getByText(/2 events total/i)).toBeInTheDocument();
    expect(screen.getByText(/security conference/i)).toBeInTheDocument();
    expect(screen.getByText(/past summit/i)).toBeInTheDocument();
  });

  it('filters via search', async () => {
    seed();
    render(<EventsPage />);
    await screen.findByText(/all events/i);
    fireEvent.change(screen.getByPlaceholderText(/search events/i), {
      target: { value: 'security' },
    });
    expect(screen.getByText(/1 events total/i)).toBeInTheDocument();
    expect(screen.queryByText(/past summit/i)).not.toBeInTheDocument();
  });

  it('opens Add Event dialog via header button', async () => {
    seed();
    render(<EventsPage />);
    await screen.findByText(/all events/i);
    fireEvent.click(screen.getByRole('button', { name: /add event/i }));
    expect(await screen.findByText(/add new event/i)).toBeInTheDocument();
  });

  it('opens Edit Event via row menu', async () => {
    seed();
    render(<EventsPage />);
    await screen.findByText(/all events/i);
    const row = screen.getByRole('row', { name: /security conference/i });
    const menuBtn = within(row).getByTestId('row-menu');
    const user = userEvent.setup();
    await user.click(menuBtn);
    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByText(/edit event/i));
    expect(await screen.findByText(/edit event/i)).toBeInTheDocument();
  });

  it('deletes an event via confirm dialog', async () => {
    seed();
    del.mockResolvedValue(undefined);
    render(<EventsPage />);
    await screen.findByText(/all events/i);
    const row = screen.getByRole('row', { name: /past summit/i });
    const menuBtn = within(row).getByTestId('row-menu');
    const user = userEvent.setup();
    await user.click(menuBtn);
    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByText(/delete event/i));
    // confirm dialog
    await user.click(
      await screen.findByRole('button', { name: /delete event/i })
    );
    await waitFor(() => expect(del).toHaveBeenCalled());
  });

  it('adds a new event and list updates', async () => {
    const initial = [
      {
        id: 1,
        title: 'Security Conference',
        event_date: '2099-10-10',
        description: 'Future conf',
        location: 'SG',
        link: '',
        video: '',
        image_url: 'https://example.com/image1.jpg',
      },
    ];
    const newEvent = {
      id: 3,
      title: 'Blue Team Meetup',
      event_date: '2099-12-31',
      description: '',
      location: 'MY',
      link: '',
      video: '',
      image_url: '',
    };
    const updated = [...initial, newEvent];

    getAll.mockResolvedValueOnce(initial);
    getAll.mockResolvedValueOnce(updated);
    create.mockResolvedValue(newEvent);

    render(<EventsPage />);
    await screen.findByText(/all events/i);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add event/i }));

    await user.type(screen.getByLabelText(/event title/i), 'Blue Team Meetup');
    await user.type(screen.getByLabelText(/event date/i), '2099-12-31');

    await user.click(screen.getByRole('button', { name: /create event/i }));

    await waitFor(() => expect(create).toHaveBeenCalled());
    await screen.findByText(/blue team meetup/i);
    expect(screen.getByText(/2 events total/i)).toBeInTheDocument();
  });

  it('shows required validation when title missing', async () => {
    getAll.mockResolvedValue([]);
    render(<EventsPage />);
    await screen.findByText(/all events/i);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add event/i }));

    // Only set date
    await user.type(screen.getByLabelText(/event date/i), '2099-12-31');
    await user.click(screen.getByRole('button', { name: /create event/i }));

    const titleInput = screen.getByLabelText(
      /event title/i
    ) as HTMLInputElement;
    expect(titleInput).toBeRequired();
    expect(titleInput.checkValidity()).toBe(false);
  });

  it('shows required validation when date missing', async () => {
    getAll.mockResolvedValue([]);
    render(<EventsPage />);
    await screen.findByText(/all events/i);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add event/i }));

    // Only set title
    await user.type(screen.getByLabelText(/event title/i), 'Purple Team Sync');
    // Ensure date is empty
    const dateInput = screen.getByLabelText(/event date/i) as HTMLInputElement;
    expect(dateInput.value).toBe('');
    await user.click(screen.getByRole('button', { name: /create event/i }));

    expect(dateInput).toBeRequired();
    expect(dateInput.checkValidity()).toBe(false);
  });

  it('create fails gracefully when API throws', async () => {
    getAll.mockResolvedValue([]);
    create.mockRejectedValue(new Error('Create failed'));
    render(<EventsPage />);
    await screen.findByText(/all events/i);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add event/i }));
    await user.type(screen.getByLabelText(/event title/i), 'Bad Event');
    await user.type(screen.getByLabelText(/event date/i), '2099-12-31');
    await user.click(screen.getByRole('button', { name: /create event/i }));
    await waitFor(() => expect(create).toHaveBeenCalled());
  });

  it('delete handles API error without crashing', async () => {
    seed();
    del.mockRejectedValue(new Error('Delete failed'));
    render(<EventsPage />);
    await screen.findByText(/all events/i);
    const row = screen.getByRole('row', { name: /past summit/i });
    const menuBtn = within(row).getByTestId('row-menu');
    const user = userEvent.setup();
    await user.click(menuBtn);
    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByText(/delete event/i));
    await user.click(
      await screen.findByRole('button', { name: /delete event/i })
    );
    await waitFor(() => expect(del).toHaveBeenCalled());
  });

  it('updates an event title via edit and reflects in list', async () => {
    const initial = [
      {
        id: 1,
        title: 'Security Conference',
        event_date: '2099-10-10',
        description: '',
        location: '',
        link: '',
        video: '',
        image_url: '',
      },
    ];
    const updated = [
      {
        id: 1,
        title: 'Security Summit',
        event_date: '2099-10-10',
        description: '',
        location: '',
        link: '',
        video: '',
        image_url: '',
      },
    ];

    getAll.mockResolvedValueOnce(initial);
    getAll.mockResolvedValueOnce(updated);
    update.mockResolvedValue(updated[0]);

    render(<EventsPage />);
    await screen.findByText(/all events/i);
    const row = screen.getByRole('row', { name: /security conference/i });
    const menuBtn = within(row).getByTestId('row-menu');
    const user = userEvent.setup();
    await user.click(menuBtn);
    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByText(/edit event/i));

    const titleInput = screen.getByLabelText(/event title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Security Summit');
    await user.click(screen.getByRole('button', { name: /update event/i }));

    await waitFor(() => expect(update).toHaveBeenCalled());
    expect(await screen.findByText(/security summit/i)).toBeInTheDocument();
    expect(screen.queryByText(/security conference/i)).not.toBeInTheDocument();
  });

  it('updates event date from Upcoming to Past and status changes', async () => {
    const initial = [
      {
        id: 1,
        title: 'Flip Status',
        event_date: '2099-10-10',
        description: '',
        location: '',
        link: '',
        video: '',
        image_url: '',
      },
    ];
    const updated = [
      {
        id: 1,
        title: 'Flip Status',
        event_date: '2000-01-01',
        description: '',
        location: '',
        link: '',
        video: '',
        image_url: '',
      },
    ];
    getAll.mockResolvedValueOnce(initial);
    getAll.mockResolvedValueOnce(updated);
    update.mockResolvedValue(updated[0]);

    render(<EventsPage />);
    await screen.findByText(/all events/i);
    const row = screen.getByRole('row', { name: /flip status/i });
    // Initially upcoming
    expect(within(row).getByText(/upcoming/i)).toBeInTheDocument();
    const menuBtn = within(row).getByTestId('row-menu');
    const user = userEvent.setup();
    await user.click(menuBtn);
    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByText(/edit event/i));
    const dateInput = screen.getByLabelText(/event date/i) as HTMLInputElement;
    await user.clear(dateInput);
    await user.type(dateInput, '2000-01-01');
    await user.click(screen.getByRole('button', { name: /update event/i }));
    await waitFor(() => expect(update).toHaveBeenCalled());
    const updatedRow = screen.getByRole('row', { name: /flip status/i });
    expect(within(updatedRow).getByText(/past/i)).toBeInTheDocument();
  });

  it('updates event date from Past to Upcoming and status changes', async () => {
    const initial = [
      {
        id: 1,
        title: 'Rise Status',
        event_date: '2000-01-01',
        description: '',
        location: '',
        link: '',
        video: '',
        image_url: '',
      },
    ];
    const updated = [
      {
        id: 1,
        title: 'Rise Status',
        event_date: '2099-10-10',
        description: '',
        location: '',
        link: '',
        video: '',
        image_url: '',
      },
    ];
    getAll.mockResolvedValueOnce(initial);
    getAll.mockResolvedValueOnce(updated);
    update.mockResolvedValue(updated[0]);

    render(<EventsPage />);
    await screen.findByText(/all events/i);
    const row = screen.getByRole('row', { name: /rise status/i });
    // Initially past
    expect(within(row).getByText(/past/i)).toBeInTheDocument();
    const menuBtn = within(row).getByTestId('row-menu');
    const user = userEvent.setup();
    await user.click(menuBtn);
    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByText(/edit event/i));
    const dateInput = screen.getByLabelText(/event date/i) as HTMLInputElement;
    await user.clear(dateInput);
    await user.type(dateInput, '2099-10-10');
    await user.click(screen.getByRole('button', { name: /update event/i }));
    await waitFor(() => expect(update).toHaveBeenCalled());
    const updatedRow = screen.getByRole('row', { name: /rise status/i });
    expect(within(updatedRow).getByText(/upcoming/i)).toBeInTheDocument();
  });

  it('shows empty state when no events exist', async () => {
    getAll.mockResolvedValue([]);
    render(<EventsPage />);

    await screen.findByText(/all events/i);
    expect(screen.getByText(/no events found/i)).toBeInTheDocument();
    expect(screen.getByText(/create your first event/i)).toBeInTheDocument();
  });
});

describe('Admin Events Placeholder', () => {
  it('smoke', () => {
    expect(true).toBe(true);
  });
});
