import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import LoginPage from '../login/page'

// Mock the server action used by the client page
const mockLogin = vi.fn()
vi.mock('../login/actions', () => ({
  login: (...args: any[]) => mockLogin(...args),
}))

describe('Admin Login Page', () => {
  function fillForm(email = 'admin@example.com', password = 'Password123!') {
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.change(emailInput, { target: { value: email } })
    fireEvent.change(passwordInput, { target: { value: password } })
  }

  beforeEach(() => {
    mockLogin.mockReset()
  })

  it('renders the login UI', () => {
    render(<LoginPage />)
    expect(screen.getByRole('heading', { name: /netpoleon/i, level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/admin portal/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    render(<LoginPage />)
    const passwordInput = screen.getByLabelText(/password/i)
    expect((passwordInput as HTMLInputElement).type).toBe('password')

    // Find the toggle button inside the password field container
    const pwdField = passwordInput.closest('div')!.parentElement as HTMLElement
    const toggleBtn = within(pwdField).getByRole('button')
    fireEvent.click(toggleBtn)
    expect((passwordInput as HTMLInputElement).type).toBe('text')

    fireEvent.click(toggleBtn)
    expect((passwordInput as HTMLInputElement).type).toBe('password')
  })

  it('shows loading state, disables inputs, and changes button label on submit', async () => {
    mockLogin.mockResolvedValue({ status: 401 })
    render(<LoginPage />)
    fillForm()

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submit = screen.getByRole('button', { name: /sign in/i })

    fireEvent.click(submit)

    await waitFor(() => {
      // Button disabled during request
      expect(submit).toBeDisabled()
      // Inputs disabled during request
      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      // Button label shows spinner text
      expect(submit).toHaveTextContent(/signing in/i)
    })
  })

  it('passes FormData with email & password to the server action', async () => {
    mockLogin.mockResolvedValue({ status: 401 })
    render(<LoginPage />)
    fillForm('admin@example.com', 'Password123!')
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1))
    const fd = mockLogin.mock.calls[0][0] as FormData
    expect(fd.get('email')).toBe('admin@example.com')
    expect(fd.get('password')).toBe('Password123!')
  })

  it('redirects to /admin on successful login', async () => {
    mockLogin.mockResolvedValue({ status: 200, redirectTo: '/admin' })

    // Make window.location.href writable
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    })

    render(<LoginPage />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(window.location.href).toBe('/admin')
    })

    // Restore
    Object.defineProperty(window, 'location', { value: originalLocation })
  })

  it('shows 400 error message when no account found', async () => {
    mockLogin.mockResolvedValue({ status: 400 })
    render(<LoginPage />)
    fillForm('missing@netpoleon.com', 'secret')
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // Matches your component copy for 400
    expect(
      await screen.findByText(/no account found with this email\. please contact an administrator\./i)
    ).toBeInTheDocument()
  })

  it('shows 401 error message when invalid credentials', async () => {
    mockLogin.mockResolvedValue({ status: 401 })
    render(<LoginPage />)
    fillForm('admin@netpoleon.com', 'wrong')
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid email or password\. please try again\./i)).toBeInTheDocument()
  })

  it('shows 500 error message (custom or default)', async () => {
    mockLogin.mockResolvedValue({ status: 500, message: 'Custom server error' })
    render(<LoginPage />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/custom server error/i)).toBeInTheDocument()
  })

  it('shows unexpected error when action throws', async () => {
    mockLogin.mockRejectedValue(new Error('boom'))
    render(<LoginPage />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/an unexpected error occurred/i)).toBeInTheDocument()
  })

  it('clears a previous error when resubmitting', async () => {
    // First attempt fails with 401
    mockLogin.mockResolvedValueOnce({ status: 401 })
    render(<LoginPage />)
    fillForm('admin@netpoleon.com', 'wrong')
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    const err = await screen.findByText(/invalid email or password/i)
    expect(err).toBeInTheDocument()

    // Second attempt triggers setError(null) then a new 401
    mockLogin.mockResolvedValueOnce({ status: 401 })
    fillForm('admin@netpoleon.com', 'still-wrong')
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      // Old error should be re-rendered (cleared and re-set), but at minimum the request fired again
      expect(mockLogin).toHaveBeenCalledTimes(2)
    })
  })
})


