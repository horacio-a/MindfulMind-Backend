const { server, restartRoutineJob } = require('../app')
const pool = require('../models/db')
const { restartDB, exampleUser } = require('./helpers/UserSetting.helper')
const { CloseAllServis, request, } = require('./helpers/global.helper')

beforeAll(async () => {
    await restartDB()
    // Con restartDB Borro todos los datos de la tabla user y inserta uno dato
});



describe('userSettings', () => {


    test('empty body For passwordChangeWithPassword ', async () => {
        const response = await request.post('/UserSetting/changePasswordWithPass')
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('Empty body');
    });

    test('error password passwordChangeWithPassword ', async () => {
        const data = {
            user: exampleUser.user,
            oldpassword: 'WrongPasswordForTesting',
        }

        const response = await request.post('/UserSetting/changePasswordWithPass').send({ data })
        expect(response.status).toBe(400);
        expect(response.body.err).toBe(true);
        expect(response.body.errMsg).toBe('contraseña no valida');

    });

    test('Success example passwordChangeWithPassword ', async () => {
        const data = {
            email: exampleUser.email,
            user: exampleUser.user,
            oldpassword: 'PasswordForTesting',
            newpassword: 'NewPasswordForTesting'
        }

        const response = await request.post('/UserSetting/changePasswordWithPass').send({ data })
        expect(response.status).toBe(200);
        expect(response.body.err).toBe(false);
    });



});





afterAll(() => {
    CloseAllServis()

});