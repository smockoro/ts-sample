import {Registry, collectDefaultMetrics} from 'prom-client';
import { Request, Response } from 'express';

const register: Registry = new Registry()
collectDefaultMetrics({register})

const metricsHandler = async (req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  let metrics = await register.metrics();
  res.send(metrics);
}

export default metricsHandler