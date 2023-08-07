const db = require('../../models/dbInteraction')


const calanderCreate = {
    "data": {
        "user": "userForTesting",
        "Title": "PrincipalTasks",
        "intialHour": "2023-08-09T16:00:00.000Z",
        "finishHour": "2023-08-09T18:00:00.000Z",
        "idCalendar": "Calendario Principal",
        "description": "PrincipalTasks for testing",
        "date": "2023-08-09T03:00:00.000Z",
        "colorHex": "#ffffff",
        "category": "principal"
    },
    "info": {
        "Allday": false,
        "repeat": "Todos los meses",
        "NotificacionTime": "10 minutos antes"
    }
}


const responseForCreate = [
    {
        "user": "userForTesting",
        "Title": "PrincipalTasks",
        "intialHour": "2023-08-09T00:00:00.000Z",
        "finishHour": "2023-08-09T23:59:59.999Z",
        "idCalendar": "Calendario Principal",
        "description": "PrincipalTasks for testing",
        "date": "2023-08-09T03:00:00.000Z",
        "colorHex": "#ffffff",
        "category": "principal",
        "notificationFilter": 1691538600000
    },
    {
        "user": "userForTesting",
        "Title": "PrincipalTasks",
        "intialHour": "2023-09-09T00:00:00.000Z",
        "finishHour": "2023-09-09T23:59:59.999Z",
        "idCalendar": "Calendario Principal",
        "description": "PrincipalTasks for testing",
        "date": "2023-09-09T03:00:00.000Z",
        "colorHex": "#ffffff",
        "category": "principal",
        "notificationFilter": 1694217000000
    },
    {
        "user": "userForTesting",
        "Title": "PrincipalTasks",
        "intialHour": "2023-10-09T00:00:00.000Z",
        "finishHour": "2023-10-09T23:59:59.999Z",
        "idCalendar": "Calendario Principal",
        "description": "PrincipalTasks for testing",
        "date": "2023-10-09T03:00:00.000Z",
        "colorHex": "#ffffff",
        "category": "principal",
        "notificationFilter": 1696809000000
    },
    {
        "user": "userForTesting",
        "Title": "PrincipalTasks",
        "intialHour": "2023-11-09T00:00:00.000Z",
        "finishHour": "2023-11-09T23:59:59.999Z",
        "idCalendar": "Calendario Principal",
        "description": "PrincipalTasks for testing",
        "date": "2023-11-09T03:00:00.000Z",
        "colorHex": "#ffffff",
        "category": "principal",
        "notificationFilter": 1699487400000
    },
    {
        "user": "userForTesting",
        "Title": "PrincipalTasks",
        "intialHour": "2023-12-09T00:00:00.000Z",
        "finishHour": "2023-12-09T23:59:59.999Z",
        "idCalendar": "Calendario Principal",
        "description": "PrincipalTasks for testing",
        "date": "2023-12-09T03:00:00.000Z",
        "colorHex": "#ffffff",
        "category": "principal",
        "notificationFilter": 1702079400000
    }
]


async function resetCalendar() {
    await db.DeleteAllCalendar()
}










module.exports = {
    calanderCreate, responseForCreate,
    resetCalendar
}