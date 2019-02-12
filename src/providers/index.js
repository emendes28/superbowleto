const {
  always,
  clone,
  cond,
  equals,
  T,
} = require('ramda')
const bradesco = require('./bradesco')
const development = require('./development')
const database = require('../database')
const { NotFoundError } = require('../lib/errors/index')

const { Issuer } = database.models
const { CompanyConfiguration } = database.models

const defaultIssuer = require('../config/issuers')

const findIssuer = async function (parsedBoleto, issuerNameHeader = null) {
  let issuer

  const boleto = clone(parsedBoleto)

  const isNotProduction = process.env.NODE_ENV !== 'production'

  if (isNotProduction && issuerNameHeader) {
    boleto.issuer = issuerNameHeader
    boleto.issuer_account = defaultIssuer.account
    boleto.issuer_agency = defaultIssuer.agency
    boleto.issuer_wallet = defaultIssuer.wallet

    return boleto
  }

  const { company_id: companyId } = boleto

  const queryCompanyConfig = {
    where: {
      company_id: companyId,
    },
  }

  const companyConfiguration = await CompanyConfiguration
    .findOne(queryCompanyConfig)

  if (!companyConfiguration) {
    issuer = await Issuer.findOne({
      where: {
        name: defaultIssuer.name,
      },
    })

    if (!issuer) {
      issuer = await Issuer.create({
        account: defaultIssuer.account,
        agency: defaultIssuer.agency,
        name: defaultIssuer.name,
        wallet: defaultIssuer.wallet,
      })
    }

    await CompanyConfiguration.create({
      company_id: companyId,
      issuer_id: issuer.id,
    })
  }

  if (!issuer) {
    issuer = await Issuer.findOne({
      where: {
        id: companyConfiguration.issuer_id,
      },
    })
  }

  boleto.issuer = issuer.name
  boleto.issuer_account = issuer.account
  boleto.issuer_agency = issuer.agency
  boleto.issuer_id = issuer.id
  boleto.issuer_wallet = issuer.wallet

  return boleto
}

const findProvider = cond([
  [equals('bradesco'), always(bradesco)],
  [equals('development'), always(development)],
  [T, () => {
    throw new NotFoundError({
      message: 'Provider not configured',
    })
  }],
])

module.exports = {
  findIssuer,
  findProvider,
}
