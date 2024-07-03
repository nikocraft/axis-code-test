import { schema } from "./schema"
import { createYoga } from "graphql-yoga"
import { createServer } from "node:http"
import { createUserContext } from './userContext'

const yoga = createYoga({ schema, context: createUserContext })
const server = createServer(yoga)

server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql')
})