const fetch = require('node-fetch')
const memoize = require("memoize-one")
const pipe = require("p-pipe")
const config = require("../config")

const { authority, path, sheet, range } = config.spreadsheet
const url = `${authority}${path}/${sheet}/values/${range}?key=${process.env.GOOGLE_SHEETS_KEY}`

const networkCall = async () => await fetch(url)

const fromJSON = async (response) => await response.json()

const transform = ({ values }) => 
  values.reduce((p, [constituencyName, candidateName, partyCode], i) => 
    ((p[constituencyName] = { candidateName, partyCode }), p), {})

const getAll = memoize(pipe(networkCall, fromJSON, transform))

const get = (constituencyName) => 
  constituencyName ? getAll()[constituencyName] : getAll()

module.exports = { get }