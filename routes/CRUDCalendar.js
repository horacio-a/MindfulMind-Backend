var express = require('express');
var router = express.Router();
var db = require('../models/dbInteraction')




// CRUD CALENDAR ------------------------------------------------------------

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


router.post('/updateCalendatTasks', async function (req, res, next) {
    const data = req.body.data

})

// CRUD CALENDAR ------------------------------------------------------------


module.exports = router;
