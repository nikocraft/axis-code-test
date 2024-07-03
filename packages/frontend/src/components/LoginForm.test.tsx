import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'


// Mock the Fluent UI components
jest.mock('@fluentui/react-components', () => ({
  Input: 'input',
  Button: 'button',
  Card: 'div',
  Text: 'span',
  makeStyles: () => () => ({
    form: 'mockFormClass',
    card: 'mockCardClass',
    input: 'mockInputClass',
    button: 'mockButtonClass',
    errorMessage: 'mockErrorMessageClass',
  }),
}))


describe('LoginForm', () => {

  it('renders login form', () => {
    render(<LoginForm onLogin={() => Promise.resolve({ success: true })} />)
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('displays default values for email and password', () => {
    render(<LoginForm onLogin={() => Promise.resolve({ success: true })} />)
    
    expect(screen.getByPlaceholderText('Email')).toHaveValue('user1@gmail.com')
    expect(screen.getByPlaceholderText('Password')).toHaveValue('password1234!')
  })

  it('updates email and password values on user input', async () => {
    render(<LoginForm onLogin={() => Promise.resolve({ success: true })} />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, 'newpassword123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('newpassword123')
  })

  it('calls onLogin with email and password when form is submitted', async () => {
    const mockOnLogin = jest.fn().mockResolvedValue({ success: true })
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, 'password123')
    
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('displays error message when login fails', async () => {
    const mockOnLogin = jest.fn().mockResolvedValue({ success: false, error: 'Invalid credentials' })
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('clears error message when user starts typing after a failed login', async () => {
    const mockOnLogin = jest.fn().mockResolvedValue({ success: false, error: 'Invalid credentials' })
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    const emailInput = screen.getByPlaceholderText('Email')
    await userEvent.type(emailInput, 'a')

    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
  })

})