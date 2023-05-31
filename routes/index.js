var express = require('express');
var router = express.Router();
/* GET home page. */
var axios = require('axios');
var db = require('../models/dbInteraction')
const { response } = require('express');
const { use } = require('../app');


router.post('/newtask/:token', async function (req, res, next) {
    const timeStamp = new Date().getTime()
    const Data = req.body
    console.log(Data)
    const newTask = {
        user: 'horacio',
        tasksName: 'Ir al gimnasio',
        completed: 0,
        updateDate: timeStamp
    }

    db.InsertNewTask(newTask)

});

router.get('/task/:users', async function (req, res, next) {
    const user = req.params.users
    const data = await db.GetTaskByUsers(user)
    res.json(data)
})



module.exports = router;
