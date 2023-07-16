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

async function ReOrderTasks(query) {
    try {
        let rows = await pool.query(query)
        return (rows)
    } catch (error) {
        console.log(error)
    }
}

async function GetTaskForCheck(user, id) {
    try {
        var query = 'select * from tasks WHERE user = ? and id = ?'
        var rows = await pool.query(query, [user, id])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function updateStateTask(obj, user, id) {
    try {
        var query = 'UPDATE tasks set ? WHERE user = ? and id = ?'
        var rows = await pool.query(query, [obj, user, id])
        return rows
    } catch (error) {
        console.log(error)

    }
}

async function GetTaskByUsers(user) {
    try {
        var query = 'select * from tasks WHERE user = ? ORDER BY Order'
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
        var query = 'SELECT * FROM calendar WHERE USER = ? and idCalendar = ? ORDER BY `calendar`.`intialHour` ASC';
        var rows = await pool.query(query, [user, idCalendar])
        return rows
    } catch (error) {
        console.log(error)
    }
}



async function FinishFuntion() {
    try {
        var query = 'UPDATE tasks SET completed = 0'
        var rows = pool.query(query)
        return rows
    } catch (error) {
        console.log(error)

    }
}


async function InsertCalendarTask(obj) {
    try {
        var query = 'insert into calendar set ?';
        var rows = await pool.query(query, [obj])
        return rows
    } catch (error) {
        console.log(error)
    }
}


async function GetLastNumberOrder(user) {
    try {
        var query = 'SELECT Orden from tasks WHERE user = ? order BY Orden DESC LIMIT 1;';
        var rows = await pool.query(query, [user])
        return rows[0].Orden
    } catch (error) {
        console.log(error)
    }
}






module.exports = {
    GetTextByUsers, getCalendarTaskByUser, InsertUser, InsertNewTask,
    GetTaskByUsers, GetLoginByUserAndPassword, checkExistence,
    GetTaskForCheck, updateStateTask, FinishFuntion, InsertCalendarTask,
    GetLastNumberOrder, ReOrderTasks
}