import test from 'ava'
import { merge } from 'ramda'
import { assert } from '../../helpers/chai'
import { findIssuer } from '../../../src/providers'
import { mock } from '../../helpers/boleto'

test('findIssuer: ', async (t) => {
  const boleto = await findIssuer(mock)
  const boletoWithIssuer = merge(mock, {
    issuer: 'development',
    issuer_account: '1234',
    issuer_agency: '123',
    issuer_wallet: '13',
  })

  t.true(boleto.issuer_id != null)
  t.true(typeof boleto.issuer_id === 'string')
  assert.containSubset(boleto, boletoWithIssuer, 'should return the boleto with issuer information')
})
