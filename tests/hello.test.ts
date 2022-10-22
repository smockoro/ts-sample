import request from 'supertest';
import app from "../src/app";


describe('root path check', () => {
  test('return hello world message', async () => {
    return request(app)
      .get('/')
      .then((res) => {
        expect(res.status).toBe(200)
        expect(res.body.message).toBe("Hello world!")
      })
  })
})