var express = require('express');
var router = express.Router();
/* GET home page. */
var axios = require('axios');
var db = require('../models/dbInteraction')
const { response } = require('express');


router.get('/newtask/:token', async function (req, res, next) {
    const timeStamp = new Date().getTime()
    const Data = req.body
    console.log(Data)
    // const newTask = {
    //     user: 'horacio',
    //     tasksName: 'Ir al gimnasio',
    //     completed: 0,
    //     updateDate: timeStamp
    // }

    // db.InsertNewTask(newTask)

});



module.exports = router;
