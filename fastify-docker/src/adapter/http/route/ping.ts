import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { SystemError } from "../../../core/error/error";

export const pingPath: string = '/ping'
export const pingOpts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}

export const pingController = async (request: FastifyRequest, reply: FastifyReply) => {
  throw new SystemError('E111')
  return { pong: "it worked!!" }
}