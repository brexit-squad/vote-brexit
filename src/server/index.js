const compression = require('compression')
const express = require('express')
const serverless = require('serverless-http')
const constituencyNames = require('./constituency-names/repository')
const voteRecommendations = require('./vote-recommendations/repository')

const app = express()
app.use(compression())

app.get('/constituency-names', async function ({ query: { postcode } }, res) {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(await constituencyNames.get(postcode), null, 2))
})

app.get('/vote-recommendations', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(await voteRecommendations.get(), null, 2))
}) 

module.exports.handler = serverless(app)