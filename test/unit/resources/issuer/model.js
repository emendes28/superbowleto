import test from 'ava'
import {
  buildModelResponse,
} from '../../../../src/resources/issuer/model'

test('buildResponse', async (t) => {
  const now = new Date()

  const input = {
    id: 'is_cizec1xk2000001nyml04gwxp',
    name: 'bradesco',
    account: '1229',
    agency: '469',
    wallet: '26',
    created_at: now,
    updated_at: now,
  }

  const output = await buildModelResponse(input)

  t.deepEqual(output, {
    object: 'issuer',
    id: 'is_cizec1xk2000001nyml04gwxp',
    name: 'bradesco',
    account: '1229',
    agency: '469',
    wallet: '26',
    created_at: now,
    updated_at: now,
  }, 'should be an issuer object')
})
