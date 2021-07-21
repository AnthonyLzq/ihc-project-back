import { Router, NextFunction } from 'express'

import { Response, Request } from '../custom'
import { response } from '../utils'
import { Recommender as RecommenderC } from '../controllers'
import { DtoRecommender } from '../dto-interfaces'
import { idsSyllabus } from '../schemas'

const Recommender = Router()

Recommender.route('/recommender').post(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      body: { args }
    } = req
    const { selectedCourses } = args as DtoRecommender
    console.log(selectedCourses)

    try {
      await idsSyllabus.validateAsync(selectedCourses)
      const r = new RecommenderC(args as DtoRecommender)
      const result = await r.process({ type: 'getTopRecommendations' })

      response(false, result, res, 200)
    } catch (e) {
      if (e.isJoi) e.status = 422
      next(e)
    }
  }
)

export { Recommender }
