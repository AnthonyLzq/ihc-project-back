import { DocumentScore } from 'content-based-recommender-ts'
import { firestore } from 'firebase-admin'

import { CustomNodeJSGlobal } from '../custom'
import { DtoRecommender } from '../dto-interfaces'
import { ISyllabus } from '../models'
import { GE, errorHandling } from './utils'

declare const global: CustomNodeJSGlobal

type Process = {
  type: 'getTopRecommendations'
}

class Recommender {
  private _args: DtoRecommender | null

  constructor(args: DtoRecommender | null = null) {
    this._args = args
  }

  // eslint-disable-next-line consistent-return
  public process({ type }: Process): unknown {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'getTopRecommendations':
        return this._getTopRecommendations()
    }
  }

  private async _getTopRecommendations(): Promise<ISyllabus[]> {
    const { selectedCourses } = this._args as DtoRecommender

    try {
      const recommendations = selectedCourses.reduce<DocumentScore[]>(
        (acc, id) => {
          acc.push(...global.recommender.getSimilarDocuments(id, 0, 3))

          return acc
        },
        []
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, selectedCourses.length + 1)
      .map(ds => ds.id)

      const syllabus = await global.firestoreDB
        .collection('syllabus')
        .where(firestore.FieldPath.documentId(), 'in', recommendations)
        .get()

      return syllabus.docs.map(doc => ({ ...doc.data() } as ISyllabus))
    } catch (e) {
      return errorHandling(e, GE.INTERNAL_SERVER_ERROR)
    }
  }
}

export { Recommender }
