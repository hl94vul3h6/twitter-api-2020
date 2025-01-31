if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const cors = require('cors')
const { apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
}

// app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/api', apis)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
