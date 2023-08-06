var mysql = require('mysql');
var util = require('util');

const env = process.env

var pool = mysql.createPool({
    connectionLimit: 10,
    host: env.NODE_ENV === 'test' ? env.MYSQL_HOST_TESTING : env.MYSQL_HOST,
    user: env.NODE_ENV === 'test' ? env.MYSQL_USER_TESTING : env.MYSQL_USER,
    password: env.NODE_ENV === 'test' ? env.MYSQL_PASSAWORD_TESTING : env.MYSQL_PASSAWORD,
    database: env.NODE_ENV === 'test' ? env.MYSQL_DB_NAME_TESTING : env.MYSQL_DB_NAME
}
)

pool.query = util.promisify(pool.query)


module.exports = pool;