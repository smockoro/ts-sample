import express, { Express, Request, Response } from 'express'
import logger from './logging/logger';
import accessLog from './http/middleware/accessLog';
import compressFilter from './http/middleware/compress';
import prometheusClient from 'prom-client';

const register = new prometheusClient.Registry()
prometheusClient.collectDefaultMetrics({register})
const app: Express = express()

app.use(accessLog)
app.use(compressFilter)

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  let metrics = await register.metrics();
  res.send(metrics);
});

app.get('/', (req: Request, res: Response) => {
  logger.info("hello log message!!")
  res.send({message: "Hello world!"})
})

export default app