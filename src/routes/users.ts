import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/users/errors/user-already-exists-error'
import { RegisterUseCase } from '@/use-cases/users/register'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
    app.get('/', async (req, res) => {
        const users = await prisma.user.findMany()
        res.send(users)
    })

    app.get('/:id', async (request, reply) => { })

    app.put('/:id', async (request, reply) => { })
    app.delete('/:id', async (request, reply) => { })
    app.patch('/:id', async (request, reply) => { })
    // Register a new user
    app.post('/', async (request, reply) => {
        const registerBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6),
        })

        const { name, email, password } = registerBodySchema.parse(request.body)
        try {
            const usersRepository = new PrismaUsersRepository()
            const registerUserUseCase = new RegisterUseCase(usersRepository)
            await registerUserUseCase.execute({ name, email, password })
            reply.status(201).send()
        } catch (err: unknown) {
            if (err instanceof UserAlreadyExistsError) {
                return reply.status(err.statusCode).send({ message: err.message })
            }
            return reply.status(500).send({ message: 'Internal Server Error' })
        }
    })
}
