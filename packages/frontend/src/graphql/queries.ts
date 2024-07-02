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

export const CAMERA_FRAGMENT = gql`
  fragment CameraFields on Camera {
    id
    name
    niceName
    address
  }
`

export interface CamerasQuery {
  cameras: {
    id: string
    name: string
    niceName?: string
    address: string
  }[]
}

export const CAMERAS_QUERY = gql`
  query Cameras {
    cameras {
      ...CameraFields
    }
  }
`

export const ME_MINIMAL_FRAGMENT = gql`
  fragment MeMinimal on User {
    id
    cameras {
      id
    }
  }
`

export interface CombinedQuery {
  cameras: CamerasQuery['cameras']
  me: {
    id: string
    cameras: {
      id: string
    }[]
  }
}

export const COMBINED_QUERY = gql`
  query CombinedQuery {
    cameras {
      ...CameraFields
    }
    me {
      ...MeMinimal
    }
  }

  ${CAMERA_FRAGMENT}
  ${ME_MINIMAL_FRAGMENT}
`

export interface AssignCameraToMeMutation {
  assignCameraToMe: {
    id: string
    cameras: {
      id: string
    }[]
  }
}

export const ASSIGN_CAMERA_TO_ME_MUTATION = gql`
  mutation AssignCameraToMe($cameraId: ID!) {
    assignCameraToMe(cameraId: $cameraId) {
      id
      cameras {
        id
      }
    }
  }
`

export interface UnassignCameraFromMeMutation {
  unassignCameraFromMe: {
    id: string
    cameras: {
      id: string
    }[]
  }
}

export const UNASSIGN_CAMERA_FROM_ME_MUTATION = gql`
  mutation UnassignCameraFromMe($cameraId: ID!) {
    unassignCameraFromMe(cameraId: $cameraId) {
      id
      cameras {
        id
      }
    }
  }
`
