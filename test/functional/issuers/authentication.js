import test from 'ava'
import request from '../../helpers/request'

test('GET /issuers with authentication', async (t) => {
  const { body, statusCode } = await request({
    route: '/issuers',
    method: 'GET',
    headers: {
      'x-api-key': 'abc123',
    },
  })

  t.is(statusCode, 200)
  t.true(Array.isArray(body))
})

test('GET /issuers with invalid authentication', async (t) => {
  const { body, statusCode } = await request({
    route: '/issuers',
    method: 'GET',
    headers: {
      'x-api-key': 'INVALID_KEY',
    },
  })

  t.is(statusCode, 401)
  t.deepEqual(body, {
    errors: [
      {
        field: null,
        message: 'Unauthorized',
        type: 'authorization',
      },
    ],
  })
})

test('GET /issuers without authentication', async (t) => {
  const { body, statusCode } = await request({
    route: '/issuers',
    method: 'GET',
  })

  t.is(statusCode, 401)
  t.deepEqual(body, {
    errors: [
      {
        field: null,
        message: 'Unauthorized',
        type: 'authorization',
      },
    ],
  })
})

