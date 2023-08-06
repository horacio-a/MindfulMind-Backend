const { server, restartRoutineJob } = require('../app')
const pool = require('../models/db')
const { restartDB, exampleUserConfirmed, exampleUser } = require('./helpers/Login.helper')
const { CloseAllServis, request, } = require('./helpers/global.helper')

beforeAll(async () => {
    // Con restartDB Borro todos los datos de la tabla user y inserta uno dato
    await restartDB()
});


describe('Login', () => {

    test('empty body For login ', async () => {
        const response = await request.post('/login/login')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });

    test('Wrong crencials login', async () => {
        const response = await request.post('/login/login').send({
            user: 'WrongUser',
            password: 'WrongPassword'
        })
        expect(response.status).toBe(200);
        expect(response.body.authentication).toBe(false);
        expect(response.body.errMsg).toBe('No encontramos un usuario con esas credenciales');
    });

    test('Success login but not confirmed', async () => {
        const response = await request.post('/login/login').send({
            user: 'HoracioNotConfirmed',
            password: 'PasswordForTesting'
        })
        expect(response.status).toBe(200);
        expect(response.body.authentication).toBe(false);
        expect(response.body.errMsg).toBe('Email no confirmado, porfavor ingrese a su email y confirme su cuenta');
    });

    test('Success login', async () => {
        const response = await request.post('/login/login').send({
            user: 'HoracioConfirmed',
            password: 'PasswordForTesting'
        })
        expect(response.status).toBe(200);
        expect(response.body.authentication).toBe(true);
        expect(response.body.user).toBe(exampleUserConfirmed.user);
        expect(response.body.email).toBe(exampleUserConfirmed.email);
        expect(response.body.profilePicture).toBe(exampleUserConfirmed.profilePicture);
        expect(response.body.tutorial).toBe(exampleUserConfirmed.tutorial);
    });

});


describe('Register', () => {


    test('empty body for register', async () => {
        const response = await request.post('/login/register')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });

    test('Incorrect registration by email', async () => {
        let data = {
            obj: {
                user: 'PotentialUser',
                email: 'emailfor@testings.com'
            }
        }
        const response = await request.post('/login/register').send(data)
        expect(response.status).toBe(400);
        expect(response.body.error.email).toBe(true);
        expect(response.body.error.user).toBe(false);
        expect(response.body.userCreate).toBe(false);
    });

    test('Incorrect registration by username', async () => {
        let data = {
            obj: {
                user: 'HoracioConfirmed',
                email: 'Potential@email.com'
            }
        }
        const response = await request.post('/login/register').send(data)
        expect(response.status).toBe(400);
        expect(response.body.error.email).toBe(false);
        expect(response.body.error.user).toBe(true);
        expect(response.body.userCreate).toBe(false);
    });

    test('Incorrect registration by username and email', async () => {
        let data = {
            obj: {
                user: 'HoracioConfirmed',
                email: 'emailfor@testings.com'
            }
        }
        const response = await request.post('/login/register').send(data)
        expect(response.status).toBe(400);
        expect(response.body.error.email).toBe(true);
        expect(response.body.error.user).toBe(true);
        expect(response.body.userCreate).toBe(false);
    });

    test('Success registration', async () => {
        let data = {
            obj: exampleUser
        }
        const response = await request.post('/login/register').send(data)
        expect(response.status).toBe(200);
        expect(response.body.userCreate).toBe(true);
        expect(response.body.response.affectedRows).toBe(1);

    });

});





afterAll(() => {
    CloseAllServis()


});