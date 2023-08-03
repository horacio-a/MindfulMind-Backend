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









// CRUD ROUTINE ------------------------------------------------------------

router.post('/newtask', async function (req, res, next) {
    const timeStamp = new Date().getTime()
    const Data = req.body
    console.log(Data.user)
    const OrderNumber = await db.GetLastNumberOrder(Data.user)
    console.log(OrderNumber)
    const newTask = {
        user: Data.user,
        tasksName: Data.title,
        completed: 0,
        updateDate: timeStamp,
        Orden: OrderNumber === undefined ? 1 : parseInt(OrderNumber) + 1
    }
    const Response = await db.InsertNewTask(newTask)
    newTask.id = Response.insertId
    res.json(newTask)
});

router.post('/ReOrder', async function (req, res, next) {
    const obj = req.body.obj
    const user = obj.info.user
    console.log(obj.data)
    const query = ['UPDATE tasks SET Orden = CASE id']
    for (let i = 0; i < obj.data.length; i++) {
        const element = obj.data[i];
        query.push(`WHEN ${element.id} THEN ${element.NewOrden}`)
    }
    query.push(`END WHERE USER = "${user}"`)
    const response = await db.ReOrderTasks(query.join(' '))
    async function Tasks() {

        const data = await db.GetTaskByUsers(user)
        let taskComplete = 0
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.completed === 1) {
                taskComplete = taskComplete + 1
            }
        }
        let porcentaje = (taskComplete / data.length * 100).toFixed(0) + '%'
        const obj = {
            data,
            porcentaje: porcentaje
        }
        return (obj)
    }
    res.json(await Tasks())
})

router.delete('/DeleteTasks', async function (req, res, next) {

    const data = req.body
    console.log(data)
    await db.DeleteTasks(data.user, data.id)

    console.log(data.user)
    async function Tasks() {

        const response = await db.GetTaskByUsers(data.user)
        let taskComplete = 0
        for (let i = 0; i < response.length; i++) {
            const element = response[i];
            if (element.completed === 1) {
                taskComplete = taskComplete + 1
            }
        }
        let porcentaje = (taskComplete / response.length * 100).toFixed(0) + '%'
        const obj = {
            data: response,
            porcentaje: porcentaje
        }
        return (obj)
    }
    res.json(await Tasks())
})

router.post('/completeTask', async function (req, res, next) {
    const timeStamp = new Date().getTime()
    const dataReq = JSON.parse(req.body.obj)
    const response = await db.GetTaskForCheck(dataReq.user, dataReq.id)
    if (response[0].completed === 0) {
        const obj = { id: dataReq.id, user: dataReq.user, tasksName: dataReq.tasksName, completed: 1, updateDate: timeStamp }
        const alterRows = await db.updateStateTask(obj, dataReq.user, dataReq.id)
        const data = await db.GetTaskByUsers(dataReq.user)

        let taskComplete = 0
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.completed === 1) {
                taskComplete = taskComplete + 1
            }
        }
        let porcentaje = (taskComplete / data.length * 100).toFixed(0) + '%'
        res.json({ work: true, change: 0, data, porcentaje })
    } else {
        const obj = { id: dataReq.id, user: dataReq.user, tasksName: dataReq.tasksName, completed: 0, updateDate: timeStamp }
        const alterRows = await db.updateStateTask(obj, dataReq.user, dataReq.id)

        const data = await db.GetTaskByUsers(dataReq.user)
        let taskComplete = 0
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.completed === 1) {
                taskComplete = taskComplete + 1
            }
        }
        let porcentaje = (taskComplete / data.length * 100).toFixed(0) + '%'
        res.json({ work: true, change: 1, data, porcentaje })
    }
})

// CRUD ROUTINE ------------------------------------------------------------


module.exports = router;
