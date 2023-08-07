const { CloseAllServis, request, } = require('./helpers/global.helper')
const {
    calanderCreate,
    responseForCreate,
    resetCalendar,
} = require('./helpers/CRUDcalendar.helper')


beforeAll(async () => {
    await resetCalendar()
});


describe('Calendar', () => {

    test('Empty body for create calendar tasks ', async () => {
        const response = await request.post('/calendar/create')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });

    test('Success create calendar tasks ', async () => {
        const response = await request.post('/calendar/create').send(calanderCreate)
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(responseForCreate);
    });

});



afterAll(() => {
    CloseAllServis()
});