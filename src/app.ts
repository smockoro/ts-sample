import express, { Express, Request, Response } from 'express'
import logger from './logging/logger';
import accessLog from './http/middleware/accessLog';

const app: Express = express()

app.use(accessLog)

app.get('/', (req: Request, res: Response) => {
  logger.info("hello log message!!")
  res.send({message: "Hello world!"})
})

export default app