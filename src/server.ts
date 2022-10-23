import app from './app';

const port = process.env.PORT || 3000

try {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message)
  }
}