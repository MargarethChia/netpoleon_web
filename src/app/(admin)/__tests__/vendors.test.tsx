import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VendorsPage from '../admin/vendors/page'
import * as nextNavigation from 'next/navigation'

const getAll = vi.fn()
const del = vi.fn()
const create = vi.fn()

vi.mock('@/lib/api', () => ({
  vendorsApi: {
    getAll: (...a: any[]) => getAll(...a),
    delete: (...a: any[]) => del(...a),
    create: (...a: any[]) => create(...a),
  },
}))

vi.mock('@/components/ui/toast', () => ({ showToast: vi.fn() }))
// Mock storage to avoid Supabase client in tests
vi.mock('@/lib/storage', () => ({
  uploadImage: vi.fn().mockResolvedValue({ success: true, url: 'https://example.com/img.png' })
}))

// Import after mocks so they apply to module graph
import CreateVendorPage from '../admin/vendors/create/page'
import { showToast } from '@/components/ui/toast'

vi.mock('@/lib/supabase-client', () => ({
  supabaseClient: { auth: { signOut: vi.fn().mockResolvedValue({ error: null }) } },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
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
})

describe('Admin Vendors Placeholder', () => {
  it('smoke', () => {
    expect(true).toBe(true)
  })
})

