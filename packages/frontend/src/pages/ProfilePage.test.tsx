import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import ProfilePage from './ProfilePage'
import { UseQueryState } from 'urql'
import { MeQuery } from '../graphql/queries'

jest.mock('urql', () => ({
  useQuery: jest.fn(),
}))

jest.mock('../graphql/queries', () => ({
  ME_QUERY: 'mocked ME_QUERY',
  MeQuery: {}
}))

jest.mock('@fluentui/react-components', () => ({
  Card: 'div',
  CardHeader: 'div',
  Text: 'span',
  Table: 'table',
  TableHeader: 'thead',
  TableRow: 'tr',
  TableCell: 'td',
  TableBody: 'tbody',
  makeStyles: () => () => ({
    profilePage: 'mockProfilePageClass',
    container: 'mockContainerClass',
    card: 'mockCardClass',
    table: 'mockTableClass',
    userText: 'mockUserTextClass',
    tableText: 'mockTableTextClass',
    button: 'mockButtonClass',
  }),
}))


const mockUseQuery = jest.requireMock('urql').useQuery

describe('ProfilePage', () => {
  it('displays loading state', () => {
    mockUseQuery.mockReturnValue([{ 
      fetching: true,
      stale: false 
    } as UseQueryState<MeQuery, object>])
    render(<ProfilePage />)
    expect(screen.getByText('Loading User Data...')).toBeInTheDocument()
  })

  it('displays error state', () => {
    const mockError = {
      graphQLErrors: [{ message: 'Test GraphQL error' }],
    }

    mockUseQuery.mockReturnValue([{ 
      fetching: false, 
      stale: false,
      error: mockError
    } as UseQueryState<MeQuery, object>])

    render(<ProfilePage />)
    expect(screen.getByText('Oh no! Error: Test GraphQL error')).toBeInTheDocument()
  })

  it('displays user data when fetched successfully', () => {
    const mockData: MeQuery = {
      me: {
        name: 'John Doe',
        email: 'john@example.com',
        cameras: [
          { id: '1', name: 'Camera 1', niceName: 'Living Room', address: '192.168.1.100' },
          { id: '2', name: 'Camera 2', niceName: 'Bedroom', address: '192.168.1.101' }
        ]
      }
    }
    mockUseQuery.mockReturnValue([{ 
      fetching: false, 
      stale: false,
      data: mockData
    } as UseQueryState<MeQuery, object>])
    render(<ProfilePage />)

    expect(screen.getByText('My Profile')).toBeInTheDocument()
    expect(screen.getByText('Account Info')).toBeInTheDocument()
    expect(screen.getByText('Name: John Doe')).toBeInTheDocument()
    expect(screen.getByText('Email: john@example.com')).toBeInTheDocument()
    expect(screen.getByText('My Cameras')).toBeInTheDocument()
    expect(screen.getByText('Camera 1')).toBeInTheDocument()
    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText('192.168.1.100')).toBeInTheDocument()
    expect(screen.getByText('Camera 2')).toBeInTheDocument()
    expect(screen.getByText('Bedroom')).toBeInTheDocument()
    expect(screen.getByText('192.168.1.101')).toBeInTheDocument()
  })

})