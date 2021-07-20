import Joi from 'joi'

import { userSchema, userSelectCoursesSchema } from './user'
import { searchSchema } from './search'

const idUser = Joi.string().length(28).required()
const idSyllabus = Joi.string().length(5).required()
const idsSyllabus = Joi.array().items(idSyllabus).min(3).max(5).required()

export {
  idUser,
  idSyllabus,
  idsSyllabus,
  userSchema,
  userSelectCoursesSchema,
  searchSchema
}
