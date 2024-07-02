import { useQuery, useMutation } from 'urql'
import { 
  COMBINED_QUERY, 
  CombinedQuery,
  ASSIGN_CAMERA_TO_ME_MUTATION,
  AssignCameraToMeMutation,
  UNASSIGN_CAMERA_FROM_ME_MUTATION,
  UnassignCameraFromMeMutation
} from '../graphql/queries'
import { Card, Text, Button, makeStyles } from "@fluentui/react-components"

const useClasses = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: '20px',
  },
  card: {
    width: 'calc(33.33% - 14px)',
    minWidth: '200px',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 0 5px 0',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0 0 0',
  },
  cameraName: {
    fontSize: '10px',
  },
  niceName: {
    fontWeight: 'bold',
    fontSize: '18px',
    // marginTop: '15px',
  },
  address: {
    fontSize: '9px',
  }
})

const CamerasPage = () => {
  const classes = useClasses()
  const [result, reexecuteCombinedQuery] = useQuery<CombinedQuery>({ query: COMBINED_QUERY })
  const [assignResult, assignCameraToMe] = useMutation<AssignCameraToMeMutation>(ASSIGN_CAMERA_TO_ME_MUTATION)
  const [unassignResult, unassignCameraFromMe] = useMutation<UnassignCameraFromMeMutation>(UNASSIGN_CAMERA_FROM_ME_MUTATION)

  const { data, fetching, error } = result

  if (fetching) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const assignedCameraIds = new Set(data?.me.cameras.map(camera => camera.id))


  const handleAssign = async (cameraId: string) => {
    try {
      await assignCameraToMe({ cameraId })
      reexecuteCombinedQuery()
    } catch (error) {
      console.error('Failed to assign camera:', error)
    }
  }

  const handleUnassign = async (cameraId: string) => {
    try {
      await unassignCameraFromMe({ cameraId })
      // Refetch query to update the UI
      reexecuteCombinedQuery()
    } catch (err) {
      console.error('Failed to unassign camera:', err)
      // Handle error (e.g., show an error message to the user)
    }
  }

  return (
    <div>
      <h2>All Cameras</h2>
      <div className={classes.container}>
        {data?.cameras.map((camera) => {
          const isAssigned = assignedCameraIds.has(camera.id)
          return (
            <Card key={camera.id} className={classes.card}>
              <div className={classes.cardContent}>
                <Text className={classes.cameraName}>camera: {camera.name}</Text>
                <Text className={classes.niceName}>{camera.niceName || 'No nice name'}</Text>
                <Text className={classes.address}>ip: {camera.address}</Text>
                <div className={classes.buttonContainer}>
                  <Button 
                    onClick={() => isAssigned ? handleUnassign(camera.id) : handleAssign(camera.id)} 
                    disabled={assignResult.fetching || unassignResult.fetching}
                  >
                    {assignResult.fetching || unassignResult.fetching 
                      ? 'Processing...' 
                      : isAssigned ? 'Unsubscribe' : 'Subscribe to'}
                    </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default CamerasPage