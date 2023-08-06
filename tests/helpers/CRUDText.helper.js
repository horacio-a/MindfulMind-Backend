const db = require('../../models/dbInteraction')

const dataForInsert = {
    "data": {
        id: 1,
        "user": "Horacio",
        "title": "Text for Testing",
        "colorHex": "#FFFFFF",
        "date": "2023-08-01T05:00:00.000Z",
        "lastEdition": "2023-08-01T05:00:00.000Z",
        "text": "ñ"
    }
}

const dataForUpdate = {
    "data": {
        id: 1,
        "user": "Horacio",
        "title": "Text for Testing but update",
        "colorHex": "#FFFFFF",
        "date": "2023-08-01T05:00:00.000Z",
        "lastEdition": "2023-08-01T05:00:00.000Z",
        "text": "ó"
    },
    id: 1
}

const dataForDelete = {
    data: {
        user: 'Horacio',
        id: 1
    }
}

async function RestartText(params) {
    await db.RestartText()
}



module.exports = { RestartText, dataForInsert, dataForUpdate, dataForDelete }