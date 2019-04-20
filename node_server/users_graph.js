const userMap = new Map();

class TrackingDetails {
    constructor() {
        this.sharingWith = new Set();
        this.tracking = new Set();
    }
};
function addUser(mobile, list_of_contacts) {
    console.log(mobile, list_of_contacts);
    let trackingDetails = userMap.get(mobile);
    if (trackingDetails == undefined) {
        trackingDetails = new TrackingDetails();
        userMap.set(mobile, trackingDetails);
    } 
    const oldSharingWithList = trackingDetails.sharingWith;
    const newSharingWithSet = new Set();
    for(let contact of list_of_contacts) {
        contact = contact.toString();
        newSharingWithSet.add(contact);
        if(oldSharingWithList.has(contact)) {
            oldSharingWithList.delete(contact);
        }
        contactTrackingDetails = userMap.get(contact);
        if(contactTrackingDetails == undefined) {
            contactTrackingDetails = new TrackingDetails();
            userMap.set(contact, contactTrackingDetails);
        }
        contactTrackingDetails.tracking.add(mobile);
    }
    trackingDetails.sharingWith = newSharingWithSet;
    for (let item of oldSharingWithList.keys()) {
        userMap.get(item).tracking.delete(mobile);
    } 

    
    console.log("Usermap: ", userMap);
}

//TODO , Return clone of User details
function getUserDetails(mobile) {
    let trackingDetails = userMap.get(mobile);
    if(trackingDetails == undefined) {
        trackingDetails = new TrackingDetails();
        userMap.set(mobile, trackingDetails);
    }
    return trackingDetails;
}

module.exports.addUser = addUser;
module.exports.getUserDetails = getUserDetails;