import React, { useState } from 'react'
import { Input, Button, Card, Text, makeStyles } from "@fluentui/react-components"

const useClasses = makeStyles({
  form: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    margin: '10px auto',
    minWidth: '230px',
  },
  card: {
    alignItems: 'center',
    padding: '30px',
  },
  input: {
    minHeight: '38px',
  },
  button: {
    padding: '8px',
    marginTop: '5px',
    backgroundColor: '#2461e1',
    ':hover': {
      backgroundColor: '#3a6cef',
    },
    ':hover:active': {
      backgroundColor: '#4472f6',
    }
  },
  errorMessage: {
    color: '#f22233',
    marginTop: '0px',
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
  },
})

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean, error?: string }>
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const classes = useClasses()
  const [email, setEmail] = useState('user1@gmail.com') // I've set default dummy user for quick login while developing and testing the app
  const [password, setPassword] = useState('password1234!') // same here
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await onLogin(email, password)
    if (!result.success) {
      setErrorMessage(result.error || 'Login failed')
    }
  }

  return (
    <Card className={classes.card}>
      <h2>Welcome</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className={classes.input}
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className={classes.input}
        />
        <Button type="submit" appearance="primary" className={classes.button}>Sign In</Button>
      </form>
      {errorMessage && (
        <Text className={classes.errorMessage}>{errorMessage}</Text>
      )}
    </Card>
  )

}

export default LoginForm