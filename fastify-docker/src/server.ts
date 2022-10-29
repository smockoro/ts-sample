import buildFastify from './app'

const fastify = buildFastify()

const start = async () => {
  try {
    await fastify.listen({port: 3000})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
