
const db = require('../../models/dbInteraction')
const md5 = require('md5');

const exampleUserNotConfirmed = {
    user: 'HoracioNotConfirmed',
    password: md5('PasswordForTesting'),
    email: 'emailfor@testings.com',
    token: '12345678',
    PrevToken: '91011121',
    ConfirmRegister: 0,
    tutorial: 0,
    profilePicture: 0
}
const exampleUserConfirmed = {
    user: 'HoracioConfirmed',
    password: md5('PasswordForTesting'),
    email: 'emailfor@testings.com',
    token: '12345678',
    PrevToken: '91011121',
    ConfirmRegister: 1,
    tutorial: 0,
    profilePicture: '0'
}

const exampleUser = {
    user: 'Horacio',
    password: md5('PasswordForTesting'),
    email: 'emailforInsert@testings.com',
    token: '12345678',
    PrevToken: '91011121',
    ConfirmRegister: 1,
    tutorial: 0,
    profilePicture: '0'
}


async function restartDB() {
    await db.RestartUsers()
    await db.InsertUser(exampleUserNotConfirmed)
    await db.InsertUser(exampleUserConfirmed)
}


module.exports = {
    restartDB,
    exampleUserConfirmed,
    exampleUser
}