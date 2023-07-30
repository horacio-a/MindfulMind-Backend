var express = require('express');
var router = express.Router();
var db = require('../models/dbInteraction')

router.get('/registerConfirmation/:user/:email', async function (req, res, next) {
    const email = req.params.email
    const user = req.params.user

    await db.ConfirmRegister(email, user)

    res.render('index', {
        layout: 'layout'
    })
});


module.exports = router;
