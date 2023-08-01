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

async function DeleteTasks(user, id) {
    try {
        var query = 'DELETE FROM tasks WHERE id = ? and user = ?'
        var rows = await pool.query(query, [id, user])
        console.log(rows)
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
        var query = 'select * from tasks WHERE user = ?  ORDER BY Orden'
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

async function InsertCalendarTaskWithQuery(query) {
    try {
        let rows = await pool.query(query)
        return (rows)
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



async function UpdateTokenForUser(token, email, lastCode) {
    try {
        let query = 'UPDATE users SET PrevToken = ?, token = ? WHERE email = ?'
        let rows = await pool.query(query, [lastCode, token, email])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function checkAuthcode(token, email) {
    try {
        let query = 'SELECT * FROM `users` WHERE token = ? and email = ?'
        let rows = await pool.query(query, [token, email])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function changePassword(password, email) {
    try {
        let query = 'UPDATE users SET password= ? WHERE email = ?'
        let rows = await pool.query(query, [password, email])
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function CheckPreviousPasswordChange(token, email) {
    try {
        let query = 'SELECT * FROM users WHERE email = ? and PrevToken = ?'
        let rows = await pool.query(query, [email, token])
        return rows
    } catch (error) {
        console.log(error)
    }
}


async function ConfirmRegister(email, user) {
    try {
        let query = 'UPDATE users SET ConfirmRegister = 1 WHERE email = ? and user = ?'
        let rows = await pool.query(query, [email, user])
        return rows
    } catch (error) {
        console.log(error)
    }
}



async function ChangeProfilePicture(ProfilePicture, user) {
    try {
        let query = 'UPDATE users SET profilePicture = ? WHERE user = ?'
        let rows = await pool.query(query, [ProfilePicture, user])
        return rows
    } catch (error) {
        console.log(error)
    }
}


async function ChangeAllUsername(queryUser, queryCalendar, queryTasks, queryText) {
    try {
        let rows = []
        let User = await pool.query(queryUser)
        let Calendar = await pool.query(queryCalendar)
        let Tasks = await pool.query(queryTasks)
        let Text = await pool.query(queryText)
        rows.push(User, Calendar, Tasks, Text)
        return rows
    } catch (error) {
        console.log(error)

    }
}


async function createText(data) {
    try {
        let query = 'insert into usertexts set ?'
        let rows = await pool.query(query, [data])
        return rows
    } catch (error) {
        console.log(error)

    }
}

async function UpdateText(data, id) {
    try {
        let query = `UPDATE usertexts SET ? WHERE id = ${id}`
        let rows = await pool.query(query, [data])
        return rows
    } catch (error) {
        console.log(error)

    }
}




module.exports = {
    GetTextByUsers, getCalendarTaskByUser, InsertUser, InsertNewTask,
    GetTaskByUsers, GetLoginByUserAndPassword, checkExistence,
    GetTaskForCheck, updateStateTask, FinishFuntion, InsertCalendarTask,
    GetLastNumberOrder, ReOrderTasks, DeleteTasks, InsertCalendarTaskWithQuery,
    UpdateTokenForUser, checkAuthcode, changePassword, CheckPreviousPasswordChange,
    ConfirmRegister, ChangeProfilePicture, ChangeAllUsername, createText, UpdateText

}