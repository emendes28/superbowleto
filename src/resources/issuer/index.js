const Promise = require('bluebird')
const { createSchema, updateSchema, indexSchema } = require('./schema')
const IssuerService = require('./service')
const { buildModelResponse } = require('./model')
const { defaultCuidValue } = require('../../lib/database/schema')
const { makeFromLogger } = require('../../lib/logger')
const { buildSuccessResponse, buildFailureResponse } = require('../../lib/http/response')
const { parse } = require('../../lib/http/request')
const {
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  InternalServerError,
} = require('../../lib/errors')

const makeLogger = makeFromLogger('issuer/index')

const handleError = (err) => {
  if (err instanceof ValidationError) {
    return buildFailureResponse(400, err)
  }

  if (err instanceof NotFoundError) {
    return buildFailureResponse(404, err)
  }

  if (err instanceof MethodNotAllowedError) {
    return buildFailureResponse(405, err)
  }

  return buildFailureResponse(500, new InternalServerError())
}

const create = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = IssuerService({ operationId: requestId })

  const logger = makeLogger({ operation: 'handle_issuer_request' }, { id: requestId })

  return Promise.resolve(req.body)
    .then(parse(createSchema))
    .then(service.create)
    .then(buildModelResponse)
    .then(buildSuccessResponse(201))
    .tap((response) => {
      logger.info({
        status: 'success',
        metadata: { body: response.body, statusCode: response.statusCode },
      })
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
      return handleError(err)
    })
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

const update = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = IssuerService({ operationId: requestId })

  const { params: { id } } = req

  return Promise.resolve({ id, ...req.body })
    .then(parse(updateSchema))
    .then(service.update)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

const index = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = IssuerService({ operationId: requestId })

  const { query } = req

  return Promise.resolve(query)
    .then(parse(indexSchema))
    .then(service.index)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

const show = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const service = IssuerService({ operationId: requestId })

  const { params: { id } } = req

  return Promise.resolve(id)
    .then(service.show)
    .then(buildModelResponse)
    .then(buildSuccessResponse(200))
    .catch(handleError)
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

const defaultHandler = (req, res) => {
  const requestId = req.get('x-request-id') || defaultCuidValue('req_')()
  const logger = makeLogger({ operation: 'handle_default_issuer_request' }, { id: requestId })

  return Promise.reject(new MethodNotAllowedError({
    message: `${req.method} method is not allowed for issuer resource`,
  }))
    .catch((err) => {
      logger.error({
        status: 'failed',
        metadata: {
          error_name: err.name,
          error_stack: err.stack,
          error_message: err.message,
        },
      })
      return handleError(err)
    })
    .tap(({ body, statusCode }) => res.status(statusCode).send(body))
}

module.exports = {
  create,
  defaultHandler,
  index,
  show,
  update,
}
