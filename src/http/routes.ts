import { FastifyInstance } from 'fastify'

import { profile } from '@/http/controllers/profile'
import { usersRoutes } from './controllers/users'
import { authenticateRoutes } from './controllers/authenticate'
import { verifyJwt } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.register(usersRoutes, { prefix: 'users' })
  app.register(authenticateRoutes, { prefix: 'sessions' })

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
