const FCM = require('fcm-node');
const PropertiesReader = require('properties-reader');

const properties = PropertiesReader('./res/fcm_keys.properties');
const SERVER_KEY = properties.get('SERVER_KEY');

console.log("Key", SERVER_KEY);
const fcm = new FCM(SERVER_KEY);



var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: "cUzKdb5gQ1I:APA91bEivoHXLIicYEV7CdAS21JeW0IUyzy5JbSmMTmuJ_C4hEsfkbKVHNs70WZElV1zO5qK3r1igpRqFkYz5aaQKePM6LrsAThcbJRySzwHHovHmu49gwb-1-OYu-8bPzh6aVbzJKpR", 
    collapse_key: 'com.pyb.trackme',
    
    notification: {
        title: 'Hi prashant', 
        body: '7767947111 has started sharing location with you.' 
    },
    
    data: {  //you can send only notification or only data(or include both)
        ACTION: 'STARTED_SHARING',
        PUBLISHER: '7767947111'
    }
};

fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});
