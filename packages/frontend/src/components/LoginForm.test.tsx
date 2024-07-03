import { render, screen } from '@testing-library/react'
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

})