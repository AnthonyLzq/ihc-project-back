import Joi from 'joi'

const searchSchema = Joi.object().keys({
  keyWord: Joi.string()
    .valid('all', 'blog', 'book', 'tutorial', 'paper', 'video')
    .required(),
  query: Joi.string().required()
})

export { searchSchema }
