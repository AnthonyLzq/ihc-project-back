import httpErrors from 'http-errors'

import { CustomNodeJSGlobal } from '../custom'
import { IUser } from '../models'
import { DtoUser } from '../dto-interfaces'
import { EFU, MFU, GE, errorHandling } from './utils'

declare const global: CustomNodeJSGlobal

type Process = {
  type: 'store' | 'getOne'
}

class User {
  private _args: DtoUser | null
  private _usersRef: FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData
  >


  constructor(args: DtoUser | null = null) {
    this._args = args
    this._usersRef = global.firestoreDB.collection('users')
  }

  // eslint-disable-next-line consistent-return
  public process({
    type
  }: Process): Promise<string> | Promise<IUser> {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'store':
        return this._store()
      case 'getOne':
        return this._getOne()
    }
  }

  private async _store(): Promise<string> {
    const { id, lastName, name } = this._args as DtoUser

    try {
      const foundUser = await this._usersRef.doc(id as string).get()

      if (foundUser)
        throw new httpErrors.Conflict(EFU.ALREADY_REGISTERED)

      await this._usersRef.doc(id as string).set({
        lastName,
        name
      })

      return MFU.REGISTRATION_SUCCESS
    } catch (e) {
      return errorHandling(e, GE.INTERNAL_SERVER_ERROR)
    }
  }

  private async _getOne(): Promise<IUser> {
    const { id } = this._args as DtoUser

    try {
      const user = await this._usersRef.doc(id as string).get()

      if (!user.data())
        throw new httpErrors.NotFound(EFU.NOT_FOUND)

      return {
        ...user.data(),
        id: id as string
      } as IUser
    } catch (e) {
      return errorHandling(e, GE.INTERNAL_SERVER_ERROR)
    }
  }
}

export { User }
