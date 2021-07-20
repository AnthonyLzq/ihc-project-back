import { Router, NextFunction } from 'express'

import { Response, Request } from '../custom'
import { response } from '../utils'
import { Speech as SpeechC } from '../controllers'
import { DtoSpeech } from '../dto-interfaces'

const Speech = Router()

Speech.route('/speech').post(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      body: { args }
    } = req

    try {
      const s = new SpeechC(args as DtoSpeech)
      const result = await s.process({ type: 'toMp3' })

      response(false, result, res, 200)
    } catch (e) {
      if (e.isJoi) e.status = 422
      next(e)
    }
  }
)

export { Speech }
