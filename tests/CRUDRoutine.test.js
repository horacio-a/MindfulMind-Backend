const { server, restartRoutineJob } = require('../app')
const pool = require('../models/db')
const { CloseAllServis, request } = require('./helpers/global.helper')
const {
    RestartRoutine,
    tasksForInsert,
    dataForReOrder,
    dataResponseReorder,
    dataForDelete,
    ResponseForDelete,
    dataForCompleteTasks,
    ResponseForCompleteTasks,
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
    });

    //---------

    test('empty body for Reorder ', async () => {
        const response = await request.post('/routine/reorder')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });


    test('success Reorder', async () => {
        console.log(dataForReOrder)
        const response = await request.post('/routine/reorder').send({
            obj: dataForReOrder
        })
        expect(response.status).toBe(200);
        expect(response.body.porcentaje).toBe('0%');
        for (let i = 0; i < response.body.data.length; i++) {
            const element = response.body.data[i];
            expect(element.id).toBe(dataResponseReorder.data[i].id);
            expect(element.Orden).toBe(dataResponseReorder.data[i].Orden);
            expect(element.completed).toBe(dataResponseReorder.data[i].completed);
            expect(element.tasksName).toBe(dataResponseReorder.data[i].tasksName);
        }
    });

    //---------

    test('empty body for Delete ', async () => {
        const response = await request.delete('/routine/DeleteTasks')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });

    test('success delete', async () => {
        console.log(dataForReOrder)
        const response = await request.delete('/routine/DeleteTasks').send(dataForDelete)
        expect(response.status).toBe(200);
        expect(response.body.porcentaje).toBe(ResponseForDelete.porcentaje);
        for (let i = 0; i < response.body.data.length; i++) {
            const element = response.body.data[i];
            expect(element.id).toBe(ResponseForDelete.data[i].id);
            expect(element.Orden).toBe(ResponseForDelete.data[i].Orden);
            expect(element.completed).toBe(ResponseForDelete.data[i].completed);
            expect(element.tasksName).toBe(ResponseForDelete.data[i].tasksName);
        }
    });

    //---------

    test('empty body for completeTask ', async () => {
        const response = await request.post('/routine/completeTask')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });


    test('success completeTask', async () => {
        console.log(dataForReOrder)
        const response = await request.post('/routine/completeTask').send({
            obj: dataForCompleteTasks
        })
        expect(response.status).toBe(200);
        expect(response.body.porcentaje).toBe(ResponseForCompleteTasks.porcentaje);
        for (let i = 0; i < response.body.data.length; i++) {
            const element = response.body.data[i];
            expect(element.id).toBe(ResponseForCompleteTasks.data[i].id);
            expect(element.Orden).toBe(ResponseForCompleteTasks.data[i].Orden);
            expect(element.completed).toBe(ResponseForCompleteTasks.data[i].completed);
            expect(element.tasksName).toBe(ResponseForCompleteTasks.data[i].tasksName);
        }
    });



});


afterAll(() => {
    CloseAllServis()

});