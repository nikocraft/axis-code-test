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
        login(email: String!, password: String!): AuthPayload!
        assignCameraToMe(cameraId: ID!): User!
        unassignCameraFromMe(cameraId: ID!): User!
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
        niceName: "Roof Device",
        name: 'A8207-VE MKII',
        address: '192.168.1.101',
    },
    {
        id: '1',
        name: 'I8307-VE',
        niceName: "Basement Device",
        address: '192.168.1.102',
    },
    {
        id: '2',
        name: 'I8307-VE MKII',
        niceName: "Garage Camera",
        address: '192.168.1.103',
    },
    {
        id: '3',
        name: 'A8207-VE MKII',
        niceName: "Front Camera",
        address: '192.168.1.104',
    },
    {
        id: '4',
        name: 'I8307-VE',
        niceName: "Back Camera",
        address: '192.168.1.105',
    },
    {
        id: '5',
        niceName: "Main Entry",
        name: 'I8307-VE MKII',
        address: '192.168.1.106',
    },
    {
        id: '6',
        name: 'A8207-VE MKII',
        niceName: "Front Camera 2",
        address: '192.168.1.104',
    },
    {
        id: '7',
        name: 'I8307-VE',
        niceName: "Back Camera 3",
        address: '192.168.1.105',
    },
    {
        id: '8',
        name: 'I8307-VE MKII',
        address: '192.168.1.106',
    },
    {
        id: '9',
        name: 'A8207-VE MKII',
        niceName: "Front Camera 4",
        address: '192.168.1.107',
    },
    {
        id: '10',
        name: 'I8307-VE',
        niceName: "Back Camera 2",
        address: '192.168.1.108',
    },
    {
        id: '11',
        name: 'I8307-VE MKII',
        address: '192.168.1.109',
    },
    {
        id: '12',
        name: 'A8207-VE MKII',
        niceName: "Front Camera 5",
        address: '192.168.1.110',
    },
    {
        id: '13',
        name: 'I8307-VE',
        niceName: "Back Camera 2",
        address: '192.168.1.111',
    },
    {
        id: '14',
        name: 'I8307-VE MKII',
        address: '192.168.1.112',
    },
    {
        id: '15',
        name: 'A8207-VE MKII',
        niceName: "Front Camera 2",
        address: '192.168.1.113',
    },
    {
        id: '16',
        name: 'I8307-VE',
        niceName: "Back Camera 4",
        address: '192.168.1.114',
    },
    {
        id: '17',
        name: 'I8307-VE',
        niceName: "Back Camera 5",
        address: '192.168.1.115',
    },
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
        assignCameraToMe: (parent: unknown, args: { cameraId: string }, context: UserContext) => {
            if (!context.currentUser) {
                throw new GraphQLError('You must be logged in to assign a camera')
            }

            const user = users.find(u => u.id === context.currentUser.id)
            if (!user) {
                throw new GraphQLError('User not found')
            }

            const camera = cameras.find(camera => camera.id === args.cameraId)

            if (!camera) {
                throw new GraphQLError('Camera not found')
            }

            if (user.cameras.some(c => c.id === args.cameraId)) {
                throw new GraphQLError('Camera already assigned')
            }

            user.cameras.push(camera)
            return user
        },
        unassignCameraFromMe: (parent: unknown, args: { cameraId: string }, context: UserContext) => {
            if (!context.currentUser) {
                throw new GraphQLError('You must be logged in to remove a camera')
            }

            const user = users.find(u => u.id === context.currentUser.id)
            if (!user) {
                throw new GraphQLError('User not found')
            }

            const camera = cameras.find(camera => camera.id === args.cameraId)

            if (!camera) {
                throw new GraphQLError('Camera not found')
            }

            user.cameras = user.cameras.filter(camera => camera.id !== args.cameraId)
            return user
        },
        assignCameraToUser: (parent: unknown, args: { cameraId: string, userId: string }) => {
            const user = users.find(user => user.id === args.userId)
            const camera = cameras.find(camera => camera.id === args.cameraId)

            if (!user || !camera) {
                throw new GraphQLError('User or Camera not found')
            }

            if(user.cameras.some(assignedCamera => assignedCamera.id === args.cameraId) ) {
                throw new GraphQLError('Camera already assigned to user')
            }

            user.cameras.push(camera)

            return user
        },
        removeCameraFromUser: (parent: unknown, args: { cameraId: string, userId: string }) => {
            const user = users.find(user => user.id === args.userId)
            const camera = cameras.find(camera => camera.id === args.cameraId)

            if (!user || !camera) {
                throw new GraphQLError('User or Camera not found')
            }

            user.cameras = user.cameras.filter(camera => camera.id !== args.cameraId)

            return user
        },
        login: (parent: unknown, args: { email: string, password: string }) => {
            //find user with email
            const user = users.find(u => u.email === args.email)

            if (!user || user.password !== args.password) {
                throw new GraphQLError('Invalid username or password')
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
    },
    User: {
        id: (parent: User) => parent.id,
        name: (parent: User) => parent.name
    }
}

export const schema = createSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinition]
})