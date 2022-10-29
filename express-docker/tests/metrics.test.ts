import request from "supertest";
import app from "../src/app";


describe('/metrics path check', () => {
  test('/metrics response check', async () => {
    return request(app)
      .get('/metrics')
      .then((res) => {
        expect(res.status).toBe(200)
        expect(res.type).toBe('text/plain')
        expect(res.text.length).toBeGreaterThan(10) // ここは正直勘。後でいいテスト方法を考える。
      })
  })
})