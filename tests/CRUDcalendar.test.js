const { server, restartRoutineJob } = require('../app')
const pool = require('../models/db')
const CloseAllServis = require('./helpers/CRUDcalendar.helper')
const {
    request,
    dataForSimpleNotification,
    dataForMultipleNotification,
    RestartRoutine
} = require('./helpers/index.helper')


beforeAll(async () => {
});





afterAll(() => {
    CloseAllServis()

});