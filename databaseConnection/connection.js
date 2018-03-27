var mysql = require('mysql');
var config=require('../config/config')()

module.exports.con = mysql.createConnection({
  connectionLimit:config.connectionLimit,
  host: config.host,
  user: config.user,
  password: config.password,
  port:config.port,
  database: config.database,
  multipleStatements: true
})