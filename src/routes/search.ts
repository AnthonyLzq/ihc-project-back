import { Router, NextFunction } from 'express'

import { Response, Request } from '../custom'
import { response } from '../utils'
import { Search as SearchC } from '../controllers'
import { DtoSearch } from '../dto-interfaces'
import { searchSchema } from '../schemas'

const Search = Router()

Search.route('/search').post(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      body: { args }
    } = req

    try {
      await searchSchema.validateAsync(args)
      const s = new SearchC(args as DtoSearch)
      const result = await s.process({ type: 'query' })

      response(false, result, res, 200)
    } catch (e) {
      if (e.isJoi) e.status = 422
      next(e)
    }
  }
)

export { Search }
