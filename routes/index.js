var express = require('express');
var router = express.Router();
/* GET home page. */
var axios = require('axios');
var db = require('../models/dbInteraction')
const { response } = require('express');
const { use } = require('../app');


router.post('/newtask/:token', async function (req, res, next) {
    const timeStamp = new Date().getTime()
    const Data = req.body
    console.log(Data)
    const newTask = {
        user: 'horacio',
        tasksName: 'Ir al gimnasio',
        completed: 0,
        updateDate: timeStamp
    }

    db.InsertNewTask(newTask)

});

router.get('/task/:users', async function (req, res, next) {
    const user = req.params.users
    const data = await db.GetTaskByUsers(user)
    res.json(data)
})

router.get('/calendar/:user/:idCalendar', async function (req, res, next) {
    function obtenerDiasDelMes() {
        const fechaActual = new Date(); // Obtener la fecha actual
        const año = fechaActual.getFullYear(); // Obtener el año actual
        const mes = 3; // Obtener el mes actual (0-11)

        const primerDia = new Date(año, mes, 1); // Crear una fecha con el primer día del mes
        const ultimoDia = new Date(año, mes + 1, 0); // Crear una fecha con el último día del mes

        const diasDelMes = [];

        // Recorrer desde el primer día hasta el último día del mes
        for (let i = primerDia.getDate(); i <= ultimoDia.getDate(); i++) {
            const fecha = new Date(año, mes, i); // Crear una fecha con el día actual
            const diaSemana = fecha.toLocaleDateString('es-ES', { weekday: 'long' }); // Obtener el día de la semana como una cadena de texto
            diasDelMes.push({ number: i, diaSemana, fecha, ThisMount: true }); // Agregar el día y el día de la semana al array
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
                    const fechaAtras = new Date(fecha); // Crear una nueva instancia de Date con la fecha dada
                    fechaAtras.setDate(fechaAtras.getDate() - i); // Restar "i" días a la fecha dada
                    const diaSemana = fechaAtras.toLocaleDateString('es-ES', { weekday: 'long' });
                    diasDelMes.unshift({ number: fechaAtras.getDate(), diaSemana, fechaAtras, ThisMount: false });
                }
            }
        }
        obtenerDiasAtras(diasDelMes[0].fecha, numAnterior)

        function obtenerDiasDelante(fecha, cantidadDias) {
            if (cantidadDias != 0) {
                for (let i = 1; i < cantidadDias + 1; i++) {
                    const fechaAtras = new Date(fecha); // Crear una nueva instancia de Date con la fecha dada
                    fechaAtras.setDate(fechaAtras.getDate() + i); // Restar "i" días a la fecha dada
                    const diaSemana = fechaAtras.toLocaleDateString('es-ES', { weekday: 'long' });
                    diasDelMes.push({ number: fechaAtras.getDate(), diaSemana, fechaAtras, ThisMount: false });
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
        days: obtenerDiasDelMes()
    }

    res.json(calendar)
})



module.exports = router;
