import fs from 'fs'

const writeJson = (
  path   : string,
  json   : string,
  encrypt: string
): Promise<unknown> => new Promise((resolve, reject) => {
    fs.writeFile(path, json, encrypt, error => {
      if (error) reject(error)
      else resolve('Success')
    })
  })

// eslint-disable-next-line max-len
const deleteFile = (path: string): Promise<unknown> => new Promise((resolve, reject) => {
  fs.unlink(path, error => {
    if (error) reject(error)
    else resolve('Success')
  })
})

export { deleteFile, writeJson }
