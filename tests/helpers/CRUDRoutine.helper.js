const db = require('../../models/dbInteraction')

const tasksForInsert = {
    "user": "UserForTasks",
    "title": "RandomTask4",
}

let timeStamp = new Date().getTime()

const tasksForInsertBefore = [
    {
        "user": "UserForTasks",
        "tasksName": "RandomTask0",
        completed: 0,
        updateDate: timeStamp,
        Orden: 1
    },
    {
        "user": "UserForTasks",
        "tasksName": "RandomTask1",
        completed: 0,
        updateDate: timeStamp,
        Orden: 2

    },
    {
        "user": "UserForTasks",
        "tasksName": "RandomTask2",
        completed: 0,
        updateDate: timeStamp,
        Orden: 3
    },
    {
        "user": "UserForTasks",
        "tasksName": "RandomTask3",
        completed: 0,
        updateDate: timeStamp,
        Orden: 4
    },
]

const dataForReOrder = {
    info: { user: 'UserForTasks' },
    data: [
        { id: 1, NewOrden: 5 },
        { id: 2, NewOrden: 4 },
        { id: 3, NewOrden: 3 },
        { id: 4, NewOrden: 2 },
        { id: 5, NewOrden: 1 },
    ]
}



const dataResponseReorder = {
    "data":
        [
            { "id": 5, "Orden": 1, "completed": 0, "tasksName": "RandomTask4", "user": "UserForTasks" },
            { "id": 4, "Orden": 2, "completed": 0, "tasksName": "RandomTask3", "user": "UserForTasks" },
            { "id": 3, "Orden": 3, "completed": 0, "tasksName": "RandomTask2", "user": "UserForTasks" },
            { "id": 2, "Orden": 4, "completed": 0, "tasksName": "RandomTask1", "user": "UserForTasks" },
            { "id": 1, "Orden": 5, "completed": 0, "tasksName": "RandomTask0", "user": "UserForTasks" }
        ],
    "porcentaje": "0%"
}


const dataForDelete = { "id": 1, "user": "UserForTasks" }


const ResponseForDelete = {
    "data":
        [
            { "id": 5, "Orden": 1, "completed": 0, "tasksName": "RandomTask4", "user": "UserForTasks" },
            { "id": 4, "Orden": 2, "completed": 0, "tasksName": "RandomTask3", "user": "UserForTasks" },
            { "id": 3, "Orden": 3, "completed": 0, "tasksName": "RandomTask2", "user": "UserForTasks" },
            { "id": 2, "Orden": 4, "completed": 0, "tasksName": "RandomTask1", "user": "UserForTasks" },
        ],
    "porcentaje": "0%"
}


const dataForCompleteTasks = { "id": 2, "Orden": 4, "completed": 0, "tasksName": "RandomTask1", "user": "UserForTasks" }

const ResponseForCompleteTasks = {
    "data":
        [
            { "id": 5, "Orden": 1, "completed": 0, "tasksName": "RandomTask4", "user": "UserForTasks" },
            { "id": 4, "Orden": 2, "completed": 0, "tasksName": "RandomTask3", "user": "UserForTasks" },
            { "id": 3, "Orden": 3, "completed": 0, "tasksName": "RandomTask2", "user": "UserForTasks" },
            { "id": 2, "Orden": 4, "completed": 1, "tasksName": "RandomTask1", "user": "UserForTasks" },
        ],
    "porcentaje": "25%"
}


async function RestartRoutine() {
    await db.DeleteAllRoutine()
    for (let i = 0; i < tasksForInsertBefore.length; i++) {
        const element = tasksForInsertBefore[i];
        await db.InsertNewTask(element)
    }
}

module.exports = {
    RestartRoutine, tasksForInsert, dataForReOrder, dataResponseReorder,
    dataForDelete, ResponseForDelete, dataForCompleteTasks, ResponseForCompleteTasks
}