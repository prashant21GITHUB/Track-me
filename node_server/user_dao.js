const db = require("./db.js");

function registerUser(user) {
  var query = {
    sql: "INSERT INTO user(name, mobile, password) VALUES (?, ?, ?)",
    values: [user.name, user.mobile, user.password]
  };
  const dbPromise = new Promise((resolve, reject) => {
    db.executeQuery(query, (err, results, fields) => {
      if (err) {
        if (err.code == "ER_DUP_ENTRY") {
          console.log("User already registered with mobile number ", user.mobile);
          reject("User already registered with mobile number " + user.mobile);
        } else {
          console.log(err.code, err.sqlMessage);
          reject(err.code + " " + err.sqlMessage);
        }

      } else {
        resolve("User registered successfully");
      }
    });
  });
  return dbPromise;
}

function isMobileNumberRegistered(mobile) {
  var query = {
    sql: "SELECT name FROM user WHERE mobile = ?",
    values: [mobile]
  };
  const dbPromise = new Promise((resolve, reject) => {
    db.executeQuery(query, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        if (results.length == 1) {
          resolve({
            success: true
          });
        } else if (results.length == 0) {
          reject({
            success: false,
            message: "User is not registered"
          });
        }
      }
    });
  });
  return dbPromise;
}

function addContactToShareLocation(from_mobile, to_mobile, to_name) {
  var query = {
    // sql: "INSERT INTO shared_location_contacts(from_mobile, to_mobile, to_name) VALUES (?, ?, ?)",
    //Also checking If contact is registered or not
    sql: "INSERT INTO shared_location_contacts(from_mobile, to_mobile, to_name) SELECT ?, ?, ? FROM user WHERE mobile = ?",
    values: [from_mobile, to_mobile, to_name, to_mobile]
  };
  const dbPromise = new Promise((resolve, reject) => {
    db.executeQuery(query, (err, results, fields) => {
      if (err) {
        if (err.code == "ER_DUP_ENTRY") {
          reject("Contact is already added");
        } else {
          reject(err.code + " " + err.message);
        }
      } else {
        if (results.affectedRows == 1) {
          resolve({
            success: true
          });
        } else if (results.affectedRows == 0) {
          reject("Contact is not registered");
        } else {
          reject("Internal error");
        }
      }
    });
  });
  return dbPromise;

}

function addContactToTrackLocation(mobile, tracking_contact_number) {
  var query = {
    // sql: "INSERT INTO shared_location_contacts(from_mobile, to_mobile, to_name) VALUES (?, ?, ?)",
    //Also checking If contact is registered or not
    sql: "INSERT INTO tracking_contacts(mobile, tracking) SELECT ?, ? FROM user WHERE mobile = ?",
    values: [mobile, tracking_contact_number, tracking_contact_number]
  };
  const dbPromise = new Promise((resolve, reject) => {
    db.executeQuery(query, (err, results, fields) => {
      if (err) {
        if (err.code == "ER_DUP_ENTRY") {
          reject("Contact is already added");
        } else {
          reject(err.code + " " + err.message);
        }
      } else {
        if (results.affectedRows == 1) {
          resolve({
            success: true
          });
        } else if (results.affectedRows == 0) {
          reject("Contact is not registered");
        } else {
          reject("Internal error");
        }
      }
    });
  });
  return dbPromise;

}

function deleteContactToShareLocation(from_mobile, to_mobile) {
  var query = {
    sql: "DELETE FROM shared_location_contacts WHERE from_mobile= ? AND to_mobile= ?",
    values: [from_mobile, to_mobile]
  };
  const dbPromise = new Promise((resolve, reject) => {
    db.executeQuery(query, (err, results, fields) => {
      if (err) {
        reject(err.code + " " + err.message);
      } else {
        if (results.affectedRows == 1) {
          resolve({
            success: true
          });
        } else {
          reject({
            success: false,
            message: "Contact is not present in location sharing list"
          });
        }
      }
    });
  });
  return dbPromise;
}

function deleteContactFromTrackingContacts(mobile, tracking_contact_number) {
  var query = {
    sql: "DELETE FROM tracking_contacts WHERE mobile = ? AND tracking = ?",
    values: [mobile, tracking_contact_number]
  };
  const dbPromise = new Promise((resolve, reject) => {
    db.executeQuery(query, (err, results, fields) => {
      if (err) {
        reject(err.code + " " + err.message);
      } else {
        if (results.affectedRows == 1) {
          resolve({
            success: true
          });
        } else {
          reject({
            success: false,
            message: "Contact is not present in tracking contacts list"
          });
        }
      }
    });
  });
  return dbPromise;
}

function getTrackingDetails(mobile) {
  let query = {
    sql: "SELECT to_mobile FROM shared_location_contacts WHERE from_mobile = ?",
    values: [mobile]
  };
  const dbPromise = new Promise((resolve, reject) => {
    db.executeQuery(query, (err, results, fields) => {
      if (err) {
        reject(err.code + " " + err.message);
      } else {

        const sharingWith = new Array();
        
        for (let res of results) {
          sharingWith.push(res.to_mobile);
        }
        console.log("Sharing list db results: " + results);
        console.log("Sharing list: " + sharingWith);
        let query = {
          sql: "SELECT tracking FROM tracking_contacts WHERE mobile = ?",
          values: [mobile]
        };
        let innerPromise = new Promise((resolve, reject) => {
          db.executeQuery(query, (err, results, fields) => {
            if (err) {
              reject(err.code + " " + err.message);
            } else {
              let tracking = new Array();
              for (let res of results) {
                tracking.push(res.tracking);
              }
              console.log("Tracking: " + tracking);
              resolve(tracking);
            }
          })
        });
        innerPromise.then((tracking) => {
          resolve({
            sharingWith: sharingWith,
            tracking: tracking
          })
        }, (err) => {
          reject(err.code + " " + err.message)
        });
      }
    });
  });
  return dbPromise;
}

module.exports.getTrackingDetails = getTrackingDetails;
module.exports.deleteContactToShareLocation = deleteContactToShareLocation;
module.exports.addContactToShareLocation = addContactToShareLocation;
module.exports.registerUser = registerUser;
module.exports.isMobileNumberRegistered = isMobileNumberRegistered;
module.exports.deleteContactFromTrackingContacts = deleteContactFromTrackingContacts;
module.exports.addContactToTrackLocation = addContactToTrackLocation;
