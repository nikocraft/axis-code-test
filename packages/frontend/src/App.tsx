import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components"
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <FluentProvider theme={teamsLightTheme}>
        <Router>
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/profile" : "/auth"} />} 
            />
            <Route 
              path="/auth" 
              element={isAuthenticated ? <Navigate to="/profile" /> : <AuthPage />} />
            <Route
              path="/profile"
              element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />}
            />
          </Routes>
        </Router>
    </FluentProvider>
  )
}

export default App
