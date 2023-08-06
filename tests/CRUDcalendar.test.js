const { server, restartRoutineJob } = require('../app')
const pool = require('../models/db')
const CloseAllServis = require('./helpers/global.helper')
const {
    request,
    dataForSimpleNotification,
    dataForMultipleNotification,
    RestartRoutine
} = require('./helpers/CRUDcalendar.helper')


beforeAll(async () => {
    await RestartRoutine()
});





afterAll(() => {
    CloseAllServis()

});