const PropertiesReader = require('properties-reader');
const mysql = require('mysql');

var properties = PropertiesReader('./res/db_config.properties');

console.log(properties.get("db.host"));

var pool = mysql.createPool({
    connectionLimit: 10,   //default value = 10
    host: properties.get("db.host"),
    port: properties.get("db.port"),
    user: properties.get("db.user"),
    password: properties.get("db.password"),
    database: properties.get("db.name")
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.ping((err) => {
        connection.release();
        if (err) throw err;
        console.log('Server responded to ping');

    })

})

function executeQuery(query, callback) {

    pool.query(query, (err, results, fields) => {
        if(err) {
            callback(err);
        } else {
            callback(err, results, fields, fields);
        }
    });

}

function executeQueryList(queryList, callbackList) {
    pool.getConnection((err, connection) => {
        if(err) {
            
        }
        connection.beginTransaction((err) => {
            if(err) throw err;
        
            for(var i=0; i<queryList.length; i++) {
                connection.query(queryList[i], callbackList[i]);
            }
            connection.commit((err) => {
                connection.rollback(() => {
                    throw err;
                })
            })
            console.log("Transaction success");
        })
    });
}

module.exports.executeQuery = executeQuery;