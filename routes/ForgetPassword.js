var express = require('express');
var router = express.Router();
var db = require('../models/dbInteraction')
var md5 = require('md5');
const transporter = require('../nodeMailer/mailerconfig')
var fs = require('fs');
var handlebars = require('handlebars');

// Forgot password from register --------------------------------------

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
// Forgot password from register --------------------------------------

module.exports = router;
