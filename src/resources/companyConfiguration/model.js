const Promise = require('bluebird')
const { STRING } = require('sequelize')
const {
  assoc,
  pick,
} = require('ramda')
const {
  defaultCuidValue,
  responseObjectBuilder,
} = require('../../lib/database/schema')

const buildModelResponse = responseObjectBuilder(CompanyConfiguration =>
  Promise.resolve(CompanyConfiguration)
    .then(pick([
      'id',
      'issuer_id',
      'company_id',
      'created_at',
      'updated_at',
    ]))
    .then(assoc('object', 'CompanyConfiguration')))

const create = database =>
  database.define('CompanyConfiguration', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: defaultCuidValue('cc_'),
    },

    issuer_id: {
      type: STRING,
      allowNull: false,
    },

    company_id: {
      type: STRING,
      allowNull: false,
    },
  })

module.exports = {
  buildModelResponse,
  create,
}
