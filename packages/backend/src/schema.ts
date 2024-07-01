import { createSchema} from 'graphql-yoga'
import { GraphQLError } from 'graphql'
import { APP_KEY } from './config'
import { UserContext } from './context'
import jwt from 'jsonwebtoken'

const { sign } = jwt;

const typeDefinition = /* GraphQL */ `
    type Query {
        cameras: [Camera!]!
        users: [User!]
        me: User
    }

    type Mutation {
        addCamera(name: String!, niceName: String, address: String!): Camera!
        assignCameraToUser(cameraId: ID!, userId: ID!): User!
        removeCameraFromUser(cameraId: ID!, userId: ID!): User!
        login(email: String!, password: String!): AuthPayload
    }

    type AuthPayload {
        token: String
        user: User
    }

    type User {
        id: ID!
        name: String!
        email: String!
        cameras: [Camera!]
    }

    type Camera {
        id: ID!
        name: String!
        niceName: String
        address: String!
    }
`

type Camera = {
    id: string
    name: string
    niceName?: string
    address: string
}

export type User = {
    id: string
    name: string
    email: String
    password: string // In a real app, this would be a hashed password
    cameras?: Camera[]
}


const cameras: Camera[] = [
    {
        id: '0',
        name: 'A8207-VE MKII',
        address: '192.168.1.101',
    },
    {
        id: '1',
        name: 'I8307-VE',
        niceName: "My Device",
        address: '192.168.1.102',
    },
    {
        id: '2',
        name: 'I8307-VE MKII',
        address: '192.168.1.103',
    }
]

export const users: User[] = [
    {
        id: '0',
        name: 'Andrew',
        email: 'user1@gmail.com',
        password: 'password1234!',
        cameras: []
    },
    {
        id: '1',
        name: 'Mike',
        email: 'user2@gmail.com',
        password: 'password1234!',
        cameras: []
    },
    {
        id: '2',
        name: 'Natalie',
        email: 'user3@gmail.com',
        password: 'password1234!',
        cameras: []
    }
]

const resolvers = {
    Query: {
        cameras: () => cameras,
        users: () => users,
        me: (parent: unknown, args: unknown, context: UserContext) => {
            if(!context.currentUser) {
                return null
            }

            return context.currentUser
        }
    },
    Mutation: {
        addCamera: (parent: unknown, args: Omit<Camera, 'id'>) => {
            const id = cameras.length

            const camera: Camera = {
                id: `${id}`,
                ...args
            }

            cameras.push(camera)

            return camera
        },
        assignCameraToUser: (parent: unknown, args: { cameraId: string, userId: string }) => {
            const user = users.find(user => user.id === args.userId)
            const camera = cameras.find(camera => camera.id === args.cameraId)

            if (!user || !camera) {
                return new GraphQLError('User or Camera not found')
            }

            if(user.cameras.some(assignedCamera => assignedCamera.id === args.cameraId) ) {
                return new GraphQLError('Camera already assigned to user')
            }

            user.cameras.push(camera)

            return user
        },
        removeCameraFromUser: (parent: unknown, args: { cameraId: string, userId: string }) => {
            const user = users.find(user => user.id === args.userId)
            const camera = cameras.find(camera => camera.id === args.cameraId)

            if (!user || !camera) {
                return new GraphQLError('User or Camera not found')
            }

            user.cameras  = user.cameras.filter(camera => camera.id !== args.cameraId)

            return user
        },
        login: (parent: unknown, args: { email: string, password: string }) => {
            //find user with email
            const user = users.find(u => u.email === args.email)

            if (!user || user.password !== args.password) {
                return new GraphQLError('Invalid username or password')
            }

            const token = sign({ userId: user.id }, APP_KEY)

            return { token, user }
        },
    },
    Camera: {
        id: (parent: Camera) => parent.id,
        name: (parent: Camera) => parent.name,
        niceName: (parent: Camera) => parent.niceName,
        address: (parent: Camera) => parent.address
    }
}

export const schema = createSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinition]
})