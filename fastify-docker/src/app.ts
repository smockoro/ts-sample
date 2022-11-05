import Fastify, { FastifyInstance } from 'fastify'
import {pingPath, pingOpts, pingController } from './adapter/http/route/ping'
import { loggerConfig } from "./logging/logger";
import { metricsHandler, metricsPath } from "./adapter/http/actuator/metrics";

export default function buildFastify() {
  const fastify: FastifyInstance = Fastify({logger: loggerConfig})

  fastify.get(pingPath, pingOpts, pingController)
  fastify.get(metricsPath, metricsHandler)

  return fastify
}