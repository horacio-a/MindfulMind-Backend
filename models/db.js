var mysql = require('mysql');
var util = require('util');

const env = process.env

var pool = mysql.createPool({
    connectionLimit: 10,
    host: env.NODE_ENV === 'test' ? env.MYSQL_HOST_TESTING : env.NODE_ENV === 'production' ? env.MYSQL_HOST : env.MYSQL_HOST_DEVELOPMENT,
    user: env.NODE_ENV === 'test' ? env.MYSQL_USER_TESTING : env.NODE_ENV === 'production' ? env.MYSQL_USER : env.MYSQL_USER_DEVELOPMENT,
    password: env.NODE_ENV === 'test' ? env.MYSQL_PASSAWORD_TESTING : env.NODE_ENV === 'production' ? env.MYSQL_PASSAWORD : env.MYSQL_PASSAWORD_DEVELOPMENT,
    database: env.NODE_ENV === 'test' ? env.MYSQL_DB_NAME_TESTING : env.NODE_ENV === 'production' ? env.MYSQL_DB_NAME : env.MYSQL_DB_NAME_DEVELOPMENT
}
)

pool.query = util.promisify(pool.query)


module.exports = pool;