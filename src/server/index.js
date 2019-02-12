const express = require('express')
const bodyParser = require('body-parser')

const { authentication } = require('../middlewares/authentication')
const boleto = require('../resources/boleto')
const issuer = require('../resources/issuer')
const { defaultResourceHandler } = require('../resources')
const redirectHttp = require('../middlewares/redirect-http')

const app = express()
const allRoutesExceptHealthCheck = /^\/(?!_health_check(\/|$)).*$/i


app.use(bodyParser.json())

app.disable('x-powered-by')
app.get('/robots.txt', (req, res) => res.send(200, 'User-Agent: *\nDisallow: /'))
app.get('/_health_check', (req, res) => res.send(200))
app.use(allRoutesExceptHealthCheck, redirectHttp)

app.use('/boletos', authentication)
app.post('/boletos', boleto.create)
app.get('/boletos', boleto.index)
app.get('/boletos/:id', boleto.show)
app.patch('/boletos/:id', boleto.update)
app.all('/boletos', boleto.defaultHandler)

app.use('/issuers', authentication)
app.post('/issuers', issuer.create)
app.get('/issuers', issuer.index)
app.get('/issuers/:id', issuer.show)
app.patch('/issuers/:id', issuer.update)
app.all('/issuers', issuer.defaultHandler)

app.all('*', defaultResourceHandler)

module.exports = app
