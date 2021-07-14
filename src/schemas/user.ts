import Joi from 'joi'

const id = Joi.string().length(28).required()

const userSchema = Joi.object().keys({
  id,
  lastName: Joi.string().required(),
  name    : Joi.string().required()
})

const userSelectCoursesSchema = Joi.object().keys({
  id,
  selectedCourses: Joi.array().min(3).max(5).items(Joi.string()).required()
})

export { userSchema, userSelectCoursesSchema }
