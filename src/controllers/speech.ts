import fs from 'fs'
import httpErrors from 'http-errors'
import { RevAiApiClient } from 'revai-node-sdk'

import { DtoSpeech } from '../dto-interfaces'
import { EFSp as EFS, GE, errorHandling } from './utils'
import { deleteFile } from '../utils'

type Process = {
  type: 'toWav'
}

class Speech {
  private _args: DtoSpeech | null

  constructor(args: DtoSpeech | null = null) {
    this._args = args
  }

  // eslint-disable-next-line consistent-return
  public process({ type }: Process): Promise<string> {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'toWav':
        return this._toWav()
    }
  }

  private async _toWav(): Promise<string> {
    const client = new RevAiApiClient(process.env.TOKEN as string)
    const { base64 } = this._args as DtoSpeech

    try {
      const fileName = `file-${Date.now()}-${Math.floor(Math.random()*10)}.wav`
      const filePath = process.env.MODE as string === 'prod'
        ? `${__dirname}/${fileName}`
        : `${__dirname}/../utils/${fileName}`
      const buffer = Buffer.from(base64, 'base64')
      await new Promise((resolve, reject) => {
        fs.writeFile(
          filePath,
          buffer,
          error => {
            if (error) {
              deleteFile(filePath)
              reject(
                new httpErrors.InternalServerError(EFS.WAV_ERROR)
              )
            } else resolve('Success')
          }
        )
      })
      const job = await client.submitJobLocalFile(filePath, {})
      let jobDetails = await client.getJobDetails(job.id)
      await new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          jobDetails = await client.getJobDetails(job.id)

          if (jobDetails.status !== 'in_progress') {
            clearInterval(interval)
            if (jobDetails.status === 'failed') {
              deleteFile(filePath)
              reject(
                new httpErrors.InternalServerError(EFS.TRANSCRIBE)
              )
            } else
              resolve('Success')
          }
        }, 500)
      })
      deleteFile(filePath)
      const text = await client.getTranscriptObject(job.id)

      return text.monologues[0].elements.reduce<string>((acc, e) => {
        if (e.value) acc += e.value

        return acc
      }, '')
    } catch (e) {
      return errorHandling(e, GE.INTERNAL_SERVER_ERROR)
    }
  }
}

export { Speech }
