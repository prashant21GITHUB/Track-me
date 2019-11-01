const FCM = require('fcm-node');
const PropertiesReader = require('properties-reader');
const login_dao = require('./login_dao.js');

const properties = PropertiesReader('./res/fcm_keys.properties');
const SERVER_KEY = properties.get('SERVER_KEY');
const fcm = new FCM(SERVER_KEY);

function getNotificationData(source_mobile, action) {
    if(action == "STARTED_SHARING") {
        return {
            ACTION : "STARTED_SHARING",
            PUBLISHER : source_mobile
        }
    }
    if(action == "TRACKING_REQUEST") {
        return {
            ACTION : "TRACKING_REQUEST",
            SUBSCRIBER : source_mobile
        }
    }
    return {};
}

function getMessage(source_mobile, action) {
    if(action == "STARTED_SHARING") {
        return source_mobile +" has started sharing location with you.";
    }
    if(action == "TRACKING_REQUEST") {
        return  source_mobile +" wants to track your location."
    }
    return "";
}

async function sendNotification(source_mobile, target_mobile, action) {
    let noti_data = getNotificationData(source_mobile, action);
    let noti_msg = getMessage(source_mobile, action);
    var targetDeviceToken;
    try{
        targetDeviceToken = await login_dao.getFCMToken(target_mobile);
    } catch(err) {
        console.log("Device token not found for mobile,", target_mobile);
    }
    if(targetDeviceToken == undefined) {
        console.log("Not sending push notification,", target_mobile);
        return;
    }
    const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: targetDeviceToken,
        collapse_key: 'com.pyb.trackme',
        
        notification: {
            title: 'Hi', 
            body: noti_msg
        },
        
        data : noti_data
        // data: {  //you can send only notification or only data(or include both)
        //     ACTION: 'STARTED_SHARING',
        //     PUBLISHER: '7767947111' 
        // }
    };
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong while sending push notification to mobile: ", target_mobile, err.message);
        } else {
            console.log("Successfully sent push notification to mobile: ", target_mobile);
        }
    });

}

module.exports.sendNotification = sendNotification;
