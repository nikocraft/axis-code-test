import { makeStyles } from "@fluentui/react-components"
import LoginForm from '../components/LoginForm'
import { useMutation } from 'urql'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LOGIN_MUTATION } from '../graphql/queries'

const useClasses = makeStyles({
  authPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: '#2461e1'
  },
  card: {
    margin: "auto",
    width: "420px",
    maxWidth: "100%",
  },
})

const AuthPage = () => {
  const classes = useClasses()
  const navigate = useNavigate()
  const [, loginMutation] = useMutation(LOGIN_MUTATION)
  const { saveAuthToken } = useAuth()

  const handleLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await loginMutation({ email, password })
      if (result.data?.login?.token) {
        saveAuthToken(result.data.login.token)
        navigate('/profile')
        return { success: true }
      } else if (result.error) {
        const graphQLError = result.error.graphQLErrors[0]
        return { 
          success: false, 
          error: graphQLError ? graphQLError.message : 'An unexpected error occurred'
        }
      }
      // If we reach here, it means we didn't get a token or an error
      return { success: false, error: 'Login failed' }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  return (
    <div className={classes.authPage}>
        <LoginForm onLogin={handleLogin}/>
    </div>
  )
}

export default AuthPage