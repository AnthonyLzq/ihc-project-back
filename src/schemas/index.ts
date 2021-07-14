import Joi from 'joi'

import { userSchema } from './user'

const idUser = Joi.string().length(28).required()
const idSyllabus = Joi.string().length(5).required()

export { idUser, idSyllabus, userSchema }
