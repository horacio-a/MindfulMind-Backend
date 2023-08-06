const { CloseAllServis, request, } = require('./helpers/global.helper')
// const {
// } = require('./helpers/CRUDcalendar.helper')


// beforeAll(async () => {
// });


describe('Calenadar', () => {

    test('Empty body for create text ', async () => {
        const response = await request.post('/text/createtext')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');

    });


});



afterAll(() => {
    CloseAllServis()
});