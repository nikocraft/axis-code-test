import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Button, makeStyles, tokens } from '@fluentui/react-components'
import { useAuth } from '../context/AuthContext'

const useStyles = makeStyles({
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f0f0f0',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
  },
  navLink: {
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    padding: '0.5rem 1rem',
    borderRadius: tokens.borderRadiusMedium,
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: "#ccc",
      color: tokens.colorNeutralForeground1Hover,
    },
  },
  container: {
    display: 'flex',
    width: '700px',
    minHeight: '700px',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
    // maxWidth: '600px',
  },
})

const MainLayout = () => {
  const styles = useStyles()
  const navigate = useNavigate()
  const { deleteAuthToken } = useAuth()

  const handleLogout = () => {
    deleteAuthToken()
    navigate('/auth')
  }

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          <Link className={styles.navLink} to="/cameras">Cameras</Link>
          <Link className={styles.navLink} to="/profile">Profile</Link>
        </div>
        <Button onClick={handleLogout}>Logout</Button>
      </nav>
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout