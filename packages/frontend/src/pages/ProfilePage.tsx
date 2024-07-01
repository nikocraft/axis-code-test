import { 
  Card,
  CardHeader,
  Text,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody } from "@fluentui/react-components"
import { makeStyles } from "@fluentui/react-components"
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'urql'
import { ME_QUERY, MeQuery } from '../graphql/queries'

const useClasses = makeStyles({
  profilePage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 20px 25px 20px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
    maxWidth: '800px',
  },
  card: {
    padding: '20px',
  },
  table: {
    width: '100%',
  },
  text: {
    fontSize: '12px',
  }
})

const ProfilePage = () => {
  const navigate = useNavigate()
  const classes = useClasses()
  const [result] = useQuery<MeQuery>({ query: ME_QUERY })
  const { deleteAuthToken } = useAuth()

  const { data, fetching, error } = result

  // keeping this part really simple...
  if (fetching) return <Text>Loading User Data...</Text>
  if (error) return <Text>Oh no! Error: {error.message}</Text>

  const user = data?.me

  if (!user) return <Text>No user data available</Text>

  const handleLogout = () => {
    deleteAuthToken()
    navigate('/auth')
  }

  return (
    <div className={classes.profilePage}>
      <h2>My Profile Page</h2>

      <div className={classes.container}>
        <Card className={classes.card}>
          <CardHeader 
            header={
              <Text weight="semibold" size={500}>User Info</Text>
            } 
          />
          <Text className={classes.text}>Name: {user.name}</Text>
          <Text className={classes.text}>Email: {user.email}</Text>
        </Card>

        <Card className={classes.card}>
          <CardHeader 
            header={
            <Text weight="semibold" size={500}>Cameras</Text>
            }
          />
          <Table className={classes.table}>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Nice Name</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.cameras.map((camera) => (
                <TableRow key={camera.id}>
                  <TableCell>{camera.name}</TableCell>
                  <TableCell>{camera.niceName}</TableCell>
                  <TableCell>{camera.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <button onClick={handleLogout}>Log Me Out</button>
      </div>
    </div>
  )
}

export default ProfilePage