var mysql = require('mysql');
var config=require('../config/config')()

module.exports.con = mysql.createPool(
  config
);
