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

export interface AllCamerasQuery {
  cameras: {
    id: string
    name: string
    niceName?: string
    address: string
  }[]
}

export const ALL_CAMERAS_QUERY = gql`
  query AllCameras {
    cameras {
      id
      name
      niceName
      address
    }
  }
`

export interface AssignCameraToMeMutation {
  assignCameraToMe: {
    id: string
    cameras: {
      id: string
      name: string
      niceName?: string
      address: string
    }[]
  }
}

export const ASSIGN_CAMERA_TO_ME_MUTATION = gql`
  mutation AssignCameraToMe($cameraId: ID!) {
    assignCameraToMe(cameraId: $cameraId) {
      id
      cameras {
        id
        name
        niceName
        address
      }
    }
  }
`