import { Firestore } from '@google-cloud/firestore'
import ContentBaseRecommender from 'content-based-recommender-ts'

interface CustomNodeJSGlobal extends NodeJS.Global {
  firestoreDB: Firestore
  recommender: ContentBaseRecommender
}

export { CustomNodeJSGlobal }
