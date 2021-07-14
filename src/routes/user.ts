import { Router, NextFunction } from 'express'

import { Response, Request } from '../custom'
import { response } from  '../utils'
import { User as UserC } from '../controllers/user'
import { DtoUser } from '../dto-interfaces'
import { idUser, userSchema, userSelectCoursesSchema } from '../schemas'

const User = Router()

User.route('/users')
  .post(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { body: { args } } = req
      const u = new UserC(args as DtoUser)

      try {
        await userSchema.validateAsync(args)
        const result = await u.process({ type: 'store' })
        response(false, result, res, 201)
      } catch (e) {
        next(e)
      }
    }
  )

User.route('/user/:id')
  .get(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { params: { id } } = req

      try {
        await idUser.validateAsync(id)
        const u = new UserC({ id } as DtoUser)
        const result = await u.process({ type: 'getOne' })
        response(false, result, res, 200)
      } catch (e) {
        if (e.isJoi) e.status = 422
        next(e)
      }
    }
  )

User.route('/user/selectCourses').patch(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      body: { args }
    } = req

    try {
      await userSelectCoursesSchema.validateAsync(args)
      const u = new UserC(args as DtoUser)
      const result = await u.process({ type: 'selectCourses' })

      response(false, result, res, 200)
    } catch (e) {
      if (e.isJoi) e.status = 422
      next(e)
    }
  }
)

export { User }
