// @ts-ignore
import supertest from "supertest";
import buildFastify from "../../../src/app";


describe('/metrics path check', () => {
  const fastify = buildFastify()

  beforeAll(() => {
    fastify.ready()
  })

  test('/metrics response check', async () => {
    return await supertest(fastify.server)
      .get('/metrics')
      .then((reply) => {
        expect(reply.status).toBe(200)
        expect(reply.type).toBe('text/plain')
        expect(reply.text.length).toBeGreaterThan(10) // ここは正直勘。後でいいテスト方法を考える。
      })
  })

  afterAll(() => {
    fastify.close()
  })
})