import Joi from 'joi'

const userSchema = Joi.object().keys({
  id      : Joi.string().length(28).required(),
  lastName: Joi.string().required(),
  name    : Joi.string().required()
})

export { userSchema }
