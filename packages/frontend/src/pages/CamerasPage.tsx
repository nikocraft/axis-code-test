import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'urql'
import { 
  COMBINED_QUERY, 
  CombinedQuery,
  ASSIGN_CAMERA_TO_ME_MUTATION,
  AssignCameraToMeMutation,
  UNASSIGN_CAMERA_FROM_ME_MUTATION,
  UnassignCameraFromMeMutation,
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
  const [{ data, fetching, error }] = useQuery<CombinedQuery>({ query: COMBINED_QUERY })
  const [, assignCameraToMe] = useMutation<AssignCameraToMeMutation>(ASSIGN_CAMERA_TO_ME_MUTATION)
  const [, unassignCameraFromMe] = useMutation<UnassignCameraFromMeMutation>(UNASSIGN_CAMERA_FROM_ME_MUTATION)
  const [assignedCameraIds, setAssignedCameraIds] = useState<Set<string>>(new Set())
  const [processingCameraId, setProcessingCameraId] = useState<string | null>(null)

  useEffect(() => {
    if (data?.me) {
      setAssignedCameraIds(new Set(data.me.cameras.map(camera => camera.id)))
    }
  }, [data])

  if (fetching) return <p>Loading...</p>

  if (error) {
    const errorMessage = error.graphQLErrors[0]?.message || error.message
    return <p>Oh no! Error: {errorMessage}</p>
  }

  const handleAssign = async (cameraId: string) => {
    setProcessingCameraId(cameraId)
    try {
      const result = await assignCameraToMe({ cameraId })
      if (result.data) {
        setAssignedCameraIds(new Set(result.data.assignCameraToMe.cameras.map(camera => camera.id)))
      }
    } catch (error) {
      console.error('Failed to assign camera:', error)
    } finally {
      setProcessingCameraId(null)
    }
  }

  const handleUnassign = async (cameraId: string) => {
    setProcessingCameraId(cameraId)
    try {
      const result = await unassignCameraFromMe({ cameraId })
      if (result.data) {
        setAssignedCameraIds(new Set(result.data.unassignCameraFromMe.cameras.map(camera => camera.id)))
      }
    } catch (err) {
      console.error('Failed to unassign camera:', err)
    } finally {
      setProcessingCameraId(null)
    }
  }

  return (
    <div>
      <h2>All Cameras</h2>
      <div className={classes.container}>
        {data?.cameras.map((camera) => {
          const isAssigned = assignedCameraIds.has(camera.id)
          const isLoading = processingCameraId === camera.id
          return (
            <Card key={`camera-${camera.id}`} className={classes.card}>
              <div className={classes.cardContent}>
                <Text className={classes.cameraName}>camera: {camera.name}</Text>
                <Text className={classes.niceName}>{camera.niceName || 'No nice name'}</Text>
                <Text className={classes.address}>ip: {camera.address}</Text>
                <div className={classes.buttonContainer}>
                  <Button 
                    onClick={() => isAssigned ? handleUnassign(camera.id) : handleAssign(camera.id)} 
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? 'Saving...' 
                      : isAssigned 
                        ? 'Unassign Me' 
                        : 'Assign to Me'
                    }
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