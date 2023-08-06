var express = require('express');
var router = express.Router();
var db = require('../models/dbInteraction')




// CRUD TEXT ------------------------------------------------------------

router.post('/createtext', async function (req, res, next) {
    const data = req.body.data
    console.log(data)
    if (data !== undefined) {
        try {
            const insert = await db.createText(data)
            const response = await db.GetTextByUsers(data.user)
            data.id = insert.insertId
            res.status(200).json({
                data,
                response
            })
        } catch (error) {
            res.status(400).json({
                err: true,
            })
        }
    } else {
        res.status(400).json({
            err: true,
            errMsg: 'Empty body'
        })

    }

})

router.post('/updatetext', async function (req, res, next) {
    const data = req.body.data
    const id = req.body.id
    if (data !== undefined && id !== undefined) {
        try {
            await db.UpdateText(data, id)
            const response = await db.GetTextByUsers(data.user)
            data.id = id
            res.status(200).json({
                data,
                response
            })
        } catch (error) {
            res.status(400).json({
                err: error
            })
        }
    } else {
        res.status(400).json({
            err: true,
            errMsg: 'Empty body'
        })

    }

})


router.post('/deleteText', async function (req, res, next) {
    const data = req.body.data
    if (data !== undefined) {
        await db.deleteText(data.user, data.id)
        res.json({
            data
        })
    } else {
        res.status(400).json({
            err: true,
            errMsg: 'Empty body'
        })

    }


})

// CRUD TEXT ------------------------------------------------------------



module.exports = router;
