const { server, restartRoutineJob } = require('../../app')
const pool = require('../../models/db')

const { app } = require('../../app')
const supertest = require('supertest')
const request = supertest(app)


function CloseAllServis() {
    server.close();
    pool.end()
    restartRoutineJob.cancel()
}

module.exports = { CloseAllServis, request }
