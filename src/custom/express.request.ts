import { Request } from 'express'
import { DtoUser, DtoSyllabus } from '../dto-interfaces'

/*
 * With this piece of code we ca personalize the attributes of the request,
 * in case we need it.
 */

interface CustomRequest extends Request {
  body: {
    args?: DtoUser | DtoSyllabus
  }
}

export { CustomRequest as Request }
