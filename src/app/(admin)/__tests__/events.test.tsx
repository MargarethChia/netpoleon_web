import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventsPage from '../admin/events/page'

const getAll = vi.fn()
const del = vi.fn()
const create = vi.fn()
const update = vi.fn()

vi.mock('@/lib/api', () => ({
  eventsApi: {
    getAll: (...args: any[]) => getAll(...args),
    delete: (...args: any[]) => del(...args),
    create: (...args: any[]) => create(...args),
    update: (...args: any[]) => update(...args),
  },
}))

vi.mock('@/components/ui/toast', () => ({
  showToast: vi.fn(),
}))

// Mock supabase client used by AdminLayout
vi.mock('@/lib/supabase-client', () => ({
  supabaseClient: { auth: { signOut: vi.fn().mockResolvedValue({ error: null }) } },
}))

// Mock Next.js app router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('Admin Events Page', () => {
  beforeEach(() => {
    getAll.mockReset()
    del.mockReset()
    create.mockReset()
    update.mockReset()
  })

  function seed() {
    getAll.mockResolvedValue([
      { id: 1, title: 'Security Conference', event_date: '2099-10-10', description: 'Future conf', location: 'SG', link: '' },
      { id: 2, title: 'Past Summit', event_date: '2000-01-01', description: 'Old event', location: 'US', link: '' },
    ])
  }

  it('lists events and shows counts', async () => {
    seed()
    render(<EventsPage />)
    expect(await screen.findByText(/all events/i)).toBeInTheDocument()
    expect(screen.getByText(/2 events total/i)).toBeInTheDocument()
    expect(screen.getByText(/security conference/i)).toBeInTheDocument()
    expect(screen.getByText(/past summit/i)).toBeInTheDocument()
  })

  it('filters via search', async () => {
    seed()
    render(<EventsPage />)
    await screen.findByText(/all events/i)
    fireEvent.change(screen.getByPlaceholderText(/search events/i), { target: { value: 'security' } })
    expect(screen.getByText(/1 events total/i)).toBeInTheDocument()
    expect(screen.queryByText(/past summit/i)).not.toBeInTheDocument()
  })

  it('opens Add Event dialog via header button', async () => {
    seed()
    render(<EventsPage />)
    await screen.findByText(/all events/i)
    fireEvent.click(screen.getByRole('button', { name: /add event/i }))
    expect(await screen.findByText(/add new event/i)).toBeInTheDocument()
  })

  it('opens Edit Event via row menu', async () => {
    seed()
    render(<EventsPage />)
    await screen.findByText(/all events/i)
    const row = screen.getByRole('row', { name: /security conference/i })
    const menuBtn = within(row).getByTestId('row-menu')
    const user = userEvent.setup()
    await user.click(menuBtn)
    const menu = await screen.findByRole('menu')
    await user.click(within(menu).getByText(/edit event/i))
    expect(await screen.findByText(/edit event/i)).toBeInTheDocument()
  })

  it('deletes an event via confirm dialog', async () => {
    seed()
    del.mockResolvedValue(undefined)
    render(<EventsPage />)
    await screen.findByText(/all events/i)
    const row = screen.getByRole('row', { name: /past summit/i })
    const menuBtn = within(row).getByTestId('row-menu')
    const user = userEvent.setup()
    await user.click(menuBtn)
    const menu = await screen.findByRole('menu')
    await user.click(within(menu).getByText(/delete event/i))
    // confirm dialog
    await user.click(await screen.findByRole('button', { name: /delete event/i }))
    await waitFor(() => expect(del).toHaveBeenCalled())
  })

  it('adds a new event and list updates', async () => {
    const initial = [
      { id: 1, title: 'Security Conference', event_date: '2099-10-10', description: 'Future conf', location: 'SG', link: '' },
    ]
    const newEvent = { id: 3, title: 'Blue Team Meetup', event_date: '2099-12-31', description: '', location: 'MY', link: '' }
    const updated = [...initial, newEvent]

    getAll.mockResolvedValueOnce(initial)
    getAll.mockResolvedValueOnce(updated)
    create.mockResolvedValue(newEvent)

    render(<EventsPage />)
    await screen.findByText(/all events/i)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add event/i }))

    await user.type(screen.getByLabelText(/event title/i), 'Blue Team Meetup')
    await user.type(screen.getByLabelText(/event date/i), '2099-12-31')

    await user.click(screen.getByRole('button', { name: /create event/i }))

    await waitFor(() => expect(create).toHaveBeenCalled())
    await screen.findByText(/blue team meetup/i)
    expect(screen.getByText(/2 events total|3 events total/i)).toBeInTheDocument()
  })

  it('shows required validation when title missing', async () => {
    getAll.mockResolvedValueOnce([])
    render(<EventsPage />)
    await screen.findByText(/all events/i)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add event/i }))

    // Only set date
    await user.type(screen.getByLabelText(/event date/i), '2099-12-31')
    await user.click(screen.getByRole('button', { name: /create event/i }))

    const titleInput = screen.getByLabelText(/event title/i) as HTMLInputElement
    expect(titleInput).toBeRequired()
    expect(titleInput.checkValidity()).toBe(false)
  })

  it('shows required validation when date missing', async () => {
    getAll.mockResolvedValueOnce([])
    render(<EventsPage />)
    await screen.findByText(/all events/i)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add event/i }))

    // Only set title
    await user.type(screen.getByLabelText(/event title/i), 'Purple Team Sync')
    // Ensure date is empty
    const dateInput = screen.getByLabelText(/event date/i) as HTMLInputElement
    expect(dateInput.value).toBe('')
    await user.click(screen.getByRole('button', { name: /create event/i }))

    expect(dateInput).toBeRequired()
    expect(dateInput.checkValidity()).toBe(false)
  })

  it('updates an event title via edit and reflects in list', async () => {
    const initial = [
      { id: 1, title: 'Security Conference', event_date: '2099-10-10', description: '', location: '', link: '' },
    ]
    const updated = [
      { id: 1, title: 'Security Summit', event_date: '2099-10-10', description: '', location: '', link: '' },
    ]

    getAll.mockResolvedValueOnce(initial)
    getAll.mockResolvedValueOnce(updated)
    update.mockResolvedValue(updated[0])

    render(<EventsPage />)
    await screen.findByText(/all events/i)
    const row = screen.getByRole('row', { name: /security conference/i })
    const menuBtn = within(row).getByTestId('row-menu')
    const user = userEvent.setup()
    await user.click(menuBtn)
    const menu = await screen.findByRole('menu')
    await user.click(within(menu).getByText(/edit event/i))

    const titleInput = screen.getByLabelText(/event title/i)
    await user.clear(titleInput)
    await user.type(titleInput, 'Security Summit')
    await user.click(screen.getByRole('button', { name: /update event/i }))

    await waitFor(() => expect(update).toHaveBeenCalled())
    expect(await screen.findByText(/security summit/i)).toBeInTheDocument()
    expect(screen.queryByText(/security conference/i)).not.toBeInTheDocument()
  })

  it('updates event date from Upcoming to Past and status changes', async () => {
      const initial = [
        { id: 1, title: 'Flip Status', event_date: '2099-10-10', description: '', location: '', link: '' },
      ]
      const updated = [
        { id: 1, title: 'Flip Status', event_date: '2000-01-01', description: '', location: '', link: '' },
      ]
      getAll.mockResolvedValueOnce(initial)
      getAll.mockResolvedValueOnce(updated)
      update.mockResolvedValue(updated[0])

      render(<EventsPage />)
      await screen.findByText(/all events/i)
      const row = screen.getByRole('row', { name: /flip status/i })
      // Initially upcoming
      expect(within(row).getByText(/upcoming/i)).toBeInTheDocument()
      const menuBtn = within(row).getByTestId('row-menu')
      const user = userEvent.setup()
      await user.click(menuBtn)
      const menu = await screen.findByRole('menu')
      await user.click(within(menu).getByText(/edit event/i))
      const dateInput = screen.getByLabelText(/event date/i) as HTMLInputElement
      await user.clear(dateInput)
      await user.type(dateInput, '2000-01-01')
      await user.click(screen.getByRole('button', { name: /update event/i }))
      await waitFor(() => expect(update).toHaveBeenCalled())
      const updatedRow = screen.getByRole('row', { name: /flip status/i })
      expect(within(updatedRow).getByText(/past/i)).toBeInTheDocument()
  })

  it('updates event date from Past to Upcoming and status changes', async () => {
      const initial = [
        { id: 1, title: 'Rise Status', event_date: '2000-01-01', description: '', location: '', link: '' },
      ]
      const updated = [
        { id: 1, title: 'Rise Status', event_date: '2099-10-10', description: '', location: '', link: '' },
      ]
      getAll.mockResolvedValueOnce(initial)
      getAll.mockResolvedValueOnce(updated)
      update.mockResolvedValue(updated[0])

      render(<EventsPage />)
      await screen.findByText(/all events/i)
      const row = screen.getByRole('row', { name: /rise status/i })
      // Initially past
      expect(within(row).getByText(/past/i)).toBeInTheDocument()
      const menuBtn = within(row).getByTestId('row-menu')
      const user = userEvent.setup()
      await user.click(menuBtn)
      const menu = await screen.findByRole('menu')
      await user.click(within(menu).getByText(/edit event/i))
      const dateInput = screen.getByLabelText(/event date/i) as HTMLInputElement
      await user.clear(dateInput)
      await user.type(dateInput, '2099-10-10')
      await user.click(screen.getByRole('button', { name: /update event/i }))
      await waitFor(() => expect(update).toHaveBeenCalled())
      const updatedRow = screen.getByRole('row', { name: /rise status/i })
      expect(within(updatedRow).getByText(/upcoming/i)).toBeInTheDocument()
  })
})

describe('Admin Events Placeholder', () => {
  it('smoke', () => {
    expect(true).toBe(true)
  })
})

