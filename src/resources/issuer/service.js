const Promise = require('bluebird')
const { makeFromLogger } = require('../../lib/logger')
const database = require('../../database')
const { handleDatabaseErrors } = require('../../lib/errors/database')
const { NotFoundError } = require('../../lib/errors')
const { getPaginationQuery } = require('../../lib/database/pagination')
const { mergeAll } = require('ramda')

const makeLogger = makeFromLogger('issuer/service')

const { Issuer } = database.models

const service = ({ operationId }) => {
  const create = (data) => {
    const logger = makeLogger(
      { operation: 'handle_issuer_request' },
      { id: operationId }
    )

    logger.info({ status: 'started', metadata: { data } })

    return Promise.resolve(data)
      .then(Issuer.create.bind(Issuer))
      .tap((issuer) => {
        logger.info({ status: 'success', metadata: { issuer } })
      })
      .catch((err) => {
        logger.error({
          status: 'failed',
          metadata: {
            error_name: err.name,
            error_stack: err.stack,
            error_message: err.message,
          },
        })
        return handleDatabaseErrors(err)
      })
  }

  const index = ({
    page,
    count,
    name,
  }) => {
    const whereQuery = {
      where: {
      },
    }

    const orderQuery = {
      order: [['id', 'DESC']],
    }

    const possibleFields = { name }

    // eslint-disable-next-line no-restricted-syntax
    for (const field in possibleFields) {
      if (possibleFields[field]) {
        whereQuery.where[field] = possibleFields[field]
      }
    }

    const paginationQuery = getPaginationQuery({ page, count })

    const query = mergeAll([
      {},
      paginationQuery,
      whereQuery,
      orderQuery,
    ])

    return Issuer.findAll(query)
      .catch(handleDatabaseErrors)
  }

  const show = (id) => {
    const query = {
      where: {
        id,
      },
    }

    return Issuer.findOne(query)
      .then((issuer) => {
        if (!issuer) {
          throw new NotFoundError({
            message: 'Issuer not found',
          })
        }

        return issuer
      })
      .catch(handleDatabaseErrors)
  }

  const update = (data) => {
    const logger = makeLogger({ operation: 'update' }, { id: operationId })
    logger.info({ status: 'started', metadata: { data } })

    const { id, name: issuerName } = data

    const query = {
      where: {
        id,
      },
    }

    return Issuer.findOne(query)
      .then((issuer) => {
        if (!issuer) {
          throw new NotFoundError({
            message: 'Issuer not found',
          })
        }

        return issuer.update({
          name: issuerName,
        })
      })
      .tap((issuer) => {
        logger.info({ status: 'success', metadata: { issuer } })
      })
      .catch(handleDatabaseErrors)
  }

  return {
    create,
    index,
    show,
    update,
  }
}

module.exports = service
