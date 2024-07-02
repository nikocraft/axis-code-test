import { gql } from 'urql'



/** Useful Fragments */
const CAMERA_FRAGMENT = gql`
  fragment CameraFields on Camera {
    id
    name
    niceName
    address
  }
`

const USER_MINIMAL_FRAGMENT = gql`
  fragment UserMinimal on User {
    id
    cameras {
      id
    }
  }
`


/** AuthPage Queries */
export interface LoginMutation {
  login: {
    token: string
    user: {
      id: string
    }
  }
}

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

/* ProfilePage Queries */
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
        ...CameraFields
      }
    }
  }

  ${CAMERA_FRAGMENT}
`


/* CameraPage Queries */
export interface UserWithCameras {
  id: string
  cameras: {
    id: string
  }[]
}

interface CamerasQuery {
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

export interface AssignCameraToMeMutation {
  assignCameraToMe: UserWithCameras
}

export interface UnassignCameraFromMeMutation {
  unassignCameraFromMe: UserWithCameras
}

export interface CombinedQuery {
  cameras: CamerasQuery['cameras']
  me: UserWithCameras
}

// Combined Query to get all cameras and me the logged in user
export const COMBINED_QUERY = gql`
  query CombinedQuery {
    cameras {
      ...CameraFields
    }
    me {
      ...UserMinimal
    }
  }

  ${CAMERA_FRAGMENT}
  ${USER_MINIMAL_FRAGMENT}
`

/* Assign Camera to Me Mutation */
export const ASSIGN_CAMERA_TO_ME_MUTATION = gql`
  mutation AssignCameraToMe($cameraId: ID!) {
    assignCameraToMe(cameraId: $cameraId) {
        ...UserMinimal
    }
  }

  ${USER_MINIMAL_FRAGMENT}
`
/* Unassign Camera from Me Mutation */
export const UNASSIGN_CAMERA_FROM_ME_MUTATION = gql`
  mutation UnassignCameraFromMe($cameraId: ID!) {
    unassignCameraFromMe(cameraId: $cameraId) {
      ...UserMinimal
    }
  }

  ${USER_MINIMAL_FRAGMENT}
`
