import { gql } from 'urql'

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`

export interface MeQuery {
  me: {
    name: string
    email: string
    cameras: {
      id: string
      name: string
      niceName?: string
      address: string
    }[]
  }
}

export const ME_QUERY = gql`
  query Me {
    me {
      name
      email
      cameras {
        id
        name
        niceName
        address
      }
    }
  }
`