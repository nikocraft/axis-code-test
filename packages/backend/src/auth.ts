import jwt from 'jsonwebtoken'
import { User, users } from './schema'
import { APP_KEY } from './config'

const { verify } = jwt

export async function authenticateUser(request: Request): Promise<User | null> {
  const header = request.headers.get('authorization')

  if (!header || !header.startsWith('Bearer ')) {
    console.log('No valid authorization header')
    return null
  }

  const token = header.split(' ')[1]

  if (!token) {
    console.log('No token provided')
    return null
  }

  try {
    const tokenPayload = verify(token, APP_KEY) as jwt.JwtPayload
    const userId = tokenPayload.userId

    // find incoming userId in users array
    const user: User = users.find(user => user.id === userId)
    if (user) {
      return user
    } else {
      console.log('User not found')
    }

  } catch (error) {
    console.error('Token verification failed:', error)
  }

  return null
}