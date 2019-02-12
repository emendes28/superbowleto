const Joi = require('joi')

const createSchema = {
  name: Joi
    .string()
    .required(),

  agency: Joi
    .string()
    .required(),

  account: Joi
    .string()
    .required(),

  wallet: Joi
    .string()
    .required(),
}

const updateSchema = {
  id: Joi
    .string()
    .required(),

  name: Joi
    .string()
    .required(),
}

const indexSchema = {
  name: Joi
    .string(),

  page: Joi
    .number()
    .integer(),

  count: Joi
    .number()
    .integer(),
}

module.exports = {
  createSchema,
  updateSchema,
  indexSchema,
}
