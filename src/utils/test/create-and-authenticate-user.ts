import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password',
  })
  const authResponse = await request(app.server).post('/sessions').send({
    email: 'john@example.com',
    password: 'password',
  })

  const { token } = authResponse.body
  return { token }
}
