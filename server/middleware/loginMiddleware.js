const Joi = require('@hapi/joi')

function loginMiddleware (req, res, next) {

  const schema = Joi.object().keys({
    userName: Joi.string().min(1).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  }).with('userName', 'password');

  const { error } = schema.validate(req.body.data[0])
  if (error) {
    switch (error.details[0].context.key) {
      case 'userName':
        res.status(400).json({
          msg: 'You must provide a valid username'
        })
        break
      case 'password':
        res.status(400).json({
          msg: `The password must be at least 5 characters`
        })
        break
      default:
        res.status(400).send({
          error: 'Invalid registration information'
        })
    }
  } else {
    next()
  }
}

module.exports = loginMiddleware