const db = require('../../models/dbInteraction')

const tasksForInsert = {
    "user": "UserForTasks",
    "title": "RandomTask4",
}

let timeStamp = new Date().getTime()

const tasksForInsertBefore = [
    {
        id: 1,
        "user": "UserForTasks",
        "tasksName": "RandomTask0",
        completed: 1,
        updateDate: timeStamp,
        Orden: 0
    },
    {
        id: 2,
        "user": "UserForTasks",
        "tasksName": "RandomTask1",
        completed: 1,
        updateDate: timeStamp,
        Orden: 1

    },
    {
        id: 3,
        "user": "UserForTasks",
        "tasksName": "RandomTask2",
        completed: 1,
        updateDate: timeStamp,
        Orden: 2
    },
    {
        id: 4,
        "user": "UserForTasks",
        "tasksName": "RandomTask3",
        completed: 1,
        updateDate: timeStamp,
        Orden: 3
    },
]




async function RestartRoutine() {
    await db.DeleteAllRoutine()
    for (let i = 0; i < tasksForInsertBefore.length; i++) {
        const element = tasksForInsertBefore[i];
        await db.InsertNewTask(element)
    }
}

module.exports = { RestartRoutine, tasksForInsert }