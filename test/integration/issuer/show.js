import test from 'ava'
import { assert } from '../../helpers/chai'
import { normalizeHandler } from '../../helpers/normalizer'
import issuerHandler from '../../../src/resources/issuer'

const create = normalizeHandler(issuerHandler.create)
const show = normalizeHandler(issuerHandler.show)

test('show an specific issuer', async (t) => {
  const payload = {
    name: 'bradesco',
    agency: '469',
    account: '4231',
    wallet: '26',
  }

  const { body: createdIssuer } = await create({
    body: payload,
  })

  const { body, statusCode } = await show({
    params: {
      id: createdIssuer.id,
    },
  })

  t.is(statusCode, 200)
  assert.containSubset(body, {
    id: createdIssuer.id,
    account: '4231',
    agency: '469',
    name: 'bradesco',
    object: 'issuer',
    wallet: '26',
  })
})
