const Joi = require('joi');

function validateData(req, res, next) {
  const schema = Joi.object({
    data: Joi.array().items(
      Joi.string().min(3).regex(/^[a-zA-Z0-9._ %+\-!:?;"'@#$&()\[\]{}\/]*$/i).required(),
      Joi.number().integer().required()
    )
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

module.exports = validateData;