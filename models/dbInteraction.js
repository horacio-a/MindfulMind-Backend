const { route } = require('../routes')
var pool = require('../models/db')
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
        let query = `SELECT * FROM users INNER JOIN usersnotificationtoken ON users.user = usersnotificationtoken.user WHERE users.user = '${user}' and users.password =  '${password}';`
        var rows = await pool.query(query)
        return rows
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


async function InsertUser(obj, notificationData) {
    try {
        let queryUsers = 'INSERT INTO users set ?'
        let queryNotification = 'INSERT INTO usersnotificationtoken set ?'
        let rows = undefined
        let responseQueryUsers = await pool.query(queryUsers, [obj])
        let responseQueryNotification = await pool.query(queryNotification, [notificationData])
        console.log(responseQueryNotification, responseQueryUsers)
        if (responseQueryNotification !== undefined && responseQueryUsers !== undefined) {
            rows = [responseQueryNotification, responseQueryUsers]
        }
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function deleteUserByName(user) {
    try {
        let query = `DELETE FROM users where user = ?`
        let rows = await pool.query(query, [user])
        return rows
    } catch (error) {
        console.log(error)

    }
}

async function deleteUsernotificationByName(user) {
    try {
        let query = `DELETE FROM usersnotificationtoken where user = ?`
        let rows = await pool.query(query, [user])
        return rows
    } catch (error) {
        console.log(error)

    }
}



async function insertNotificationToken(data) {
    try {
        let query = 'INSERT INTO usersnotificationtoken set ?'
        let rows = await pool.query(query, [data])
        return rows

    } catch (error) {
        console.log(error)

    }
}

async function deleteNotificationToken(token) {
    try {
        let query = `DELETE FROM usersnotificationtoken where NotificationToken = '${token}'`
        let rows = await pool.query(query)
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function logoutNotification(token) {
    try {
        let query = `DELETE FROM usersnotificationtoken where NotificationToken = '${token}'`
        let rows = await pool.query(query)
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



async function restartRoutine() {
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


async function deleteText(user, id) {
    try {
        let query = `DELETE FROM usertexts WHERE user = ? and id = ?`
        let rows = await pool.query(query, [user, id])
        return rows
    } catch (error) {
        console.log(error)

    }
}

async function updateCalendarTasks(data, id) {
    try {
        let query = `UPDATE calendar SET ? WHERE id = ${id}`
        let rows = await pool.query(query, [data])
        return rows
    } catch (error) {
        console.log(error)

    }
}


async function getdataforSendNotification(date, plus1Minute) {
    try {
        let query = `SELECT calendar.id, calendar.title, calendar.description, calendar.intialHour, calendar.finishHour,
        usersnotificationtoken.NotificationToken, usersnotificationtoken.user, calendar.notificationFilter,
        users.email
        FROM calendar
        INNER JOIN usersnotificationtoken ON calendar.user = usersnotificationtoken.user
        INNER JOIN users ON calendar.user = users.user
        WHERE calendar.notificationFilter >= ${date} and calendar.notificationFilter < ${plus1Minute};
        `
        let rows = await pool.query(query)
        return rows
    } catch (error) {
        console.log(error)
    }
}






// QUERYS FOR TESTING --------------------------------------

async function RestartUsers() {
    try {
        let query = `DELETE FROM users`
        let rows = await pool.query(query)
        return rows
    } catch (error) {
        console.log(error)

    }
}


async function DeleteAllRoutine() {
    if (process.env.NODE_ENV === 'test') {
        console.log('se elimino la base de datos')
        try {
            let query = `TRUNCATE TABLE tasks`
            let rows = await pool.query(query)
            console.log(rows)
            return rows
        } catch (error) {
            console.log(error)

        }
    } else {
        return ('Error. este comando eliminaria la tabla de la bd')
    }

}

async function DeleteAllCalendar() {
    if (process.env.NODE_ENV === 'test') {
        console.log('se elimino la base de datos')
        try {
            let query = `TRUNCATE TABLE calendar`
            let rows = await pool.query(query)
            console.log(rows)
            return rows
        } catch (error) {
            console.log(error)

        }
    } else {
        return ('Error. este comando eliminaria la tabla de la bd')
    }

}


async function RestartText() {
    try {
        let query = `DELETE FROM usertexts`
        let rows = await pool.query(query)
        return rows
    } catch (error) {
        console.log(error)

    }
}


// QUERYS FOR TESTING --------------------------------------


module.exports = {
    GetTextByUsers, getCalendarTaskByUser, InsertUser, InsertNewTask,
    GetTaskByUsers, GetLoginByUserAndPassword, checkExistence, RestartText,
    GetTaskForCheck, updateStateTask, restartRoutine, InsertCalendarTask,
    GetLastNumberOrder, ReOrderTasks, DeleteTasks, InsertCalendarTaskWithQuery,
    UpdateTokenForUser, checkAuthcode, changePassword, CheckPreviousPasswordChange,
    ConfirmRegister, ChangeProfilePicture, ChangeAllUsername, createText, UpdateText,
    deleteText, updateCalendarTasks, RestartUsers, DeleteAllRoutine, DeleteAllCalendar,
    getdataforSendNotification, deleteUserByName, deleteUsernotificationByName, insertNotificationToken,
    deleteNotificationToken, logoutNotification
}