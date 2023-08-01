var express = require('express');
var router = express.Router();
var axios = require('axios');
var db = require('../models/dbInteraction')
var md5 = require('md5');
const { Expo } = require('expo-server-sdk')
const nodemailer = require("nodemailer");
const transporter = require('../nodeMailer/mailerconfig')
var fs = require('fs');
var handlebars = require('handlebars');
const { token } = require('morgan');


router.post('/newtask/:token', async function (req, res, next) {
    const timeStamp = new Date().getTime()
    const Data = req.body
    console.log(Data.user)
    const OrderNumber = await db.GetLastNumberOrder(Data.user)
    console.log(OrderNumber)
    const newTask = {
        user: Data.user,
        tasksName: Data.title,
        completed: 0,
        updateDate: timeStamp,
        Orden: parseInt(OrderNumber) + 1
    }
    const Response = await db.InsertNewTask(newTask)
    newTask.id = Response.insertId
    res.json(newTask)
});

router.post('/ReOrder', async function (req, res, next) {
    const obj = req.body.obj
    const user = obj.info.user
    console.log(obj.data)
    const query = ['UPDATE tasks SET Orden = CASE id']
    for (let i = 0; i < obj.data.length; i++) {
        const element = obj.data[i];
        query.push(`WHEN ${element.id} THEN ${element.NewOrden}`)
    }
    query.push(`END WHERE USER = "${user}"`)
    const response = await db.ReOrderTasks(query.join(' '))
    async function Tasks() {

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
    res.json(await Tasks())
})

router.delete('/DeleteTasks', async function (req, res, next) {

    const data = req.body
    console.log(data)
    await db.DeleteTasks(data.user, data.id)

    console.log(data.user)
    async function Tasks() {

        const response = await db.GetTaskByUsers(data.user)
        let taskComplete = 0
        for (let i = 0; i < response.length; i++) {
            const element = response[i];
            if (element.completed === 1) {
                taskComplete = taskComplete + 1
            }
        }
        let porcentaje = (taskComplete / response.length * 100).toFixed(0) + '%'
        const obj = {
            data: response,
            porcentaje: porcentaje
        }
        return (obj)
    }
    res.json(await Tasks())
})


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



router.post('/login', async function (req, res, next) {

    const user = req.body.user
    const password = req.body.password
    const data = await db.GetLoginByUserAndPassword(user, password)

    if (data !== undefined) {
        if (data.ConfirmRegister != 1) {
            res.json({
                authentication: false,
                errMsg: 'Email no confirmado, porfavor ingrese a su email y confirme su cuenta',
            })
        } else {

            res.json({
                authentication: true,
                user: data.user,
                email: data.email,
                profilePicture: data.profilePicture
            })
        }

    } else {
        res.json({
            authentication: false,
            errMsg: 'No encontramos un usuario con esas credenciales'
        })
    }
})


router.post('/register', async function (req, res, next) {
    const data = req.body.obj
    console.log(data)
    console.log(data.password)
    const check = await db.checkExistence(data.user, data.email)

    function generarCodigoAleatorio() {
        var codigo = '';
        var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (var i = 0; i < 8; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return codigo;
    }

    if (check[0] === undefined) {
        let obj = {
            user: data.user,
            password: md5(data.password),
            email: data.email,
            ConfirmRegister: 0,
            token: generarCodigoAleatorio(),
            PrevToken: generarCodigoAleatorio(),
        }
        let response = await db.InsertUser(obj)
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };



        readHTMLFile(__dirname + '/../views/templeteRegister.html', async function (err, html) {
            if (err) {
                console.log('error reading file', err);
                return;
            }
            var template = handlebars.compile(html);
            var replacements = {
                Link: ` https://api.mindfulmind.com.ar/user/registerConfirmation/${data.user}/${data.email}`
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'mindfulmindsuport@gmail.com',
                to: data.email,
                subject: "Creaste tu cuenta en mindfulmind",
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                console.log(response.messageId)
                if (error) {
                    console.log(error);
                }
            });
        });

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
        function obtenerDiasDelMes() {
            let ID = 1
            const fechaActual = new Date(); // Obtener la fecha actual

            console.log(fechaActual)
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
    const obj = req.body
    const newdata = []


    if (!obj.info.Allday) {
        obj.data.intialHour = obj.data.intialHour.split('T')[0] + 'T00:00:00.000Z'
        obj.data.finishHour = obj.data.finishHour.split('T')[0] + 'T23:59:59.999Z'
    }

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
        arryQuery.push('INSERT INTO calendar (user, title, description, date, intialHour, finishHour, colorHex, category, idCalendar, notificationFilter) VALUES ')
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            arryQuery.push(`("${element.user}" , "${element.Title}", "${element.description}", "${element.date}", "${element.intialHour}", "${element.finishHour}", "${element.colorHex}", "${element.category}", "${element.idCalendar}", ${element.notificationFilter} )`)
            if (i !== data.length - 1) {
                arryQuery.push(',')
            }
        }
        return arryQuery.join(' ')
    }

    db.InsertCalendarTaskWithQuery(createQuery(newdata))

    res.json(newdata)
})

router.get('/FinishFuntion', async function (req, res, next) {
    db.FinishFuntion()
    console.log('si?')
    res.json({ request: true })
})



router.post('/SendNotification', async function (req, res, next) {
    const somePushTokens = req.body
    // Create a new Expo SDK client
    // optionally providing an access token if you have enabled push security
    let expo = new Expo();

    // Create the messages that you want to send to clients
    let messages = [];


    for (let item of somePushTokens) {
        console.log(item)
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(item.pushToken)) {
            console.error(`Push token ${item.pushToken} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messages.push({
            title: item.title,
            to: item.pushToken,
            sound: 'default',
            body: item.Body,
            data: { withSome: 'data' },
        })
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
                // NOTE: If a ticket contains an error code in ticket.details.error, you
                // must handle it appropriately. The error codes are listed in the Expo
                // documentation:
                // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            } catch (error) {
                console.error(error);
            }
        }
    })();


    // Later, after the Expo push notification service has delivered the
    // notifications to Apple or Google (usually quickly, but allow the the service
    // up to 30 minutes when under load), a "receipt" for each notification is
    // created. The receipts will be available for at least a day; stale receipts
    // are deleted.
    //
    // The ID of each receipt is sent back in the response "ticket" for each
    // notification. In summary, sending a notification produces a ticket, which
    // contains a receipt ID you later use to get the receipt.
    //
    // The receipts may contain error codes to which you must respond. In
    // particular, Apple or Google may block apps that continue to send
    // notifications to devices that have blocked notifications or have uninstalled
    // your app. Expo does not control this policy and sends back the feedback from
    // Apple and Google so you can handle it appropriately.
    let receiptIds = [];
    for (let ticket of tickets) {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
        if (ticket.id) {
            receiptIds.push(ticket.id);
        }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        for (let chunk of receiptIdChunks) {
            try {
                let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
                console.log(receipts);

                // The receipts specify whether Apple or Google successfully received the
                // notification and information about an error, if one occurred.
                for (let receiptId in receipts) {
                    let { status, message, details } = receipts[receiptId];
                    if (status === 'ok') {
                        continue;
                    } else if (status === 'error') {
                        console.error(
                            `There was an error sending a notification: ${message}`
                        );
                        if (details && details.error) {
                            // The error codes are listed in the Expo documentation:
                            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                            // You must handle the errors appropriately.
                            console.error(`The error code is ${details.error}`);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    })();
    res.json(tickets)
})


router.post('/Authcod/forgetpassword', async function (req, res, next) {

    const data = req.body.data
    const check = await db.checkExistence(data.user, data.email)
    if (check[0] !== undefined) {
        function generarCodigoAleatorio() {
            var codigo = '';
            var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (var i = 0; i < 8; i++) {
                codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            return codigo;
        }
        const code = generarCodigoAleatorio()

        await db.UpdateTokenForUser(code, data.email, check[0].token)

        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };



        readHTMLFile(__dirname + '/../views/temple.html', async function (err, html) {
            if (err) {
                console.log('error reading file', err);
                return;
            }
            var template = handlebars.compile(html);
            var replacements = {
                code: code
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'mindfulmindsuport@gmail.com',
                to: data.email,
                subject: "Olvidates tu contraseña mindfulmind",
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                console.log(response.messageId)
                if (error) {
                    console.log(error);
                }
            });
        });


        res.json({
            code
        })
    } else {
        res.json({
            error: 'Email no encontrado'
        })
    }





})

router.post('/checkAuthcode', async function (req, res, next) {
    const data = req.body.data
    const response = await db.checkAuthcode(data.token, data.email)
    if (response[0] !== undefined) {
        function generarCodigoAleatorio() {
            var codigo = '';
            var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (var i = 0; i < 8; i++) {
                codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            return codigo;
        }
        const code = generarCodigoAleatorio()
        await db.UpdateTokenForUser(code, data.email, response[0].token)
        res.json({
            Authcode: true
        })

    } else {
        res.json({
            Authcode: false
        })
    }


})

router.post('/ChangePassword', async function (req, res, next) {
    const data = req.body.data
    try {
        const response = await db.CheckPreviousPasswordChange(data.token, data.email)
        if (response[0] !== undefined) {
            await db.changePassword(md5(data.password), data.email)
            res.json({
                Change: true
            })
        } else {
            res.json({
                error,
                msg: 'Tuvimos un problema, Intente mas tarde por favor'
            })
        }

    } catch (error) {
        console.log(error)
        res.json({
            error,
            msg: 'Tuvimos un problema, Intente mas tarde por favor'
        })
    }




})


router.post('/changePasswordWithPass', async function (req, res, next) {
    const data = req.body.data
    console.log(data)
    const response = await db.GetLoginByUserAndPassword(data.user, data.oldpassword)
    console.log(response)
    if (response !== undefined) {
        const change = await db.changePassword(md5(data.newpassword), data.email)
        res.json({
            change,
            err: false
        })
    } else {
        res.json({
            err: true,
            errMsg: 'contraseña no valida'
        })
    }
})

router.post('/changeprofilepicture', async function (req, res, next) {
    const data = req.body.data

    const respose = await db.ChangeProfilePicture(data.profilePicture, data.user)

    res.json({
        respose
    })

})

router.post('/changeUsername', async function (req, res, next) {
    const data = req.body.data

    const login = await db.GetLoginByUserAndPassword(data.user, data.password)
    if (login !== undefined) {
        const userEnabled = await db.checkExistence(data.newUser, 'NotEmail')
        if (userEnabled[0] === undefined) {
            const queryUser = `UPDATE users SET user = '${data.newUser}'WHERE user = '${data.user}'; `
            const queryCalendar = `UPDATE calendar SET user = '${data.newUser}' WHERE user = '${data.user}';  `
            const queryTasks = `UPDATE tasks SET user = '${data.newUser}' WHERE user = '${data.user}';  `
            const queryText = `UPDATE usertexts SET user = '${data.newUser}' WHERE user = '${data.user}';`

            const response = await db.ChangeAllUsername(queryUser, queryCalendar, queryTasks, queryText)
            res.json({
                response,
                err: false
            })
        } else {
            res.json({
                err: true,
                errMsg: 'Usuario no disponible'
            })
        }
    } else {
        res.json({
            err: true,
            errMsg: 'Contraseña no valida'
        })
    }




})


router.post('/createtext', async function (req, res, next) {
    const data = req.body.data

    try {
        await db.createText(data)
        res.json({
            data
        })
    } catch (error) {
        res.json({
            err: 'error'
        })
    }


})

module.exports = router;


