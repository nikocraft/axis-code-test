import { 
  Button,
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
    maxWidth: '600px',
  },
  card: {
    padding: '20px',
  },
  table: {
    width: '100%',
  },
  userText: {
    fontSize: '11px',
  },
  tableText: {
    fontSize: '12px',
  },
  button: {
    padding: '8px',
    marginTop: '5px',
    borderRadius: '8px',
    backgroundColor: 'black',
    color: 'white',
    ':hover': {
      backgroundColor: '#222',
      color: 'white',
    }
  },
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
          <Text className={classes.userText}>Name: {user.name}</Text>
          <Text className={classes.userText}>Email: {user.email}</Text>
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
                  <TableCell className={classes.tableText}>{camera.name}</TableCell>
                  <TableCell className={classes.tableText}>{camera.niceName}</TableCell>
                  <TableCell className={classes.tableText}>{camera.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Button onClick={handleLogout} className={classes.button}>Log Me Out</Button>
      </div>
    </div>
  )
}

export default ProfilePage