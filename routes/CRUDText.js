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






// CRUD TEXT ------------------------------------------------------------

router.post('/createtext', async function (req, res, next) {
    const data = req.body.data

    try {
        const insert = await db.createText(data)
        const response = await db.GetTextByUsers(data.user)
        data.id = insert.insertId
        res.json({
            data,
            response
        })
    } catch (error) {
        res.json({
            err: error
        })
    }
})

router.post('/updatetext', async function (req, res, next) {
    const data = req.body.data
    const id = req.body.id
    try {
        await db.UpdateText(data, id)
        const response = await db.GetTextByUsers(data.user)
        data.id = id
        res.json({
            data,
            response
        })
    } catch (error) {
        res.json({
            err: error
        })
    }


})


router.post('/deleteText', async function (req, res, next) {
    const data = req.body.data
    await db.deleteText(data.user, data.id)
    res.json({
        data
    })
})

// CRUD TEXT ------------------------------------------------------------



module.exports = router;