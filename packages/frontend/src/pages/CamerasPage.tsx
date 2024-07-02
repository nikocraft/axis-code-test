import { useQuery, useMutation } from 'urql'
import { 
  ALL_CAMERAS_QUERY,
  AllCamerasQuery,
  ASSIGN_CAMERA_TO_ME_MUTATION,
  AssignCameraToMeMutation
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
  const [result] = useQuery<AllCamerasQuery>({ query: ALL_CAMERAS_QUERY })
  const [assignResult, assignCameraToMe] = useMutation<AssignCameraToMeMutation>(ASSIGN_CAMERA_TO_ME_MUTATION)

  const { data, fetching, error } = result
  
  // keeping this part simple...
  if (fetching) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>


  const handleAssign = async (cameraId: string) => {
    try {
      await assignCameraToMe({ cameraId })
    } catch (error) {
      console.error('Failed to assign camera:', error)
    }
  }

  return (
    <div>
      <h2>All Cameras</h2>
      <div className={classes.container}>
        {data?.cameras.map((camera) => (
          <Card key={camera.id} className={classes.card}>
            <div className={classes.cardContent}>
              <Text className={classes.cameraName}>camera: {camera.name}</Text>
              <Text className={classes.niceName}>{camera.niceName || 'No nice name'}</Text>
              <Text className={classes.address}>ip: {camera.address}</Text>
              <div className={classes.buttonContainer}>
                <Button onClick={() => handleAssign(camera.id)} disabled={assignResult.fetching}>{assignResult.fetching ? 'Assigning...' : 'Assign to Me'}</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CamerasPage