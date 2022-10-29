// @ts-ignore
import supertest from 'supertest';
import buildFastify from '../../../src/app';
import { pingPath } from "../../../src/adapter/http/route/ping";

describe('ping path check', () => {
  const fastify = buildFastify()

  beforeAll(() => {
    fastify.ready();
  })

  beforeEach(() => {
  })

  test('return pong', async () => {
    return await supertest(fastify.server)
      .get(pingPath)
      .then((reply) => {
        expect(reply.status).toBe(200)
        expect(reply.body.pong).toBe("it worked!!")
      })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    fastify.close()
  })
})

