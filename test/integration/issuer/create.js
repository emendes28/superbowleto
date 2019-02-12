import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import issuerHandler from '../../../src/resources/issuer'

const create = normalizeHandler(issuerHandler.create)

test('creates an issuer with invalid data', async (t) => {
  const payload = {
    name: 10,
    agency: '469',
  }

  const { body, statusCode } = await create({
    body: payload,
  })

  t.is(statusCode, 400)
  assert.containSubset(body, {
    errors: [{
      type: 'invalid_parameter',
      message: '"account" is required',
      field: 'account',
    }, {
      type: 'invalid_parameter',
      message: '"wallet" is required',
      field: 'wallet',
    }, {
      type: 'invalid_parameter',
      message: '"name" must be a string',
      field: 'name',
    }],
  })
})

test('creates an issuer with valid data', async (t) => {
  const payload = {
    name: 'bradesco',
    account: '4231',
    agency: '469',
    wallet: '26',
  }

  const { body, statusCode } = await create({
    body: payload,
  })

  t.is(statusCode, 201)
  t.true(typeof body.id === 'string')
  assert.containSubset(body, {
    name: payload.name,
    account: payload.account,
    agency: payload.agency,
    wallet: payload.wallet,
  })
})
