import fs from "node:fs";
import path from "node:path";

import { promisify } from "node:util";
import { pipeline } from "node:stream";
import { randomUUID } from "node:crypto";

import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart'

const pump = promisify(pipeline)

export async function PostUploadVideoRoute(app: FastifyInstance){
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25 // 1mb * 25 = 25mb
    }
  })

  app.post('/videos', async (req, res) => {
    const data = await req.file()

    if (!data) {
      return res.status(400).send({error: 'Missing file input. / Arquivo ausente.'})
    }

    const extension = path.extname(data.filename)

    if(extension !== '.mp3') {
      return res.status(400).send({
        error: 'Invalid input type, please upload  a MP3. / Tipo de entrada inválido, faça o upload de um MP3.'
      })
    }

    const fileBaseName = path.basename(data.filename, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

    const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

    await pump(data.file, fs.createWriteStream(uploadDestination))

    return res.send('foi')
  })
}