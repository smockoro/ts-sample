import {Registry, collectDefaultMetrics} from 'prom-client';
import { FastifyReply, FastifyRequest } from "fastify";

const register: Registry = new Registry()
collectDefaultMetrics({register})

export const metricsPath: string = '/metrics'
export const metricsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  let metrics = await register.metrics();
  reply.send(metrics);
}