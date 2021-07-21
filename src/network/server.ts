/* eslint-disable max-len */
import express from 'express'
import morgan from 'morgan'
import admin from 'firebase-admin'
import Cbr from 'content-based-recommender-ts'

import { CustomNodeJSGlobal } from '../custom'
import { deleteFile, writeJson } from '../utils'
import { IFirebaseConfig } from '../types'
import { applyRoutes } from './routes'

import { Syllabus } from '../controllers'
import { ISyllabus } from '../models'

declare const global: CustomNodeJSGlobal

type Document = {
  content: string
  id     : string
}

class Server {
  private _app: express.Application

  constructor() {
    this._app = express()
    this._config()
  }

  private _config() {
    this._app.set('port', process.env.PORT ?? '1996')
    this._app.use(morgan('dev'))
    this._app.use(
      express.json({
        limit: '8mb'
      })
    )
    this._app.use(express.urlencoded({ extended: false }))
    this._app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
        res.header('Access-Control-Allow-Origin', '*')
        res.header(
          'Access-Control-Allow-Headers',
          'Authorization, Content-Type'
        )
        next()
      }
    )
    applyRoutes(this._app)
  }

  private async _firebase(): Promise<void> {
    const firebaseConfig: IFirebaseConfig = {
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL as string,
      auth_uri                   : process.env.FIREBASE_AUTH_URI as string,
      client_email               : process.env.FIREBASE_CLIENT_EMAIL as string,
      client_id                  : process.env.FIREBASE_CLIENT_ID as string,
      client_x509_cert_url       : process.env.FIREBASE_CLIENT_X509_CERT_URL as string,
      private_key                : process.env.FIREBASE_PRIVATE_KEY as string,
      private_key_id             : process.env.FIREBASE_PRIVATE_KEY_ID as string,
      project_id                 : process.env.FIREBASE_PROJECT_ID as string,
      token_uri                  : process.env.FIREBASE_TOKEN_URI as string,
      type                       : process.env.FIREBASE_TYPE as string
    }

    await writeJson(
      process.env.GOOGLE_APPLICATION_CREDENTIALS as string,
      JSON.stringify(firebaseConfig).replace(/\\\\/g, '\\'),
      'utf8'
    )

    const app = admin.initializeApp({
      credential: admin.credential.applicationDefault()
    })

    await deleteFile(process.env.GOOGLE_APPLICATION_CREDENTIALS as string)

    global.firestoreDB = admin.firestore(app)
    console.log('Firebase connection established.')
    this._train()
  }

  // eslint-disable-next-line class-methods-use-this
  private async _train(): Promise<void> {
    const syllabus = (await new Syllabus().process({
      type: 'getAll'
    })) as ISyllabus[]
    const documents: Document[] = []

    syllabus.forEach(
      ({
        generalInfo: {
          course: { name, code }
        },
        analyticProgram
      }) => {
        let content = `${name}: `

        analyticProgram?.forEach(({ topic, themes }) => {
          content += `${topic}: `
          themes?.forEach((theme, index) => {
            if (index === themes?.length - 1)
              content += `${theme}.; `
            else
              content += `${theme}, `
          })
        })
        documents.push({
          content: content.slice(0, -2),
          id     : code
        })
      }
    )

    global.recommender = new Cbr()
    global.recommender.train(documents)
  }

  public start(): void {
    this._app.listen(this._app.get('port'), () => {
      console.log(`Server running at port ${this._app.get('port')}`)
    })

    try {
      this._firebase()
    } catch (error) {
      console.error(error)
    }
  }
}

const server = new Server()

export { server as Server }
