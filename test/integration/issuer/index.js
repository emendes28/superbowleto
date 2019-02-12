import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import issuerHandler from '../../../src/resources/issuer'

const create = normalizeHandler(issuerHandler.create)
const index = normalizeHandler(issuerHandler.index)

test('list issuers', async (t) => {
  const payload = {
    name: 'bradesco',
    agency: '469',
    account: '4231',
    wallet: '26',
  }

  await create({
    body: payload,
  })

  const { body, statusCode } = await index({})

  t.is(statusCode, 200)
  assert.containSubset(body, [{
    account: '4231',
    agency: '469',
    name: 'bradesco',
    object: 'issuer',
    wallet: '26',
  }])
})
