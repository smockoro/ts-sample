import app from './app';
import { Server } from 'http';

const port = process.env.PORT || 3000

let server: Server;

function closeGracefully(signal: string | number | undefined) {
  server.close(() => {
    console.log('Process terminated.')
  })
  process.kill(process.pid, signal)
}

try {
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message)
  }
}

process.on('SIGTERM', closeGracefully)