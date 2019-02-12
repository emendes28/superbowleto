import test from 'ava'
import { is } from 'ramda'
import { assert } from '../../helpers/chai'
import request from '../../helpers/request'
import { mock, userQueueUrl } from '../../helpers/boleto'

test('PATCH /boletos/:id', async (t) => {
  const { body: { id } } = await request({
    route: '/boletos',
    method: 'POST',
    data: mock,
    headers: {
      'x-api-key': 'abc123',
    },
  })

  const { body, statusCode } = await request({
    route: `/boletos/${id}`,
    method: 'PATCH',
    data: {
      paid_amount: 1234,
      bank_response_code: '4321',
    },
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 200)
  t.true(is(Object, body))
  t.true(body.issuer_id != null)
  t.true(typeof body.issuer_id === 'string')

  assert.containSubset(body, {
    paid_amount: 1234,
    bank_response_code: '4321',
    object: 'boleto',
    id,
    status: 'registered',
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'development',
    payer_name: 'David Bowie',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872',
    queue_url: userQueueUrl,
    company_name: 'Some Company',
    company_document_number: '98154524872',
    company_id: 'xy7sftybfjsc78',
  }, 'result must have the shape of a boleto')
})

test('PATCH /boletos/:id with invalid parameters', async (t) => {
  const { body: { id } } = await request({
    route: '/boletos',
    method: 'POST',
    data: mock,
    headers: {
      'x-api-key': 'abc123',
    },
  })

  const { body, statusCode } = await request({
    route: `/boletos/${id}`,
    method: 'PATCH',
    data: {
      paid_amount: 1234,
      bank_response_code: '4321',
      amount: 5000,
      company_id: 'cantpassonupdate',
    },
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 400)
  t.true(is(Object, body))

  t.deepEqual(body, {
    errors: [
      {
        type: 'invalid_parameter',
        message: '"amount" is not allowed',
        field: 'amount',
      },
      {
        type: 'invalid_parameter',
        message: '"company_id" is not allowed',
        field: 'company_id',
      },
    ],
  })
})

test('PATCH /boletos/:id with invalid id', async (t) => {
  const INVALID_ID = 'INVALID_ID'

  const { body, statusCode } = await request({
    route: `/boletos/${INVALID_ID}`,
    method: 'PATCH',
    data: {
      paid_amount: 1234,
      bank_response_code: '4321',
    },
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 404)
  t.true(is(Object, body))

  t.deepEqual(body, {
    errors: [
      {
        type: 'not_found',
        message: 'Boleto not found',
        field: null,
      },
    ],
  })
})
