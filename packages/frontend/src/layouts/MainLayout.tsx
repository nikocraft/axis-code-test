import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, makeStyles, tokens } from '@fluentui/react-components'
import { useAuth } from '../context/AuthContext'

const useClasses = makeStyles({
  appContainer: {
    marginTop: '50px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f0f0f0',
  },
  navLinks: {
    display: 'flex',
    gap: '16px'
  },
  navLink: {
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    padding: '8px 16px',
    borderRadius: tokens.borderRadiusMedium,
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Pressed,
      color: tokens.colorNeutralForeground1Hover,
    },
  },
  activeNavLink: {
    backgroundColor: tokens.colorNeutralBackground2Pressed,
    color: tokens.colorNeutralForeground1Hover,
  },
  container: {
    display: 'flex',
    width: '700px',
    minHeight: '700px',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
  },
})

const MainLayout = () => {
  const classes = useClasses()
  const navigate = useNavigate()
  const location = useLocation()
  const { deleteAuthToken } = useAuth()

  const handleLogout = () => {
    deleteAuthToken()
    navigate('/auth')
  }
  
  const isActive = (path: string) => location.pathname === path

  return (
    <div className={classes.appContainer}>
      <nav className={classes.navbar}>
        <div className={classes.navLinks}>
          <Link className={`${classes.navLink} ${isActive('/cameras') ? classes.activeNavLink : ''}`} to="/cameras">Cameras</Link>
          <Link className={`${classes.navLink} ${isActive('/profile') ? classes.activeNavLink : ''}`}  to="/profile">Profile</Link>
        </div>
        <Button onClick={handleLogout}>Logout</Button>
      </nav>
      <div className={classes.container}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout