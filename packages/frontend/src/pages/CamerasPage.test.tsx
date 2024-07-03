import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CamerasPage from './CamerasPage'
// import { CombinedQuery, AssignCameraToMeMutation, UnassignCameraFromMeMutation } from '../graphql/queries'

jest.mock('urql', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(() => [{ }, jest.fn()])
}))


jest.mock('../graphql/queries', () => ({
  COMBINED_QUERY: 'mocked COMBINED_QUERY',
  ASSIGN_CAMERA_TO_ME_MUTATION: 'mocked ASSIGN_CAMERA_TO_ME_MUTATION',
  UNASSIGN_CAMERA_FROM_ME_MUTATION: 'mocked UNASSIGN_CAMERA_FROM_ME_MUTATION',
}))


jest.mock('@fluentui/react-components', () => ({
  Card: 'div',
  Text: 'span',
  Button: 'button',
  makeStyles: () => () => ({
    container: 'mockContainerClass',
    card: 'mockCardClass',
    cardContent: 'mockCardContentClass',
    buttonContainer: 'mockButtonContainerClass',
    cameraName: 'mockCameraNameClass',
    niceName: 'mockNiceNameClass',
    address: 'mockAddressClass'
  })
}))

const mockUseQuery = jest.requireMock('urql').useQuery
const mockUseMutation = jest.requireMock('urql').useMutation

describe('CamerasPage', () => {
  beforeEach(() => {
    mockUseQuery.mockReset()
    mockUseMutation.mockReset()
    mockUseMutation.mockReturnValue([{}, jest.fn()])
  })

  it('displays loading state', () => {
    mockUseQuery.mockReturnValue([{ fetching: true }])
    render(<CamerasPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays error state', () => {
    const mockError = {
      graphQLErrors: [{ message: 'Test GraphQL error' }],
    }
    mockUseQuery.mockReturnValue([{ fetching: false, data: undefined, error: mockError }])
    render(<CamerasPage />)
    expect(screen.getByText('Oh no! Error: Test GraphQL error')).toBeInTheDocument()
  })

  it('renders camera data correctly', () => {
    const mockData = {
      cameras: [
        { id: '1', name: 'Camera 1', niceName: 'Living Room', address: '192.168.1.100' },
        { id: '2', name: 'Camera 2', niceName: 'Bedroom', address: '192.168.1.101' }
      ]
    }
    mockUseQuery.mockReturnValue([{ fetching: false, data: mockData, error: undefined }])

    render(<CamerasPage />)

    expect(screen.getByText('All Cameras')).toBeInTheDocument()
    expect(screen.getByText('camera: Camera 1')).toBeInTheDocument()
    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText('ip: 192.168.1.100')).toBeInTheDocument()
    expect(screen.getByText('camera: Camera 2')).toBeInTheDocument()
    expect(screen.getByText('Bedroom')).toBeInTheDocument()
    expect(screen.getByText('ip: 192.168.1.101')).toBeInTheDocument()
  })

  it('handles assign camera mutation', async () => {
    const mockData = {
      cameras: [
        { id: '1', name: 'Camera 1', niceName: 'Living Room', address: '192.168.1.100' }
      ],
      me: { id: 1, cameras: [] }
    }
    mockUseQuery.mockReturnValue([{ fetching: false, data: mockData, error: undefined }])

    const mockAssignMutation = jest.fn().mockResolvedValue({
      data: { 
        assignCameraToMe: {
          id: 1,
          cameras: [{ id: '1' }] 
        }
      }
    })
    mockUseMutation.mockReturnValue([{}, mockAssignMutation])

    render(<CamerasPage />)

    const assignButton = screen.getByText('Assign to Me')
    fireEvent.click(assignButton)

    await waitFor(() => {
      expect(mockAssignMutation).toHaveBeenCalledWith({ cameraId: '1' })
      expect(screen.getByText('Unassign Me')).toBeInTheDocument()
    })
  })

  it('handles unassign camera mutation', async () => {
    const mockData = {
      cameras: [
        { id: '1', name: 'Camera 1', niceName: 'Living Room', address: '192.168.1.100' },
        { id: '2', name: 'Camera 2', niceName: 'Bedroom', address: '192.168.1.101' }
      ],
      me: { id: 1, cameras: [{ id: '1' }] }
    }
    mockUseQuery.mockReturnValue([{ fetching: false, data: mockData, error: undefined }])

    const mockUnassignMutation = jest.fn().mockResolvedValue({
      data: {
        unassignCameraFromMe: {
          id: 1,
          cameras: []
        }
      }
    })
    mockUseMutation.mockReturnValue([{}, mockUnassignMutation])

    render(<CamerasPage />)

    const unassignButton = screen.getByText('Unassign Me')
    fireEvent.click(unassignButton)

    await waitFor(() => {
      expect(mockUnassignMutation).toHaveBeenCalledWith({ cameraId: '1' })
      expect(screen.getAllByText('Assign to Me').length).toBe(2)
    })
  })

})