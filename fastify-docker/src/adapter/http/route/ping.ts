import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';

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
  return { pong: "it worked!!" }
}