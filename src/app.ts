import express, { Express, Request, Response } from 'express'
import logger from './logging/logger';
import accessLog from './http/middleware/accessLog';
import compressFilter from './http/middleware/compress';
import {Registry, collectDefaultMetrics} from 'prom-client';

const register: Registry = new Registry()
collectDefaultMetrics({register})
const app: Express = express()

// アクセスログフィルタに引っかから内容に手前に持っていく。
// readiness/livenessもここと同様にする。
app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  let metrics = await register.metrics();
  res.send(metrics);
});

app.use(accessLog)
app.use(compressFilter)

app.get('/', (req: Request, res: Response) => {
  logger.info("hello log message!!")
  res.send({message: "Hello world!"})
})

export default app