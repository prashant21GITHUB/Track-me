const PropertiesReader = require('properties-reader');
const mysql = require('mysql');

var properties = PropertiesReader('./res/db_config.properties');

console.log(properties.get("db.host"));

var pool  = mysql.createPool({
  connectionLimit : 10,   //default value = 10
  host            : properties.get("db.host"),
  port            : properties.get("db.port"),
  user            : properties.get("db.user"),
  password        : properties.get("db.password"),
  database        : properties.get("db.name")
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.ping((err) => {
        connection.release();
        if (err) throw err;
        console.log('Server responded to ping');
      
    })
    
})
