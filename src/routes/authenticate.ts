import { InvalidCredentialsError } from '@/use-cases/users/errors/invalid-credentials-error'
import { makeAuthenticateUserUseCase } from '@/use-cases/users/factories/make-authenticate-use-case'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function authenticateRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)
    try {
      const autenticateUserUseCase = makeAuthenticateUserUseCase()
      await autenticateUserUseCase.execute({ email, password })
      return reply.status(200).send()
    } catch (err: unknown) {
      if (err instanceof InvalidCredentialsError) {
        return reply.status(err.statusCode).send({ message: err.message })
      }

      throw err
    }
  })
}
