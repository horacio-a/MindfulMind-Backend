var express = require('express');
var router = express.Router();
var db = require('../models/dbInteraction')
var md5 = require('md5');




// USER SETTING ENDPOINTS --------------------------------------

router.post('/changePasswordWithPass', async function (req, res, next) {
    const data = req.body.data
    if (data !== undefined) {
        try {
            const response = await db.GetLoginByUserAndPassword(data.user, md5(data.oldpassword))
            if (response !== undefined) {
                const change = await db.changePassword(md5(data.newpassword), data.email)
                res.json({
                    change,
                    err: false
                })
            } else {
                res.status(400).json({
                    err: true,
                    errMsg: 'contraseña no valida'
                })
            }
        } catch (error) {
            res.status(400).json({
                err: true,
                errMsg: 'Error encontrando el usuario'
            })
        }
    } else {
        res.status(400).json({ err: true, errMsg: 'Empty body' })
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

    const login = await db.GetLoginByUserAndPassword(data.user, md5(data.oldpassword))
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
// USER SETTING ENDPOINTS --------------------------------------


module.exports = router;
