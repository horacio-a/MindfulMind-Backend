var express = require('express');
var router = express.Router();
var axios = require('axios');
var db = require('../models/dbInteraction')
var md5 = require('md5');



router.post('/newtask/:token', async function (req, res, next) {
    const timeStamp = new Date().getTime()
    const Data = req.body
    const newTask = {
        user: 'horacio',
        tasksName: 'Ir al gimnasio',
        completed: 0,
        updateDate: timeStamp
    }
    db.InsertNewTask(newTask)
});


router.post('/completeTask', async function (req, res, next) {
    const timeStamp = new Date().getTime()
    const dataReq = JSON.parse(req.body.obj)
    const response = await db.GetTaskForCheck(dataReq.user, dataReq.id)
    if (response[0].completed === 0) {
        const obj = { id: dataReq.id, user: dataReq.user, tasksName: dataReq.tasksName, completed: 1, updateDate: timeStamp }
        const alterRows = await db.updateStateTask(obj, dataReq.user, dataReq.id)
        const data = await db.GetTaskByUsers(dataReq.user)

        let taskComplete = 0
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.completed === 1) {
                taskComplete = taskComplete + 1
            }
        }
        let porcentaje = (taskComplete / data.length * 100).toFixed(0) + '%'
        res.json({ work: true, change: 0, data, porcentaje })
    } else {
        const obj = { id: dataReq.id, user: dataReq.user, tasksName: dataReq.tasksName, completed: 0, updateDate: timeStamp }
        const alterRows = await db.updateStateTask(obj, dataReq.user, dataReq.id)

        const data = await db.GetTaskByUsers(dataReq.user)
        let taskComplete = 0
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.completed === 1) {
                taskComplete = taskComplete + 1
            }
        }
        let porcentaje = (taskComplete / data.length * 100).toFixed(0) + '%'
        res.json({ work: true, change: 1, data, porcentaje })
    }
})

router.get('/task/:users', async function (req, res, next) {
    const user = req.params.users
    const data = await db.GetTaskByUsers(user)
    let taskComplete = 0
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.completed === 1) {
            taskComplete = taskComplete + 1
        }
    }
    let porcentaje = (taskComplete / data.length * 100).toFixed(0) + '%'
    const obj = {
        data,
        porcentaje: porcentaje
    }
    res.json(obj)
})

router.get('/text/:users', async function (req, res, next) {
    const user = req.params.users
    const data = await db.GetTextByUsers(user)
    res.json(data)
})


router.get('/calendar/:user/:idCalendar', async function (req, res, next) {
    const user = req.params.user
    const idCalendar = req.params.idCalendar
    const calendarTasks = await db.getCalendarTaskByUser(user, idCalendar)

    function obtenerDiasDelMes() {
        let ID = 1
        const fechaActual = new Date(); // Obtener la fecha actual
        const año = fechaActual.getFullYear(); // Obtener el año actual
        const mes = fechaActual.getMonth(); // Obtener el mes actual (0-11)

        const primerDia = new Date(año, mes, 1); // Crear una fecha con el primer día del mes
        const ultimoDia = new Date(año, mes + 1, 0); // Crear una fecha con el último día del mes

        const diasDelMes = [];

        // Recorrer desde el primer día hasta el último día del mes
        for (let i = primerDia.getDate(); i <= ultimoDia.getDate(); i++) {
            let taresEsteDia = false
            const fecha = new Date(año, mes, i); // Crear una fecha con el día actual
            const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' }); // Obtener el día de la semana como una cadena de texto
            for (let index = 0; index < calendarTasks.length; index++) {
                const element = calendarTasks[index];
                taksDate = new Date(element.date)
                if (taksDate.getDate() == fecha.getDate() && taksDate.getMonth() == fecha.getMonth()) {
                    taresEsteDia = true
                }
            }
            if (fecha.getDate() == fechaActual.getDate()) {
                if (taresEsteDia === true) {
                    diasDelMes.push({ id: ID, number: i, diaSemana, fecha, ThisMount: true, Today: true, requestTask: true });
                } else {
                    diasDelMes.push({ id: ID, number: i, diaSemana, fecha, ThisMount: true, Today: true, requestTask: false });
                }
            } else {
                if (taresEsteDia === true) {
                    diasDelMes.push({ id: ID, number: i, diaSemana, fecha, ThisMount: true, Today: false, requestTask: true });
                } else {
                    diasDelMes.push({ id: ID, number: i, diaSemana, fecha, ThisMount: true, Today: false, requestTask: false });
                }
            }
            taresEsteDia = false
            ID = ID + 1
        }

        const diasDeLaSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
        let numAnterior = 0


        for (let i = 0; i < diasDeLaSemana.length; i++) {
            const element = diasDeLaSemana[i];
            if (diasDelMes[0].diaSemana === element) {
                numAnterior = i
            }
        }

        function obtenerDiasAtras(fecha, cantidadDias) {
            if (cantidadDias != 0) {
                for (let i = 1; i < cantidadDias + 1; i++) {
                    let taresEsteDia = false
                    const fecha = new Date(fecha); // Crear una nueva instancia de Date con la fecha dada
                    fecha.setDate(fecha.getDate() - i); // Restar "i" días a la fecha dada
                    const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
                    for (let index = 0; index < calendarTasks.length; index++) {
                        taksDate = new Date(calendarTasks[index].date)
                        if (taksDate.getDate() == fecha.getDate() && taksDate.getMonth() == fecha.getMonth()) {
                            taresEsteDia = true
                        }
                    }
                    if (taresEsteDia === true) {
                        diasDelMes.unshift({ id: ID, number: fecha.getDate(), diaSemana, fecha, ThisMount: false, Today: false, requestTask: true });
                    } else {
                        diasDelMes.unshift({ id: ID, number: fecha.getDate(), diaSemana, fecha, ThisMount: false, Today: false, requestTask: false });
                    }
                    ID = ID + 1
                    taresEsteDia = false

                }
            }
        }
        obtenerDiasAtras(diasDelMes[0].fecha, numAnterior)

        function obtenerDiasDelante(fecha, cantidadDias) {
            if (cantidadDias != 0) {
                for (let i = 1; i < cantidadDias + 1; i++) {
                    let taresEsteDia = false
                    const fecha = new Date(fecha); // Crear una nueva instancia de Date con la fecha dada
                    fecha.setDate(fecha.getDate() + i); // Restar "i" días a la fecha dada
                    const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
                    for (let index = 0; index < calendarTasks.length; index++) {
                        taksDate = new Date(calendarTasks[index].date)
                        if (taksDate.getDate() == fecha.getDate() && taksDate.getMonth() == fecha.getMonth()) {
                            taresEsteDia = true
                        }
                    }
                    if (taresEsteDia === true) {
                        diasDelMes.push({ id: ID, number: fecha.getDate(), diaSemana, fecha, ThisMount: false, Today: false, requestTask: true });
                    } else {
                        diasDelMes.push({ id: ID, number: fecha.getDate(), diaSemana, fecha, ThisMount: false, Today: false, requestTask: false });
                    }
                    ID = ID + 1
                    taresEsteDia = false

                }
            }
        }
        const numPosterior = 42 - diasDelMes.length //  se obtiene el numero de dias que se necesita para rellenar el calendario

        obtenerDiasDelante(diasDelMes[diasDelMes.length - 1].fecha, numPosterior)



        return diasDelMes;
    }
    const fechaActual = new Date(); // Obtener la fecha actual
    const año = fechaActual.getFullYear(); // Obtener el año actual

    function obtenerNombreMes(fecha) {
        const opciones = { month: 'long' };
        const nombreMes = fecha.toLocaleString('es-ES', opciones);

        return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
    }

    const mes = obtenerNombreMes(fechaActual);

    const calendar = {
        data: { month: mes, year: año },
        days: obtenerDiasDelMes(),
    }



    res.json(calendar)
})



router.post('/login', async function (req, res, next) {

    const user = req.body.user
    const password = req.body.password
    const data = await db.GetLoginByUserAndPassword(user, password)
    if (data !== undefined) {

        res.json({
            authentication: true,
            user: user,
        })
    } else {
        res.json({
            authentication: false,
        })
    }
})


router.post('/register', async function (req, res, next) {
    const data = JSON.parse(req.body.obj)
    const check = await db.checkExistence(data.user, data.email)
    if (check[0] === undefined) {

        let obj = {
            user: data.user,
            password: md5(data.password),
            email: data.email,
        }
        let response = await db.InsertUser(obj)
        res.json({ response, userCreate: true })
    } else {
        let ErrorResponse = { error: { email: false, user: false }, userCreate: false }
        if (check[0].user == data.user) {
            ErrorResponse.error.user = true
        }
        if (check[0].email == data.email) {
            ErrorResponse.error.email = true
        }
        res.json(ErrorResponse)
    }

})


router.post('/mainDataInitial', async function (req, res, next) {
    const RequestData = req.body.obj
    async function Tasks() {
        const user = RequestData.Tasks.user
        const data = await db.GetTaskByUsers(user)
        let taskComplete = 0
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.completed === 1) {
                taskComplete = taskComplete + 1
            }
        }
        let porcentaje = (taskComplete / data.length * 100).toFixed(0) + '%'
        const obj = {
            data,
            porcentaje: porcentaje
        }
        return (obj)
    }
    async function Calendar() {
        const user = RequestData.Calendar.user
        const idCalendar = RequestData.Calendar.idCalendar
        const calendarTasks = await db.getCalendarTaskByUser(user, idCalendar)
        // console.log(calendarTasks)
        function obtenerDiasDelMes() {
            let ID = 1
            const fechaActual = new Date(); // Obtener la fecha actual
            const año = fechaActual.getFullYear(); // Obtener el año actual
            const mes = fechaActual.getMonth(); // Obtener el mes actual (0-11)

            const primerDia = new Date(año, mes, 1); // Crear una fecha con el primer día del mes
            const ultimoDia = new Date(año, mes + 1, 0); // Crear una fecha con el último día del mes

            const diasDelMes = [];

            // Recorrer desde el primer día hasta el último día del mes
            for (let i = primerDia.getDate(); i <= ultimoDia.getDate(); i++) {
                const DaysTask = []
                let taresEsteDia = false
                const fecha = new Date(año, mes, i); // Crear una fecha con el día actual
                const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' }); // Obtener el día de la semana como una cadena de texto
                for (let index = 0; index < calendarTasks.length; index++) {
                    const element = calendarTasks[index];

                    taksDate = new Date(element.date)
                    if (taksDate.getDate() == fecha.getDate() && taksDate.getMonth() == fecha.getMonth()) {
                        taresEsteDia = true
                        DaysTask.push(element)
                    }
                }
                if (fecha.getDate() == fechaActual.getDate()) {
                    if (taresEsteDia === true) {
                        diasDelMes.push({ id: ID, number: i, diaSemana, fecha, ThisMount: true, Today: true, requestTask: true, Tasks: DaysTask });
                    } else {
                        diasDelMes.push({ id: ID, number: i, diaSemana, fecha, ThisMount: true, Today: true, requestTask: false });
                    }
                } else {
                    if (taresEsteDia === true) {
                        diasDelMes.push({ id: ID, number: i, diaSemana, fecha, ThisMount: true, Today: false, requestTask: true, Tasks: DaysTask });
                    } else {
                        diasDelMes.push({ id: ID, number: i, diaSemana, fecha, ThisMount: true, Today: false, requestTask: false });
                    }
                }
                taresEsteDia = false
                ID = ID + 1
            }

            const diasDeLaSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
            let numAnterior = 0


            for (let i = 0; i < diasDeLaSemana.length; i++) {
                const element = diasDeLaSemana[i];
                if (diasDelMes[0].diaSemana === element) {
                    numAnterior = i
                }
            }

            function obtenerDiasAtras(NewFecha, cantidadDias) {
                if (cantidadDias != 0) {
                    for (let i = 1; i < cantidadDias + 1; i++) {
                        let taresEsteDia = false
                        let DaysTask = []
                        const fecha = new Date(NewFecha); // Crear una nueva instancia de Date con la fecha dada
                        fecha.setDate(fecha.getDate() - i); // Restar "i" días a la fecha dada
                        const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
                        for (let index = 0; index < calendarTasks.length; index++) {
                            const element = calendarTasks[index];
                            taksDate = new Date(calendarTasks[index].date)
                            if (taksDate.getDate() == fecha.getDate() && taksDate.getMonth() == fecha.getMonth()) {
                                taresEsteDia = true
                                DaysTask.push(element)

                            }
                        }
                        if (taresEsteDia === true) {
                            diasDelMes.unshift({ id: ID, number: fecha.getDate(), diaSemana, fecha, ThisMount: false, Today: false, requestTask: true, Tasks: DaysTask });
                        } else {
                            diasDelMes.unshift({ id: ID, number: fecha.getDate(), diaSemana, fecha, ThisMount: false, Today: false, requestTask: false });
                        }
                        ID = ID + 1
                        taresEsteDia = false

                    }
                }
            }
            obtenerDiasAtras(diasDelMes[0].fecha, numAnterior)

            function obtenerDiasDelante(NewFecha, cantidadDias) {
                if (cantidadDias != 0) {
                    for (let i = 1; i < cantidadDias + 1; i++) {
                        let taresEsteDia = false
                        let DaysTask = []
                        const fecha = new Date(NewFecha); // Crear una nueva instancia de Date con la fecha dada
                        fecha.setDate(fecha.getDate() + i); // Restar "i" días a la fecha dada
                        const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
                        for (let index = 0; index < calendarTasks.length; index++) {
                            const element = calendarTasks[index];
                            taksDate = new Date(calendarTasks[index].date)
                            if (taksDate.getDate() == fecha.getDate() && taksDate.getMonth() == fecha.getMonth()) {
                                taresEsteDia = true
                                DaysTask.push(element)
                            }
                        }
                        if (taresEsteDia === true) {
                            diasDelMes.push({ id: ID, number: fecha.getDate(), diaSemana, fecha, ThisMount: false, Today: false, requestTask: true, Tasks: DaysTask });
                        } else {
                            diasDelMes.push({ id: ID, number: fecha.getDate(), diaSemana, fecha, ThisMount: false, Today: false, requestTask: false });
                        }
                        ID = ID + 1
                        taresEsteDia = false

                    }
                }
            }
            const numPosterior = 42 - diasDelMes.length //  se obtiene el numero de dias que se necesita para rellenar el calendario

            obtenerDiasDelante(diasDelMes[diasDelMes.length - 1].fecha, numPosterior)



            return diasDelMes;
        }
        const fechaActual = new Date(); // Obtener la fecha actual
        const año = fechaActual.getFullYear(); // Obtener el año actual

        function obtenerNombreMes(fecha) {
            const opciones = { month: 'long' };
            const nombreMes = fecha.toLocaleString('es-ES', opciones);

            return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
        }

        const mes = obtenerNombreMes(fechaActual);



        return ({
            data: { month: mes, year: año },
            days: obtenerDiasDelMes(),
        })
    }
    async function Text() {
        const user = RequestData.Text.user
        const data = await db.GetTextByUsers(user)
        return (data)
    }
    res.json({
        TasksData: await Tasks(),
        CalendarData: await Calendar(),
        TextData: await Text(),
    })
})



router.post('/AddCalendarTask', async function (req, res, next) {
    const obj = req.body.obj
    db.InsertCalendarTask(obj)
    res.json({ request: true })
})

router.get('/FinishFuntion', async function (req, res, next) {
    db.FinishFuntion()
    console.log('si?')
    res.json({ request: true })
})


module.exports = router;
