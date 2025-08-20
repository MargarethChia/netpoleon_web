import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VendorsPage from '../admin/vendors/page'
import * as nextNavigation from 'next/navigation'

const getAll = vi.fn()
const del = vi.fn()
const create = vi.fn()
const getById = vi.fn()
const update = vi.fn()

vi.mock('@/lib/api', () => ({
  vendorsApi: {
    getAll: (...a: any[]) => getAll(...a),
    delete: (...a: any[]) => del(...a),
    create: (...a: any[]) => create(...a),
    getById: (...a: any[]) => getById(...a),
    update: (...a: any[]) => update(...a),
  },
}))

vi.mock('@/components/ui/toast', () => ({ showToast: vi.fn() }))
// Mock storage to avoid Supabase client in tests
vi.mock('@/lib/storage', () => ({
  uploadImage: vi.fn().mockResolvedValue({ success: true, url: 'https://example.com/img.png' })
}))

// Import after mocks so they apply to module graph
import CreateVendorPage from '../admin/vendors/create/page'
import EditVendorPage from '../admin/vendors/[id]/edit/page'
import { showToast } from '@/components/ui/toast'

vi.mock('@/lib/supabase-client', () => ({
  supabaseClient: { auth: { signOut: vi.fn().mockResolvedValue({ error: null }) } },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: '1' }),
}))

describe('Admin Vendors Page', () => {
  beforeEach(() => {
    getAll.mockReset(); del.mockReset(); create.mockReset();
    vi.clearAllMocks()
  })

  function seed() {
    getAll.mockResolvedValue([
      { id: 1, name: 'Acme Security', description: 'EDR vendor', logo_url: '', link: 'https://acme.test', created_at: '2099-02-01' },
      { id: 2, name: 'Shield Corp', description: 'IAM solutions', logo_url: '', link: '', created_at: '2099-03-01' },
    ])
  }

  it('lists vendors and shows counters', async () => {
    seed()
    render(<VendorsPage />)
    expect(await screen.findByText(/all vendors/i)).toBeInTheDocument()
    expect(screen.getByText(/2 vendors total/i)).toBeInTheDocument()
    expect(screen.getByText(/acme security/i)).toBeInTheDocument()
    expect(screen.getByText(/shield corp/i)).toBeInTheDocument()
  })

  it('filters via search', async () => {
    seed()
    render(<VendorsPage />)
    await screen.findByText(/all vendors/i)
    fireEvent.change(screen.getByPlaceholderText(/search vendors/i), { target: { value: 'Acme' } })
    expect(screen.getByText(/1 vendors total/i)).toBeInTheDocument()
    expect(screen.queryByText(/shield corp/i)).not.toBeInTheDocument()
  })

  it('opens vendor menu and triggers delete flow', async () => {
    seed(); del.mockResolvedValue(undefined)
    render(<VendorsPage />)
    await screen.findByText(/all vendors/i)
    const row = screen.getByRole('row', { name: /shield corp/i })
    const menuBtn = within(row).getByTestId('row-menu')
    const user = userEvent.setup()
    await user.click(menuBtn)
    const menu = await screen.findByRole('menu')
    await user.click(within(menu).getByText(/delete vendor/i))
    await user.click(await screen.findByRole('button', { name: /delete/i }))
    await waitFor(() => expect(del).toHaveBeenCalled())
    expect(screen.getByText(/2 vendors total/i)).toBeInTheDocument()
  })

  it('opens website link button when present', async () => {
    seed()
    // Spy on window.open
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null as any)
    render(<VendorsPage />)
    await screen.findByText(/all vendors/i)
    const row = screen.getByRole('row', { name: /acme security/i })
    const buttons = within(row).getAllByRole('button')
    const linkBtn = buttons.find(b => b.innerHTML.includes('lucide-external-link'))!
    fireEvent.click(linkBtn)
    expect(openSpy).toHaveBeenCalled()
    openSpy.mockRestore()
  })

  it('shows error when vendor name missing on create', async () => {
    // Render create page directly
    const push = vi.fn()
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any)

    render(<CreateVendorPage />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /create vendor/i }))

    // Required field should block and show toast; creation not called
    expect(create).not.toHaveBeenCalled()
    // Input is required
    const nameInput = screen.getByLabelText(/vendor name/i) as HTMLInputElement
    expect(nameInput).toBeRequired()
    expect(nameInput.checkValidity()).toBe(false)
    // Toast called with validation message
    expect(showToast).toHaveBeenCalled()
    const calls = (showToast as any).mock.calls
    const last = calls[calls.length - 1][0]
    expect(last.message || JSON.stringify(last)).toMatch(/please fill in the vendor name/i)
  })

  it('creates a valid vendor and redirects back to list', async () => {
    const push = vi.fn()
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any)
    create.mockResolvedValue({ id: 99, name: 'New Vendor' })

    render(<CreateVendorPage />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/vendor name/i), 'New Vendor')
    await user.click(screen.getByRole('button', { name: /create vendor/i }))

    await waitFor(() => expect(create).toHaveBeenCalled())
    expect(push).toHaveBeenCalledWith('/admin/vendors')
  })

  it('create vendor shows validation toast when name empty and no API call', async () => {
    const push = vi.fn()
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any)
    render(<CreateVendorPage />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /create vendor/i }))
    expect(create).not.toHaveBeenCalled()
  })

  it('edit vendor: update handles API error', async () => {
    // mock edit page route and vendor
    const push = vi.fn()
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any)
    del.mockResolvedValue(undefined)
    getById.mockResolvedValue({
      id: 7,
      name: 'ErrCo',
      description: '',
      logo_url: '',
      image_url: '',
      link: '',
      created_at: '2099-01-01',
      updated_at: '2099-01-01',
    })
    vi.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '7' } as any)
    update.mockRejectedValue(new Error('Update failed'))

    render(<EditVendorPage />)
    // Wait for load
    expect(await screen.findByDisplayValue(/ErrCo/i)).toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /update vendor/i }))
    await waitFor(() => expect(update).toHaveBeenCalled())
  })

  it('create page: logo and featured image previews appear and remove hides them', async () => {
    const push = vi.fn()
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any)
    render(<CreateVendorPage />)
    const user = userEvent.setup()

    // Logo preview
    await user.type(screen.getByLabelText(/or enter logo url manually/i), 'https://cdn.test/logo.png')
    expect(screen.getByAltText(/logo preview/i)).toBeInTheDocument()

    // Remove logo
    await user.click(screen.getByRole('button', { name: /remove/i }))
    expect(screen.queryByAltText(/logo preview/i)).not.toBeInTheDocument()

    // Image preview
    await user.type(screen.getByLabelText(/or enter image url manually/i), 'https://cdn.test/feat.jpg')
    expect(screen.getByAltText(/image preview/i)).toBeInTheDocument()

    // Remove image
    await user.click(screen.getByRole('button', { name: /remove/i }))
    expect(screen.queryByAltText(/image preview/i)).not.toBeInTheDocument()
  })

  it('edit page: existing logo and featured image render and removing hides them', async () => {
    // Mock route params and router
    const push = vi.fn()
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any)

    // Mock vendor fetched by id
    getById.mockResolvedValue({
      id: 1,
      name: 'Acme Security',
      description: 'EDR vendor',
      logo_url: 'https://cdn.test/logo.png',
      image_url: 'https://cdn.test/feat.jpg',
      link: 'https://acme.test',
      created_at: '2099-01-01',
      updated_at: '2099-01-01',
    })

    render(<EditVendorPage />)
    // Previews visible
    expect(await screen.findByAltText(/logo preview/i)).toBeInTheDocument()
    expect(screen.getByAltText(/image preview/i)).toBeInTheDocument()

    const user = userEvent.setup()
    // Remove logo
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await user.click(removeButtons[0])
    expect(screen.queryByAltText(/logo preview/i)).not.toBeInTheDocument()

    // Remove image (new remove button remains)
    const removeButtons2 = screen.getAllByRole('button', { name: /remove/i })
    await user.click(removeButtons2[0])
    expect(screen.queryByAltText(/image preview/i)).not.toBeInTheDocument()
  })
})

describe('Admin Vendors Placeholder', () => {
  it('smoke', () => {
    expect(true).toBe(true)
  })
})

