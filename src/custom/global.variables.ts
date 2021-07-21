import { Firestore } from '@google-cloud/firestore'
import Cbr from 'content-based-recommender-ts'

const recommender = new Cbr()

interface CustomNodeJSGlobal extends NodeJS.Global {
  firestoreDB: Firestore
  recommender: typeof recommender
}

export { CustomNodeJSGlobal }
