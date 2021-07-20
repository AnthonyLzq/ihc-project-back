import { EFU, MFU } from './user'
import { EFS, MFS } from './syllabus'
import { EFS as EFSp, MFS as MFSp } from './speech'

enum GenericErrors {
  INTERNAL_SERVER_ERROR = 'Something went wrong'
}

export { EFU, MFU, EFS, MFS, EFSp, MFSp, GenericErrors as GE }
