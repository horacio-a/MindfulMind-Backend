var express = require('express');
var router = express.Router();
var db = require('../models/dbInteraction')
const { Expo } = require('expo-server-sdk')



// END POINT CALLED BY BACKEND --------------------------------------

router.get('/restartRoutine', async function (req, res, next) {
    try {
        const response = await db.restartRoutine()
        res.status(200).json({ response, request: true })
    } catch (error) {
        res.status(500).json({ request: false })
    }

})

router.post('/SendNotification', async function (req, res, next) {
    const somePushTokens = req.body
    if (somePushTokens[0] !== undefined) {
        let expo = new Expo();

        let messages = [];


        for (let item of somePushTokens) {
            // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

            // Check that all your push tokens appear to be valid Expo push tokens
            if (!Expo.isExpoPushToken(item.pushToken)) {
                console.error(`Push token ${item.pushToken} is not a valid Expo push token`);
                continue;
            }

            // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
            messages.push({
                title: item.title,
                to: item.pushToken,
                sound: 'default',
                body: item.Body,
                data: { withSome: item.pushToken },
            })
        }

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        async function intnto() {
            for (let chunk of chunks) {
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    for (let i = 0; i < ticketChunk.length; i++) {
                        const element = ticketChunk[i];
                        element.to = chunk[i].to
                        tickets.push(element)
                    }

                } catch (error) {
                    console.error(error);
                }
            }
        }
        await intnto()


        let receiptIds = { ids: [], data: [] };
        for (let ticket of tickets) {
            if (ticket.id) {
                receiptIds.ids.push(ticket.id);
                receiptIds.data.push(ticket.to)
            }
        }

        let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds.ids);
        let errorChuck = []

        async function checkError() {
            // Like sending notifications, there are different strategies you could use
            // to retrieve batches of receipts from the Expo service.
            for (let chunk of receiptIdChunks) {
                try {
                    let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

                    // The receipts specify whether Apple or Google successfully received the
                    // notification and information about an error, if one occurred.
                    for (let receiptId in receipts) {
                        let { status, message, details } = receipts[receiptId];
                        if (status === 'ok') {
                            continue;
                        } else if (status === 'error') {


                            console.error(
                                `There was an error sending a notification: ${message}`
                            );
                            if (details && details.error) {
                                // The error codes are listed in the Expo documentation:
                                // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                                // You must handle the errors appropriately.
                                console.error(`The error code is ${details.error}`);

                                if (details.error === 'DeviceNotRegistered') {
                                    errorChuck.push(receiptId)
                                }
                            }


                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }

        await checkError()

        try {
            if (errorChuck[0] !== undefined) {

                for (let i = 0; i < errorChuck.length; i++) {
                    const element = errorChuck[i];
                    const index = receiptIds.ids.findIndex((e) => e === element)
                    await db.deleteNotificationToken(receiptIds.data[index])
                }

            }
        } catch (error) {
            console.log(error)
        }

        res.json(tickets)
    } else {
        res.json({ err: 'Empty body' })

    }

})


router.post('/setNotificationToken', async function (req, res, next) {
    const data = req.body
    if (data !== undefined) {
        const response = await db.insertNotificationToken(data)
        res.status(200).json(response)
    } else {
        res.status(400).json({ err: 'Empty body' })
    }
})

// END POINT CALLED BY BACKEND --------------------------------------








module.exports = router;


