import { Router, NextFunction } from 'express'

import { Response, Request } from '../custom'
import { response } from '../utils'
import { Speech as SpeechC } from '../controllers'
import { DtoSpeech } from '../dto-interfaces'
import { speech } from '../schemas'

const Speech = Router()

Speech.route('/speech').post(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      body: { args }
    } = req
    const { base64 } = args as DtoSpeech

    try {
      await speech.validateAsync(base64)
      const s = new SpeechC(args as DtoSpeech)
      const result = await s.process({ type: 'toWav' })

      response(false, result, res, 200)
    } catch (e) {
      if (e.isJoi) e.status = 422
      next(e)
    }
  }
)

export { Speech }
