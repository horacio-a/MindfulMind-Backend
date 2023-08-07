

const db = require('../../models/dbInteraction')
const date = new Date()

const dataForSimpleNotification = [{
    "title": "Notificacion For testing",
    "Body": date,
    "pushToken": "ExponentPushToken[alI2a1LvEqBx1mM6QcOAy8]",
    "data": {
        "withSome": "data"
    }
},]

const dataForMultipleNotification = [
    {
        "title": "Notificacion For testing",
        "Body": date,
        "pushToken": "ExponentPushToken[alI2a1LvEqBx1mM6QcOAy8]",
        "data": {
            "withSome": "data"
        }
    },
    {
        "title": "Notificacion For testing",
        "Body": date,
        "pushToken": "ExponentPushToken[alI2a1LvEqBx1mM6QcOAy8]",
        "data": {
            "withSome": "data"
        }
    },
    {
        "title": "Notificacion For testing",
        "Body": date,
        "pushToken": "ExponentPushToken[alI2a1LvEqBx1mM6QcOAy8]",
        "data": {
            "withSome": "data"
        }
    }
]
let timeStamp = new Date().getTime()

const tasksForInsert = [
    {
        "user": "UserForTasks",
        "tasksName": "RandomTask0",
        completed: 1,
        updateDate: timeStamp,
        Orden: 0 + 1
    },
    {
        "user": "UserForTasks",
        "tasksName": "RandomTask1",
        completed: 1,
        updateDate: timeStamp,
        Orden: 1 + 1

    },
    {
        "user": "UserForTasks",
        "tasksName": "RandomTask2",
        completed: 1,
        updateDate: timeStamp,
        Orden: 2 + 1
    },
    {
        "user": "UserForTasks",
        "tasksName": "RandomTask3",
        completed: 1,
        updateDate: timeStamp,
        Orden: 3 + 1
    },
    {
        "user": "UserForTasks",
        "tasksName": "RandomTask4",
        completed: 1,
        updateDate: timeStamp,
        Orden: 4 + 1
    },
]


async function RestartRoutine() {
    await db.DeleteAllRoutine()
    for (let i = 0; i < tasksForInsert.length; i++) {
        const element = tasksForInsert[i];
        await db.InsertNewTask(element)
    }
}


module.exports = {
    dataForSimpleNotification,
    dataForMultipleNotification,
    RestartRoutine
}