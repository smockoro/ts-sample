import buildFastify from './app'

const fastify = buildFastify()

const start = async () => {
  try {
    await fastify.listen({port: 3000}, () => {
      fastify.log.debug(fastify.printPlugins())
      fastify.log.debug(fastify.printRoutes())
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
