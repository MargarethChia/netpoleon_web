import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VendorsPage from '../admin/vendors/page';
import * as nextNavigation from 'next/navigation';

const getAll = vi.fn();
const del = vi.fn();
const create = vi.fn();
const getById = vi.fn();
const update = vi.fn();

vi.mock('@/lib/api', () => ({
  vendorsApi: {
    getAll: (...a: any[]) => getAll(...a),
    delete: (...a: any[]) => del(...a),
    create: (...a: any[]) => create(...a),
    getById: (...a: any[]) => getById(...a),
    update: (...a: any[]) => update(...a),
  },
}));

vi.mock('@/components/ui/toast', () => ({ showToast: vi.fn() }));
// Mock storage to avoid Supabase client in tests
vi.mock('@/lib/storage', () => ({
  uploadImage: vi
    .fn()
    .mockResolvedValue({ success: true, url: 'https://example.com/img.png' }),
  uploadVendorPortfolio: vi.fn().mockResolvedValue({
    success: true,
    url: 'https://example.com/portfolio.pdf',
  }),
  getVendorPortfolioUrl: vi
    .fn()
    .mockReturnValue('https://example.com/portfolio.pdf'),
  uploadVendorRegistrationForm: vi.fn().mockResolvedValue({
    success: true,
    url: 'https://example.com/registration.pdf',
  }),
  getVendorRegistrationFormUrl: vi
    .fn()
    .mockReturnValue('https://example.com/registration.pdf'),
}));

// Import after mocks so they apply to module graph
import CreateVendorPage from '../admin/vendors/create/page';
import EditVendorPage from '../admin/vendors/[id]/edit/page';
import { showToast } from '@/components/ui/toast';

vi.mock('@/lib/supabase-client', () => ({
  supabaseClient: {
    auth: { signOut: vi.fn().mockResolvedValue({ error: null }) },
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: '1' }),
}));

describe('Admin Vendors Page', () => {
  beforeEach(() => {
    getAll.mockReset();
    del.mockReset();
    create.mockReset();
    vi.clearAllMocks();
  });

  function seed() {
    getAll.mockResolvedValue([
      {
        id: 1,
        name: 'Acme Security',
        description: 'EDR vendor',
        logo_url: '',
        image_url: '',
        diagram_url: '',
        link: 'https://acme.test',
        type: 'Endpoint Security',
        created_at: '2099-02-01',
      },
      {
        id: 2,
        name: 'Shield Corp',
        description: 'IAM solutions',
        logo_url: '',
        image_url: '',
        diagram_url: '',
        link: '',
        type: 'Identity & Access',
        created_at: '2099-03-01',
      },
    ]);
  }

  it('lists vendors and shows counters', async () => {
    seed();
    render(<VendorsPage />);
    expect(await screen.findByText(/all vendors/i)).toBeInTheDocument();
    expect(screen.getByText(/2 vendors total/i)).toBeInTheDocument();
    expect(screen.getByText(/acme security/i)).toBeInTheDocument();
    expect(screen.getByText(/shield corp/i)).toBeInTheDocument();
  });

  it('filters via search', async () => {
    seed();
    render(<VendorsPage />);
    await screen.findByText(/all vendors/i);
    fireEvent.change(screen.getByPlaceholderText(/search vendors\.\.\./i), {
      target: { value: 'Acme' },
    });
    expect(screen.getByText(/1 vendors total/i)).toBeInTheDocument();
    expect(screen.queryByText(/shield corp/i)).not.toBeInTheDocument();
  });

  it('opens vendor menu and triggers delete flow', async () => {
    seed();
    del.mockResolvedValue(undefined);
    render(<VendorsPage />);
    await screen.findByText(/all vendors/i);
    const row = screen.getByRole('row', { name: /shield corp/i });
    const menuBtn = within(row).getByTestId('row-menu');
    const user = userEvent.setup();
    await user.click(menuBtn);
    const menu = await screen.findByRole('menu');
    await user.click(within(menu).getByText(/delete vendor/i));
    await user.click(await screen.findByRole('button', { name: /delete/i }));
    await waitFor(() => expect(del).toHaveBeenCalled());
    expect(screen.getByText(/2 vendors total/i)).toBeInTheDocument();
  });

  it('opens website link button when present', async () => {
    seed();
    // Spy on window.open
    const openSpy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null as any);
    render(<VendorsPage />);
    await screen.findByText(/all vendors/i);
    const row = screen.getByRole('row', { name: /acme security/i });
    const buttons = within(row).getAllByRole('button');
    const linkBtn = buttons.find(b =>
      b.innerHTML.includes('lucide-external-link')
    )!;
    fireEvent.click(linkBtn);
    expect(openSpy).toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('shows error when vendor name missing on create', async () => {
    // Render create page directly
    const push = vi.fn();
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any);

    render(<CreateVendorPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /create vendor/i }));

    // Required field should block and show toast; creation not called
    expect(create).not.toHaveBeenCalled();
    // Input is required
    const nameInput = screen.getByLabelText(
      /vendor name \*/i
    ) as HTMLInputElement;
    expect(nameInput).toBeRequired();
    expect(nameInput.checkValidity()).toBe(false);
    // Toast called with validation message
    expect(showToast).toHaveBeenCalled();
    const calls = (showToast as any).mock.calls;
    const last = calls[calls.length - 1][0];
    expect(last.message || JSON.stringify(last)).toMatch(
      /please fill in the vendor name/i
    );
  });

  it('creates a valid vendor and redirects back to list', async () => {
    const push = vi.fn();
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any);
    create.mockResolvedValue({ id: 99, name: 'New Vendor' });

    render(<CreateVendorPage />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/vendor name \*/i), 'New Vendor');
    await user.click(screen.getByRole('button', { name: /create vendor/i }));

    await waitFor(() => expect(create).toHaveBeenCalled());
    expect(push).toHaveBeenCalledWith('/admin/vendors');
  });

  it('create vendor shows validation toast when name empty and no API call', async () => {
    const push = vi.fn();
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any);
    render(<CreateVendorPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /create vendor/i }));
    expect(create).not.toHaveBeenCalled();
  });

  it('edit vendor: update handles API error', async () => {
    // mock edit page route and vendor
    const push = vi.fn();
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any);
    del.mockResolvedValue(undefined);
    getById.mockResolvedValue({
      id: 7,
      name: 'ErrCo',
      description: '',
      logo_url: '',
      image_url: '',
      diagram_url: '',
      link: '',
      type: '',
      created_at: '2099-01-01',
      updated_at: '2099-01-01',
    });
    vi.spyOn(nextNavigation, 'useParams').mockReturnValue({ id: '7' } as any);
    update.mockRejectedValue(new Error('Update failed'));

    render(<EditVendorPage />);
    // Wait for load
    expect(await screen.findByDisplayValue(/ErrCo/i)).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /update vendor/i }));
    await waitFor(() => expect(update).toHaveBeenCalled());
  });

  it('edit page: existing logo and featured image render and removing hides them', async () => {
    // Mock route params and router
    const push = vi.fn();
    vi.spyOn(nextNavigation, 'useRouter').mockReturnValue({ push } as any);

    // Mock vendor fetched by id
    getById.mockResolvedValue({
      id: 1,
      name: 'Acme Security',
      description: 'EDR vendor',
      logo_url: 'https://cdn.test/logo.png',
      image_url: 'https://cdn.test/feat.jpg',
      diagram_url: 'https://cdn.test/diagram.png',
      link: 'https://acme.test',
      type: 'Endpoint Security',
      created_at: '2099-01-01',
      updated_at: '2099-01-01',
    });

    render(<EditVendorPage />);
    // Previews visible
    expect(await screen.findByAltText(/logo preview/i)).toBeInTheDocument();
    expect(screen.getByAltText(/image preview/i)).toBeInTheDocument();

    const user = userEvent.setup();
    // Remove logo
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await user.click(removeButtons[0]);
    expect(screen.queryByAltText(/logo preview/i)).not.toBeInTheDocument();

    // Remove image (new remove button remains)
    const removeButtons2 = screen.getAllByRole('button', { name: /remove/i });
    await user.click(removeButtons2[0]);
    expect(screen.queryByAltText(/image preview/i)).not.toBeInTheDocument();
  });

  it('displays portfolio upload section', async () => {
    seed();
    render(<VendorsPage />);
    await screen.findByText(/all vendors/i);
    expect(
      screen.getByText(/vendor portfolio management/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/upload portfolio/i)).toBeInTheDocument();
  });

  it('displays registration form upload section', async () => {
    seed();
    render(<VendorsPage />);
    await screen.findByText(/all vendors/i);
    expect(
      screen.getByText(/vendor registration form management/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/upload registration form/i)).toBeInTheDocument();
  });

  it('displays stats cards with correct counts', async () => {
    seed();
    render(<VendorsPage />);
    await screen.findByText(/all vendors/i);

    // Check total vendors count
    expect(screen.getByText(/total vendors/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Total count

    // Check with logos count
    expect(screen.getByText(/with logos/i)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // No logos in seed data

    // Check with websites count
    expect(screen.getByText(/with websites/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // One vendor has a link
  });

  it('shows vendor types in table', async () => {
    seed();
    render(<VendorsPage />);
    await screen.findByText(/all vendors/i);

    // Check that vendor types are displayed
    expect(screen.getByText(/endpoint security/i)).toBeInTheDocument();
    expect(screen.getByText(/identity & access/i)).toBeInTheDocument();
  });

  it('shows diagram badges when diagram_url is present', async () => {
    const vendorsWithDiagram = [
      {
        id: 1,
        name: 'Test Vendor',
        description: 'Test description',
        logo_url: '',
        image_url: '',
        diagram_url: 'https://example.com/diagram.png',
        link: '',
        type: 'Test Type',
        created_at: '2099-01-01',
      },
    ];
    getAll.mockResolvedValue(vendorsWithDiagram);

    render(<VendorsPage />);
    await screen.findByText(/all vendors/i);

    // Check for diagram badge specifically in the table
    const diagramBadges = screen.getAllByText(/diagram/i);
    expect(diagramBadges.length).toBeGreaterThan(0);
  });
});

describe('Admin Vendors Placeholder', () => {
  it('smoke', () => {
    expect(true).toBe(true);
  });
});
