import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResourcesPage from '../admin/resources/page'

const getAll = vi.fn()
const getFeatured = vi.fn()
const update = vi.fn()
const addFeatured = vi.fn()
const removeFeatured = vi.fn()
const del = vi.fn()

vi.mock('@/lib/api', () => ({
  resourcesApi: {
    getAll: (...a: any[]) => getAll(...a),
    getFeatured: (...a: any[]) => getFeatured(...a),
    update: (...a: any[]) => update(...a),
    addFeatured: (...a: any[]) => addFeatured(...a),
    removeFeatured: (...a: any[]) => removeFeatured(...a),
    delete: (...a: any[]) => del(...a),
  },
}))

vi.mock('@/components/ui/toast', () => ({ showToast: vi.fn() }))

vi.mock('@/lib/supabase-client', () => ({
  supabaseClient: { auth: { signOut: vi.fn().mockResolvedValue({ error: null }) } },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('Admin Resources Page', () => {
  beforeEach(() => {
    getAll.mockReset(); getFeatured.mockReset(); update.mockReset(); addFeatured.mockReset(); removeFeatured.mockReset(); del.mockReset()
  })

  function seed() {
    getAll.mockResolvedValue([
      { id: 1, title: 'Zero Trust Guide', type: 'article', is_published: true, published_at: '2099-01-01', content: 'ZTNA', cover_image_url: '' },
      { id: 2, title: 'XDR Ebook', type: 'ebook', is_published: false, published_at: null, content: 'XDR', cover_image_url: '' },
    ])
    getFeatured.mockResolvedValue([{ resource_id: 1 }])
  }

  it('lists resources and shows counters', async () => {
    seed()
    render(<ResourcesPage />)
    expect(await screen.findByText(/all resources/i)).toBeInTheDocument()
    expect(screen.getByText(/2 resources total/i)).toBeInTheDocument()
    expect(screen.getByText(/zero trust guide/i)).toBeInTheDocument()
    expect(screen.getByText(/xdr ebook/i)).toBeInTheDocument()
  })

  it('filters via search', async () => {
    seed()
    render(<ResourcesPage />)
    await screen.findByText(/all resources/i)
    fireEvent.change(screen.getByPlaceholderText(/search resources/i), { target: { value: 'Zero' } })
    expect(screen.getByText(/1 resources total/i)).toBeInTheDocument()
    expect(screen.queryByText(/xdr ebook/i)).not.toBeInTheDocument()
  })

  it('toggles publish status via row menu', async () => {
    seed(); update.mockResolvedValue({})
    render(<ResourcesPage />)
    await screen.findByText(/all resources/i)
    const row = screen.getByRole('row', { name: /zero trust guide/i })
    const menuBtn = within(row).getByTestId('row-menu')
    const user = userEvent.setup()
    await user.click(menuBtn)
    const menu = await screen.findByRole('menu')
    const item = within(menu).getByText(/unpublish|publish/i)
    await user.click(item)
    await waitFor(() => expect(update).toHaveBeenCalled())
  })

  it('toggles featured', async () => {
    seed(); addFeatured.mockResolvedValue({}); removeFeatured.mockResolvedValue({})
    render(<ResourcesPage />)
    await screen.findByText(/all resources/i)
    const row = screen.getByRole('row', { name: /xdr ebook/i })
    const buttons = within(row).getAllByRole('button')
    const starBtn = buttons.find(b => b.innerHTML.includes('lucide-star'))!
    fireEvent.click(starBtn)
    await waitFor(() => expect(addFeatured).toHaveBeenCalled())
  })

  it('deletes a resource via confirm dialog', async () => {
    seed(); del.mockResolvedValue(undefined)
    render(<ResourcesPage />)
    await screen.findByText(/all resources/i)
    const row = screen.getByRole('row', { name: /xdr ebook/i })
    const menuBtn = within(row).getByTestId('row-menu')
    const user = userEvent.setup()
    await user.click(menuBtn)
    const menu = await screen.findByRole('menu')
    await user.click(within(menu).getByText(/delete resource/i))
    await user.click(await screen.findByRole('button', { name: /delete/i }))
    await waitFor(() => expect(del).toHaveBeenCalled())
  })
})

describe('Admin Resources Placeholder', () => {
  it('smoke', () => {
    expect(true).toBe(true)
  })
})

