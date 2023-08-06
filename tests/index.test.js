const { server, restartRoutineJob } = require('../app')
const pool = require('../models/db')
const { CloseAllServis, request, } = require('./helpers/global.helper')
const {
    dataForSimpleNotification,
    dataForMultipleNotification,
    RestartRoutine
} = require('./helpers/index.helper')


beforeAll(async () => {
    await RestartRoutine()
});



describe('SendNotification', () => {
    test('empty body for SendNotification', async () => {
        const response = await request.post('/SendNotification')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe('Empty body');
    })

    test.skip('send a simple notification', async () => {
        const response = await request.post('/SendNotification').send(dataForSimpleNotification)
        expect(response.status).toBe(200);
        response.body.forEach(element => {
            expect(element.status).toBe('ok');
        });
    })

    test.skip('send a multiple notification', async () => {
        const response = await request.post('/SendNotification').send(dataForMultipleNotification)
        expect(response.status).toBe(200);
        response.body.forEach(element => {
            expect(element.status).toBe('ok');
        });
    })
});

describe('RestartRoutine', () => {


    test('Success example', async () => {
        const response = await request.get('/restartRoutine')
        expect(response.status).toBe(200);
        expect(response.body.request).toBe(true);
        expect(response.body.response.changedRows).toBe(5);
    });


});


afterAll(() => {
    CloseAllServis

});