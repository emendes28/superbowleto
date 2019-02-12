import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import issuerHandler from '../../../src/resources/issuer'

const create = normalizeHandler(issuerHandler.create)
const update = normalizeHandler(issuerHandler.update)

test('updates an issuer with invalid data', async (t) => {
  const payload = {
    name: 'bradesco',
    agency: '469',
    account: '4231',
    wallet: '26',
  }

  const { body: createdIssuer } = await create({
    body: payload,
  })

  const { body, statusCode } = await update({
    params: {
      id: createdIssuer.id,
    },
    body: {
      agency: '470',
    },
  })

  t.is(statusCode, 400)
  assert.containSubset(body, {
    errors: [
      {
        type: 'invalid_parameter',
        message: '"name" is required',
        field: 'name',
      },
      {
        type: 'invalid_parameter',
        message: '"agency" is not allowed',
        field: 'agency',
      },
    ],
  })
})

test('updates an issuer with valid data', async (t) => {
  const payload = {
    name: 'bradesc0',
    agency: '469',
    account: '4231',
    wallet: '26',
  }

  const { body: createdIssuer } = await create({
    body: payload,
  })

  const { body, statusCode } = await update({
    params: {
      id: createdIssuer.id,
    },
    body: {
      name: 'bradesco',
    },
  })

  t.is(statusCode, 200)
  t.true(typeof body.id === 'string')
  assert.containSubset(body, {
    account: '4231',
    agency: '469',
    name: 'bradesco',
    object: 'issuer',
    wallet: '26',
  })
})
