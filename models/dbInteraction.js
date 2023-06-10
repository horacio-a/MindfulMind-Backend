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

async function GetTextByUsers(user) {
    try {
        var query = 'select * from usertexts WHERE user = ?'
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


async function checkExistence(user, email) {
    try {
        var query = 'SELECT * FROM users WHERE user = ? OR email = ?';
        var rows = await pool.query(query, [user, email])
        return rows
    } catch (error) {
        console.log(error)
    }
}


async function InsertUser(obj) {
    try {
        var query = 'insert into users set ?';
        var rows = await pool.query(query, [obj])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function getCalendarTaskByUser(user, idCalendar) {
    try {
        var query = 'SELECT * FROM calendar WHERE USER = ? and idCalendar = ?';
        var rows = await pool.query(query, [user, idCalendar])
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




module.exports = { GetTextByUsers, getCalendarTaskByUser, InsertUser, InsertNewTask, GetTaskByUsers, GetLoginByUserAndPassword, checkExistence }