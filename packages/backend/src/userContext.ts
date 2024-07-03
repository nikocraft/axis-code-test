import { YogaInitialContext } from 'graphql-yoga'

import { User } from './schema'
import { authenticateUser } from './auth'

export type UserContext = {
  currentUser: User | null
}
 
export async function createUserContext(initialContext: YogaInitialContext): Promise<UserContext> {
  return {currentUser: await authenticateUser(initialContext.request)}
}