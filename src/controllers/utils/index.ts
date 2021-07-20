/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
import httpErrors from 'http-errors'

import { EFU, MFU, EFS, MFS, EFSp, MFSp, GE } from './messages'

const errorHandling = (error: any, message?: string): never => {
  console.error(error)

  if (error instanceof httpErrors.HttpError)
    throw error

  throw new httpErrors.InternalServerError(message ?? error.message)
}

export { EFU, MFU, EFS, MFS, EFSp, MFSp, GE, errorHandling }
