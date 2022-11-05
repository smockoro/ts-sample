import Fastify, { FastifyInstance } from 'fastify'
import {pingPath, pingOpts, pingController } from './adapter/http/route/ping'
import { loggerConfig } from "./logging/logger";
import { SystemError } from "./core/error/error";

export default function buildFastify() {
  const fastify: FastifyInstance = Fastify({logger: loggerConfig})

  fastify.get(pingPath, pingOpts, pingController)

  fastify.setErrorHandler(function (error: Error, request, reply) {
    fastify.log.error(error)
    if (error instanceof SystemError) {
      fastify.log.error(`${error.code}, ${error.message}`)
    }
    reply.status(500).send({'message': "unexpected error occur."})
  })
  fastify.addHook('onError', async (req, rep, error) => {
    fastify.log.error("onError Section")
    fastify.log.error(error)
    rep.header("X-Custom-Header", "onError")
  })

  return fastify
}