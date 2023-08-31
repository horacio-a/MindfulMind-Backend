var express = require('express');
var router = express.Router();
var db = require('../models/dbInteraction')
var md5 = require('md5');
const transporter = require('../nodeMailer/mailerconfig')
var fs = require('fs');
var handlebars = require('handlebars');

// lOGIN AND REGISTER SIMPLE --------------------------------------

router.post('/login', async function (req, res, next) {
    try {
        const user = req.body.user
        const password = req.body.password

        res.json({ user, password })
        const data = await db.GetLoginByUserAndPassword(user, md5(password))
        console.log(data)
        if (data[0] !== undefined) {
            if (data[0].ConfirmRegister != 1) {
                res.status(200).json({
                    authentication: false,
                    errMsg: 'Email no confirmado, porfavor ingrese a su email y confirme su cuenta',
                })
            } else {
                let response = {
                    authentication: true,
                    user: data[0].user,
                    password: data[0].password,
                    email: data[0].email,
                    profilePicture: data[0].profilePicture,
                    tutorial: data[0].tutorial,
                    notificationTokens: [],
                }

                data.forEach(element => {
                    response.notificationTokens.push(element.NotificationToken)
                });

                res.status(200).json(response)
            }

        } else {
            res.json({
                authentication: false,
                errMsg: 'No encontramos un usuario con esas credenciales'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ err: true, errMsg: 'Empty body' })
    }

})

router.post('/login/Encrypted', async function (req, res, next) {
    try {
        const user = req.body.user
        const password = req.body.password

        res.json({ user, password })
        const data = await db.GetLoginByUserAndPassword(user, password)
        console.log(data)
        if (data[0] !== undefined) {
            if (data[0].ConfirmRegister != 1) {
                res.status(200).json({
                    authentication: false,
                    errMsg: 'Error',
                })
            } else {
                let response = {
                    authentication: true,
                    user: data[0].user,
                    password: data[0].password,
                    email: data[0].email,
                    profilePicture: data[0].profilePicture,
                    tutorial: data[0].tutorial,
                    notificationTokens: [],
                }

                data.forEach(element => {
                    response.notificationTokens.push(element.NotificationToken)
                });

                res.status(200).json(response)
            }

        } else {
            res.json({
                authentication: false,
                errMsg: 'Error',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(403).json({ err: true, errMsg: 'Empty body' })
    }

})

router.post('/register', async function (req, res, next) {
    const data = req.body.obj
    if (data !== undefined) {

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
                email: (data.email).toLowerCase(),
                ConfirmRegister: 0,
                token: generarCodigoAleatorio(),
                PrevToken: generarCodigoAleatorio(),
            }
            let notificationData = {
                user: data.user,
                NotificationToken: 'NoCreado',
            }
            let response = await db.InsertUser(obj, notificationData)
            if (response !== undefined) {
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
                    if (process.env.NODE_ENV !== 'test') {
                        transporter.sendMail(mailOptions, function (error, response) {
                            console.log(response.messageId)
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                });

                res.status(200).json({ response, userCreate: true })
            } else {
                db.deleteUsernotificationByName(data.user)
                db.deleteUserByName(data.user)
                res.status(400).json({ err: true, errMsg: 'Error creando la cuenta, intente mas tarde' })
            }

        } else {
            let ErrorResponse = { error: { email: false, user: false }, userCreate: false }
            for (let i = 0; i < check.length; i++) {
                if (check[i].user == data.user) {
                    ErrorResponse.error.user = true
                }
                if (check[i].email == data.email) {
                    ErrorResponse.error.email = true
                }
            }

            res.status(400).json(ErrorResponse)
        }

    } else {
        res.status(400).json({ err: true, errMsg: 'Empty body' })
    }

})

router.post('/logout', async function (req, res, next) {
    const token = req.body.NotificationToken
    try {
        console.log(token)
        const response = await db.deleteNotificationToken(token)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ err: true })
    }
})

// lOGIN AND REGISTER SIMPLE --------------------------------------

module.exports = router;
