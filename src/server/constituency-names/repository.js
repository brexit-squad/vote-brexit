const fetch = require('node-fetch')
const memoize = require("memoize-one")
const pipe = require("p-pipe")
const config = require("../config")

const { authority, path } = config.theyworkforyou
const URL_BASE = `${authority}${path}?key=${process.env.THEY_WORK_FOR_YOU_KEY}`

const url = (_, postcode) => `${URL_BASE}&postcode=${postcode}`

const networkCall = async (postcode) =>  await fetch(url`${postcode}`)

const fromJSON = async (response) => await response.json()

const transform = ({ name }) => name

const get = memoize(pipe(networkCall, fromJSON, transform))

module.exports = { get }