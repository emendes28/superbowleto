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

const buildModelResponse = responseObjectBuilder(issuer =>
  Promise.resolve(issuer)
    .then(pick([
      'id',
      'name',
      'agency',
      'account',
      'wallet',
      'created_at',
      'updated_at',
    ]))
    .then(assoc('object', 'issuer')))

const create = database =>
  database.define('Issuer', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: defaultCuidValue('is_'),
    },

    name: {
      type: STRING,
      allowNull: false,
    },

    agency: {
      type: STRING,
      allowNull: false,
    },

    account: {
      type: STRING,
      allowNull: false,
    },

    wallet: {
      type: STRING,
      allowNull: false,
    },
  })

module.exports = {
  buildModelResponse,
  create,
}
