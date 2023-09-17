import { fastify } from 'fastify'

// Routes
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { PostUploadVideoRoute } from './routes/post-upload-video'

const app = fastify()

app.register(getAllPromptsRoute)
app.register(PostUploadVideoRoute)

app.listen({
  port: 3333
}).then(() => {
  console.log('listening on port 3333')
})