const {
  DATE,
  STRING,
} = require('sequelize')

module.exports = {
  up: queryInterface => queryInterface.createTable('CompanyConfigurations', {
    id: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
    },

    issuer_id: {
      type: STRING,
      allowNull: false,
    },

    company_id: {
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

  down: queryInterface => queryInterface.dropTable('CompanyConfigurations'),
}
