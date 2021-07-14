import { EFU, MFU } from './user'
import { EFS, MFS } from './syllabus'

enum GenericErrors {
  INTERNAL_SERVER_ERROR = 'Something went wrong'
}

export { EFU, MFU, EFS, MFS, GenericErrors as GE }
