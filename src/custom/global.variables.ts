import { Firestore } from '@google-cloud/firestore'

interface CustomNodeJSGlobal extends NodeJS.Global {
  firestoreDB: Firestore
}

export { CustomNodeJSGlobal }
