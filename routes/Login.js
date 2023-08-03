var express = require('express');
var router = express.Router();
var axios = require('axios');
var db = require('../models/dbInteraction')
var md5 = require('md5');
const { Expo } = require('expo-server-sdk')
const nodemailer = require("nodemailer");
const transporter = require('../nodeMailer/mailerconfig')
var fs = require('fs');
var handlebars = require('handlebars');
const { token } = require('morgan');

// lOGIN AND REGISTER SIMPLE --------------------------------------

router.post('/login', async function (req, res, next) {

    const user = req.body.user
    const password = req.body.password
    const data = await db.GetLoginByUserAndPassword(user, password)

    if (data !== undefined) {
        if (data.ConfirmRegister != 1) {
            res.json({
                authentication: false,
                errMsg: 'Email no confirmado, porfavor ingrese a su email y confirme su cuenta',
            })
        } else {

            res.json({
                authentication: true,
                user: data.user,
                email: data.email,
                profilePicture: data.profilePicture,
                tutorial: data.tutorial
            })
        }

    } else {
        res.json({
            authentication: false,
            errMsg: 'No encontramos un usuario con esas credenciales'
        })
    }
})

router.post('/register', async function (req, res, next) {
    const data = req.body.obj
    console.log(data)
    console.log(data.password)
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
            email: data.email,
            ConfirmRegister: 0,
            token: generarCodigoAleatorio(),
            PrevToken: generarCodigoAleatorio(),
        }
        let response = await db.InsertUser(obj)
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
            transporter.sendMail(mailOptions, function (error, response) {
                console.log(response.messageId)
                if (error) {
                    console.log(error);
                }
            });
        });

        res.json({ response, userCreate: true })
    } else {
        let ErrorResponse = { error: { email: false, user: false }, userCreate: false }
        if (check[0].user == data.user) {
            ErrorResponse.error.user = true
        }
        if (check[0].email == data.email) {
            ErrorResponse.error.email = true
        }
        res.json(ErrorResponse)
    }

})

// lOGIN AND REGISTER SIMPLE --------------------------------------

module.exports = router;
