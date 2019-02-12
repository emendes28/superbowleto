const {
  DATE,
  STRING,
} = require('sequelize')

module.exports = {
  up: queryInterface => queryInterface.createTable('Issuers', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
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

    created_at: {
      type: DATE,
      allowNull: false,
    },

    updated_at: {
      type: DATE,
      allowNull: false,
    },
  }),

  down: queryInterface => queryInterface.dropTable('Issuers'),
}
