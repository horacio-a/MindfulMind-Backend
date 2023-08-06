const { server, restartRoutineJob } = require('../app')
const pool = require('../models/db')
const { CloseAllServis, request, } = require('./helpers/global.helper')
const {
    dataForSimpleNotification,
    dataForMultipleNotification,
    RestartRoutine
} = require('./helpers/CRUDText.helper')


beforeAll(async () => {
    await RestartRoutine()
});





afterAll(() => {
    CloseAllServis()

});