const { server, restartRoutineJob, sendNotificationJob } = require('../../app')
const pool = require('../../models/db')

const { app } = require('../../app')
const supertest = require('supertest')
const request = supertest(app)


function CloseAllServis() {
    server.close();
    pool.end()
    restartRoutineJob.cancel()
    sendNotificationJob.cancel()
}

module.exports = { CloseAllServis, request }
