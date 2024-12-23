import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(usersRoutes, { prefix: 'users' })
app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({ message: 'Validation error.', issues: error.format() })
    }
    if (env.NODE_ENV !== 'production') {
        console.error(error)
        console.error(error.stack)
    } else {
        // TODO: Here we should log to an external tool like Datadog/NewRelic/Sentry
    }
    return reply.status(500).send({ message: 'Internal Server Error' })
})
