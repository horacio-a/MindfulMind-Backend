var express = require('express');
var router = express.Router();
var db = require('../models/dbInteraction')

async function Calendar(user, idCalendar) {

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



// CRUD CALENDAR ------------------------------------------------------------

router.post('/create', async function (req, res, next) {
    const obj = req.body
    const newdata = []

    if (obj.info === undefined || obj.data === undefined) {
        res.status(400).json({
            err: true,
            errMsg: 'Empty body'
        })
    } else {


        if (!obj.info.Allday) {
            obj.data.intialHour = obj.data.intialHour.split('T')[0] + 'T00:00:00.000Z'
            obj.data.finishHour = obj.data.finishHour.split('T')[0] + 'T23:59:59.999Z'
        }

        function generarCodigo() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let codigo = '';

            for (let i = 0; i < 3; i++) {
                codigo += characters[Math.floor(Math.random() * characters.length)];
            }
            codigo += '-';

            for (let i = 0; i < 3; i++) {
                codigo += characters[Math.floor(Math.random() * characters.length)];
            }
            codigo += '-';

            for (let i = 0; i < 3; i++) {
                codigo += characters[Math.floor(Math.random() * characters.length)];
            }
            return codigo;
        }
        const codigoGenerado = generarCodigo();


        switch (obj.info.repeat) {
            case 'Todas las semanas':

                function obtenerDiasIgualesHastaFinDeAnio(fechaString) {
                    const fecha = new Date(fechaString)
                    // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
                    const diaSemana = fecha.getDay();

                    // Crear una copia de la fecha para no modificar la original
                    const fechaActual = new Date(fecha);

                    // Crear un arreglo para almacenar las fechas que cumplan con la condición
                    const fechasIguales = [];

                    // Iterar hasta el final del año
                    while (fechaActual.getFullYear() === fecha.getFullYear()) {
                        if (fechaActual.getDay() === diaSemana) {
                            // Agregar una copia de la fecha actual al arreglo
                            fechasIguales.push(new Date(fechaActual));
                        }

                        // Incrementar la fecha en un día
                        fechaActual.setDate(fechaActual.getDate() + 1);
                    }

                    return fechasIguales;
                }

                const fechasIguales = obtenerDiasIgualesHastaFinDeAnio(obj.data.date);
                for (let i = 0; i < fechasIguales.length; i++) {
                    const element = fechasIguales[i];
                    newdata.push({
                        GroupId: codigoGenerado,
                        "user": obj.data.user,
                        "Title": obj.data.Title,
                        "intialHour": element.toISOString().split('T')[0] + 'T' + obj.data.intialHour.split('T')[1],
                        "finishHour": element.toISOString().split('T')[0] + 'T' + obj.data.finishHour.split('T')[1],
                        "idCalendar": obj.data.idCalendar,
                        "description": obj.data.description,
                        "date": element.toISOString(),
                        "colorHex": obj.data.colorHex,
                        "category": obj.data.category
                    })
                }

                break;
            case 'Todos los meses':

                function obtenerMismoDiaEnCadaMes(fechaString) {
                    const fecha = new Date(fechaString)

                    const meses = 12; // Total de meses en el año
                    const resultado = [];

                    // Obtener el día del mes de la fecha proporcionada
                    const dia = fecha.getDate();

                    // Obtener el año de la fecha proporcionada
                    const anio = fecha.getFullYear();

                    // Iterar por cada mes del año
                    for (let mes = fecha.getMonth(); mes < meses; mes++) {
                        // Crear una nueva fecha usando el mismo día, el mes actual (más 1, ya que los meses en JavaScript son 0 indexados) y el mismo año.
                        const nuevaFecha = new Date(anio, mes, dia);
                        resultado.push(nuevaFecha);
                    }

                    return resultado;
                }
                const fechasEnCadaMes = obtenerMismoDiaEnCadaMes(obj.data.date);
                for (let i = 0; i < fechasEnCadaMes.length; i++) {
                    const element = fechasEnCadaMes[i];
                    newdata.push({
                        GroupId: codigoGenerado,
                        "user": obj.data.user,
                        "Title": obj.data.Title,
                        "intialHour": element.toISOString().split('T')[0] + 'T' + obj.data.intialHour.split('T')[1],
                        "finishHour": element.toISOString().split('T')[0] + 'T' + obj.data.finishHour.split('T')[1],
                        "idCalendar": obj.data.idCalendar,
                        "description": obj.data.description,
                        "date": element.toISOString(),
                        "colorHex": obj.data.colorHex,
                        "category": obj.data.category
                    })
                }


                break;
            case 'Todos los años':
                function obtenerMismoDiaProximos10Anios(fechaString) {
                    const fecha = new Date(fechaString)

                    const anios = 10; // Cantidad de años a obtener
                    const resultado = [];

                    // Obtener el día del mes de la fecha proporcionada
                    const dia = fecha.getDate();

                    // Obtener el mes de la fecha proporcionada (los meses en JavaScript son 0-indexados)
                    const mes = fecha.getMonth();

                    // Obtener el año de la fecha proporcionada
                    const anio = fecha.getFullYear();

                    // Iterar para los próximos 10 años
                    for (let i = 0; i < anios; i++) {
                        const nuevoAnio = anio + i;
                        // Crear una nueva fecha usando el mismo día, el mismo mes y el nuevo año.
                        const nuevaFecha = new Date(nuevoAnio, mes, dia);
                        resultado.push(nuevaFecha);
                    }

                    return resultado;
                }
                const fechasProximos10Anios = obtenerMismoDiaProximos10Anios(obj.data.date);

                for (let i = 0; i < fechasProximos10Anios.length; i++) {
                    const element = fechasProximos10Anios[i];
                    newdata.push({
                        GroupId: codigoGenerado,
                        "user": obj.data.user,
                        "Title": obj.data.Title,
                        "intialHour": element.toISOString().split('T')[0] + 'T' + obj.data.intialHour.split('T')[1],
                        "finishHour": element.toISOString().split('T')[0] + 'T' + obj.data.finishHour.split('T')[1],
                        "idCalendar": obj.data.idCalendar,
                        "description": obj.data.description,
                        "date": element.toISOString(),
                        "colorHex": obj.data.colorHex,
                        "category": obj.data.category
                    })
                }

                break;
            default:
                newdata.push({
                    GroupId: codigoGenerado,
                    "user": obj.data.user,
                    "Title": obj.data.Title,
                    "intialHour": obj.data.intialHour,
                    "finishHour": obj.data.finishHour,
                    "idCalendar": obj.data.idCalendar,
                    "description": obj.data.description,
                    "date": obj.data.date,
                    "colorHex": obj.data.colorHex,
                    "category": obj.data.category
                })
                break;
        }


        switch (obj.info.NotificacionTime) {
            case '10 minutos antes':
                for (let i = 0; i < newdata.length; i++) {
                    const element = newdata[i];
                    element.notificationFilter = new Date(element.intialHour).getTime() - 600000
                    const tests = new Date(element.intialHour).getTime() - 600000
                    console.log(new Date(tests))
                }
                break;
            case '1 hora antes':
                for (let i = 0; i < newdata.length; i++) {
                    const element = newdata[i];
                    element.notificationFilter = new Date(element.intialHour).getTime() - 3600000
                    const tests = new Date(element.intialHour).getTime() - 3600000
                    console.log(new Date(tests))
                }
                break;
            case '1 dia antes':
                for (let i = 0; i < newdata.length; i++) {
                    const element = newdata[i];
                    element.notificationFilter = new Date(element.intialHour).getTime() - 86400000
                    const tests = new Date(element.intialHour).getTime() - 86400000
                    console.log(new Date(tests))
                }
                break;
            default:
                for (let i = 0; i < newdata.length; i++) {
                    const element = newdata[i];
                    element.notificationFilter = new Date(element.intialHour).getTime()
                    const tests = new Date(element.intialHour).getTime()
                    console.log(new Date(tests))
                }
                break;
        }

        function createQuery(data) {
            const arryQuery = []
            arryQuery.push('INSERT INTO calendar (GroupId, user, title, description, date, intialHour, finishHour, colorHex, category, idCalendar, notificationFilter) VALUES ')
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                arryQuery.push(`("${element.GroupId}" , "${element.user}" , "${element.Title}", "${element.description}", "${element.date}", "${element.intialHour}", "${element.finishHour}", "${element.colorHex}", "${element.category}", "${element.idCalendar}", ${element.notificationFilter} )`)
                if (i !== data.length - 1) {
                    arryQuery.push(',')
                }
            }
            return arryQuery.join(' ')
        }

        db.InsertCalendarTaskWithQuery(createQuery(newdata))

        res.json(newdata)
    }


})


router.post('/update', async function (req, res, next) {
    const data = req.body.data
    const info = req.body.info

    if (data !== undefined) {


        let response
        try {
            response = await db.updateCalendarTasks(data, data.id)
            console.log(response)
        } catch (error) {
            res.status(500).json({ errMsg: 'error intenta mas tarde' })
        }


        if (response.affectedRows !== 0) {
            res.status(200).json(await Calendar(data.user, data.idCalendar))
        } else {
            res.status(200).json(response)
        }
    } else {
        res.status(400).json({
            err: true,
            errMsg: 'Empty body'
        })
    }

})


router.post('/updategroup', async function (req, res, next) {

    const data = req.body.data
    const info = req.body.info
    console.log(data.user, data.idCalendar, data.GroupId)
    const tasksToEdited = await db.getCalendarTaskByGroup(data.user, data.idCalendar, data.GroupId)
    var query = ''

    for (let i = 0; i < tasksToEdited.length; i++) {
        const element = tasksToEdited[i];
        let notificationFilter
        switch (info.NotificacionTime) {
            case '10 minutos antes':
                notificationFilter = new Date(element.intialHour.split('T')[0] + 'T' + data.intialHour.split('T')[1]).getTime() - 600000
                break;
            case '1 hora antes':
                notificationFilter = new Date(element.intialHour.split('T')[0] + 'T' + data.intialHour.split('T')[1]).getTime() - 3600000
                break;
            case '1 dia antes':
                notificationFilter = new Date(element.intialHour.split('T')[0] + 'T' + data.intialHour.split('T')[1]).getTime() - 86400000
                break;
            default:
                notificationFilter = new Date(element.intialHour.split('T')[0] + 'T' + data.intialHour.split('T')[1]).getTime()
                break;
        }

        query += `UPDATE calendar 
        SET title='${data.title}', description='${data.description}', date='${element.date}', intialHour='${element.intialHour.split('T')[0] + 'T' + data.intialHour.split('T')[1]}',  finishHour='${element.finishHour.split('T')[0] + 'T' + data.finishHour.split('T')[1]}', colorHex='${data.colorHex}', category='${data.category}', idCalendar='${data.idCalendar}', notificationFilter=${notificationFilter} 
        WHERE id=${element.id} and user='${element.user}' and GroupId='${element.GroupId}';
        `

    }

    const response = await db.updateCalendarTasksByGroupId(query)


    res.json(await Calendar(data.user, data.idCalendar))

})


router.delete('/delete', async function (req, res, next) {
    const data = req.body
    console.log(data)
    if (data !== undefined) {

        const response = await db.deleteCalendarTasks(data.user, data.id)

        res.json(await Calendar(data.user, data.idCalendar))
    } else {
        res.status(400).json({
            err: true,
            errMsg: 'Empty body'
        })
    }
})


router.delete('/deletegroup', async function (req, res, next) {
    const data = req.body
    if (data !== undefined) {
        const response = await db.deleteCalendarTasksByGroup(data.user, data.id)


        res.json(await Calendar(data.user, data.idCalendar))

    } else {
        res.status(400).json({
            err: true,
            errMsg: 'Empty body'
        })
    }


})

// CRUD CALENDAR ------------------------------------------------------------


module.exports = router;
