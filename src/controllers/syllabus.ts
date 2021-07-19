import { firestore } from 'firebase-admin'
import httpErrors from 'http-errors'

import { CustomNodeJSGlobal } from '../custom'
import { DtoSyllabus } from '../dto-interfaces'
import { ISyllabus } from '../models'
import { EFS, GE, errorHandling } from './utils'

declare const global: CustomNodeJSGlobal

type Process = {
  type: 'getAll' | 'getOne' | 'getSome'
}

class Syllabus {
  private _args: DtoSyllabus | null
  private _syllabusRef: firestore.CollectionReference<
    firestore.DocumentData
  >

  constructor(args: DtoSyllabus | null = null) {
    this._args = args
    this._syllabusRef = global.firestoreDB.collection('syllabus')
  }

  // eslint-disable-next-line consistent-return
  public process({ type }: Process): Promise<ISyllabus[]> | Promise<ISyllabus> {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'getAll':
        return this._getAll()
      case 'getOne':
        return this._getOne()
      case 'getSome':
        return this._getSome()
    }
  }

  private async _getAll(): Promise<ISyllabus[]> {
    const allSyllabus: ISyllabus[] = []

    try {
      const syllabus = await this._syllabusRef.get()
      syllabus.docs.map(doc => allSyllabus.push({
        ...doc.data(),
        icon: doc.data().icon ?? null
      } as ISyllabus))

      return allSyllabus
    } catch (e) {
      return errorHandling(e, GE.INTERNAL_SERVER_ERROR)
    }
  }

  private async _getOne(): Promise<ISyllabus> {
    const { id } = this._args as DtoSyllabus

    try {
      const syllabus = await this._syllabusRef.doc(id as string).get()

      if (!syllabus.data())
        throw new httpErrors.NotFound(EFS.NOT_FOUND)

      return {
        ...syllabus.data(),
        icon: syllabus.data()?.icon ?? null
      } as ISyllabus
    } catch (e) {
      return errorHandling(e, GE.INTERNAL_SERVER_ERROR)
    }
  }

  private async _getSome(): Promise<ISyllabus[]> {
    const { ids } = this._args as DtoSyllabus

    try {
      const syllabus = await this._syllabusRef
        .where(firestore.FieldPath.documentId(), 'in', ids as string[])
        .get()

      return syllabus.docs.map(doc => ({ ...doc.data() } as ISyllabus))
    } catch (e) {
      return errorHandling(e, GE.INTERNAL_SERVER_ERROR)
    }
  }
}

export { Syllabus }
