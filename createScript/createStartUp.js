'use strict';
const extend = require('lodash').assign;
const mysql = require('mysql');
const config = require('../config/config');
const model= require('../models/model')

const connection = mysql.createConnection(config);

module.exports = {
  createSchema: createSchema
};

if (module === require.main) {
    createSchema(config);
}

function createSchema (config) {
  console.log(config)
  const connection = mysql.createConnection(extend({
    multipleStatements: true
  }, config));

  connection.query(
    `DROP DATABASE IF EXISTS \`messagingapp\`;
    DROP TABLE if exists \`messagingApp\`.\`staffconnection\`;
    CREATE DATABASE IF NOT EXISTS \`messagingApp\`
      DEFAULT CHARACTER SET = 'utf8'
      DEFAULT COLLATE 'utf8_general_ci';
      USE \`messagingApp\`;

      CREATE TABLE IF NOT EXISTS \`messagingApp\`.\`staffconnection\` (
        \`username\` VARCHAR(50) NOT NULL,
        \`password\` LONGTEXT NOT NULL,
        PRIMARY KEY (\`username\`));

        CREATE TABLE IF NOT EXISTS \`messagingApp\`.\`staff\` (
          \`ID\` INT(11) NOT NULL AUTO_INCREMENT,
          \`Name\` VARCHAR(50) NOT NULL,
          \`DateOfBirth\` DATE NOT NULL,
          \`PlaceOfBirth\` VARCHAR(50) NOT NULL,
          \`Sex\` VARCHAR(10) NOT NULL,
          \`MobilePhone\` VARCHAR(50) NOT NULL,
          \`Address\` VARCHAR(300) NOT NULL,
          \`Salary\` INT(11) NOT NULL,
          \`username\` VARCHAR(50) NOT NULL,
          PRIMARY KEY (\`ID\`),
          UNIQUE INDEX \`username\` (\`username\`));


          CREATE TABLE IF NOT EXISTS \`messagingApp\`.\`student\` (
            \`ID\` INT(11) NOT NULL AUTO_INCREMENT,
            \`StaffName\` VARCHAR(50) NOT NULL,
            \`Name\` VARCHAR(50) NOT NULL,
            \`DateOfBirth\` DATE NOT NULL,
            \`PlaceOfBirth\` VARCHAR(200) NOT NULL,
            \`Sex\` VARCHAR(10) NOT NULL,
            \`MobilePhone\` VARCHAR(15) NOT NULL,
            \`Address\` VARCHAR(400) NOT NULL,
            \`class\` VARCHAR(5) NOT NULL,
            PRIMARY KEY (\`ID\`),
            INDEX \`Index 2\` (\`StaffName\`),
            CONSTRAINT \`staff_fk_1\` FOREIGN KEY (\`StaffName\`) REFERENCES \`staff\` (\`username\`));
            `,
    (err) => {
      if (err) {
        throw err;
      }
      else{
        console.log('in elaw')
        model.addUser({username:"admin", password:"password"},(err,result)=>{
          if (err)
            console.log(err);
          else{
            console.log('Admin Created Successfully')
          }
          
        });
        console.log('Successfully created schema');

      }
      
      connection.end();
    }
  );
}
