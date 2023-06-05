const { route } = require('../routes')
var pool = require('./db')
var md5 = require('md5');


async function InsertNewTask(obj) {
    try {
        var query = 'insert into tasks set ?';
        var rows = await pool.query(query, [obj])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function GetTaskByUsers(user) {
    try {
        var query = 'select * from tasks WHERE user = ?'
        var rows = await pool.query(query, [user])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function GetLoginByUserAndPassword(user, password) {
    try {
        var query = 'select * from users WHERE user = ? and password = ?'
        var rows = await pool.query(query, [user, md5(password)])
        return rows[0]
    } catch (error) {
        console.log(error)
    }
}


async function getLastRegistroHorario() {
    try {
        var query = 'select * from registro_horarios limit 1'
        var rows = await pool.query(query)
        return rows
    } catch (error) {
        console.log(error)
    }
}


async function deleteRegistroshorarios() {
    try {
        var query = 'delete from registro_horarios'
        var rows = await pool.query(query)
    } catch (error) {
        console.log(error)
    }
}

async function insertRegistroHorario(obj) {
    try {
        var query = 'insert into registro_horarios set ?';
        var rows = await pool.query(query, [obj])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function getMonedas() {
    try {
        var query = 'select * from data'
        var rows = await pool.query(query)
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function getMonedasFromID(code) {
    try {
        var query = 'select * from data where code = ?'
        var rows = await pool.query(query, [code])
        return rows
    } catch (error) {
        console.log(error)
    }
}


async function deleteMonedas() {
    try {
        var query = 'delete from data'
        var rows = await pool.query(query)
    } catch (error) {
        console.log(error)
    }
}

async function insertMonedas(obj) {
    try {
        var query = 'insert into data set ? ';

        var rows = await pool.query(query, [obj])
        return rows
    } catch (error) {
        console.log(error)
    }
}


async function insertInfo(obj) {
    try {
        var query = 'insert into info set ?'
        var rows = await pool.query(query, [obj])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function getInfo() {
    try {
        var query = 'select * from info'
        var rows = await pool.query(query)
        return rows
    } catch (error) {
        console.log(error)
    }
}


async function deleteAllInfo() {
    try {
        var query = 'delete from info'
        var rows = await pool.query(query)
    } catch (error) {
        console.log(error)
    }
}


async function getNamebyid(code) {
    try {
        var query = 'select * from info where code = ?'
        var rows = await pool.query(query, [code])
        return rows
    } catch (error) {
        console.log(error)
    }
}


module.exports = { InsertNewTask, GetTaskByUsers, GetLoginByUserAndPassword }