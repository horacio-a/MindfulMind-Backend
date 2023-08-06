const { server, restartRoutineJob } = require('../app')
const pool = require('../models/db')
const { CloseAllServis, request, } = require('./helpers/global.helper')
const {
    dataForInsert,
    RestartText,
    dataForUpdate,
    dataForDelete
} = require('./helpers/CRUDText.helper')


beforeAll(async () => {
    RestartText()
});

describe('Text', () => {

    test('Empty body for create text ', async () => {
        const response = await request.post('/text/createtext')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });

    test('success create text ', async () => {
        const response = await request.post('/text/createtext').send(dataForInsert)
        expect(response.status).toBe(200);
        expect(response.body.response).toStrictEqual([dataForInsert.data]);
    });

    test('Empty body for UpdateText', async () => {
        const response = await request.post('/text/updatetext')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });

    test('success UpdateText', async () => {
        const response = await request.post('/text/updatetext').send(dataForUpdate)
        expect(response.status).toBe(200);
        expect(response.body.response).toStrictEqual([dataForUpdate.data]);
    });

    test('Empty body for delete', async () => {
        const response = await request.post('/text/deleteText')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });


    test('success Delete text', async () => {
        const response = await request.post('/text/deleteText').send(dataForDelete)
        expect(response.status).toBe(200);
        expect(response.body.data).toStrictEqual(dataForDelete.data);
        const confirmationForDelete = await request.get(`/getdata/text/${dataForDelete.data.user}`)
        expect(confirmationForDelete.body).toStrictEqual([]);
    });

});



afterAll(() => {
    CloseAllServis()

});