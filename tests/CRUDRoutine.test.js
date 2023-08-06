const { server, restartRoutineJob } = require('../app')
const pool = require('../models/db')
const { CloseAllServis, request, } = require('./helpers/global.helper')
const {
    RestartRoutine, tasksForInsert,
} = require('./helpers/CRUDRoutine.helper')


beforeAll(async () => {
    RestartRoutine()
});


describe('Routine', () => {

    test('empty body for create task ', async () => {
        const response = await request.post('/routine/newtask')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });

    test('Success create task ', async () => {
        const response = await request.post('/routine/newtask').send(tasksForInsert)
        expect(response.status).toBe(200);
        expect(response.body.tasksName).toBe(tasksForInsert.title);
        expect(response.body.user).toBe(tasksForInsert.user);
        expect(response.body.Orden).toBe(4);
    });


});


afterAll(() => {
    CloseAllServis()

});