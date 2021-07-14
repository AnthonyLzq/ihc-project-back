import { Router, NextFunction } from 'express'

import { Response, Request } from '../custom'
import { response } from '../utils'
import { Syllabus as SyllabusC } from '../controllers'
import { DtoSyllabus } from '../dto-interfaces'
import { idSyllabus } from '../schemas'

const Syllabus = Router()

Syllabus.route('/syllabus').get(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const s = new SyllabusC()
      const result = await s.process({ type: 'getAll' })
      response(false, result, res, 200)
    } catch (e) {
      if (e.isJoi) e.status = 422
      next(e)
    }
  }
)

Syllabus.route('/syllabus/:id').get(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      params: { id }
    } = req

    try {
      await idSyllabus.validateAsync(id)
      const s = new SyllabusC({ id } as DtoSyllabus)
      const result = await s.process({ type: 'getOne' })
      response(false, result, res, 200)
    } catch (e) {
      if (e.isJoi) e.status = 422
      next(e)
    }
  }
)

export { Syllabus }
