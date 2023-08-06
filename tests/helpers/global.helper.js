const { server, restartRoutineJob } = require('../../app')
const pool = require('../../models/db')

function CloseAllServis() {
    server.close();
    pool.end()
    restartRoutineJob.cancel()
}

module.exports = CloseAllServis
