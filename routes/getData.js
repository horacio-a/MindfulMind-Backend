var express = require('express');
var router = express.Router();
var db = require('../models/dbInteraction')

// MAIN QUERY ------------------------------------------------------------

router.post('/all', async function (req, res, next) {
    const RequestData = req.body.obj
    console.log(RequestData)
    if (RequestData == undefined) {
        res.status(400).json({ err: 'err en los datos' })
    } else {
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

                    const fecha = new Date(año, mes, i);

                    const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' }); // Obtener el día de la semana como una cadena de texto
                    for (let index = 0; index < calendarTasks.length; index++) {
                        const element = calendarTasks[index];
                        taksDate = new Date(element.date)

                        if (taksDate.getDate() == fecha.getDate() && taksDate.getMonth() == fecha.getMonth()) {
                            let groupedTask = false

                            const found = calendarTasks.find((e) => e.GroupId === element.GroupId && e.id !== element.id)
                            if (found !== undefined) {
                                groupedTask = true
                            }
                            taresEsteDia = true
                            element.groupedTask = groupedTask
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
    }

})

// MAIN QUERY ------------------------------------------------------------



// SINGLES QUERYS------------------------------------------------------------

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
    res.json(obj).status(200)
})

router.get('/text/:users', async function (req, res, next) {
    const user = req.params.users
    const data = await db.GetTextByUsers(user)
    res.json(data)
})

router.get('/calendar/:user/:idCalendar', async function (req, res, next) {

    async function Calendar() {
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

    res.json(await Calendar())
})

// SINGLES QUERYS------------------------------------------------------------

module.exports = router;
