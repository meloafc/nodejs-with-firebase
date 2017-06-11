var firebase = require("firebase");
var firebaseConfig = require("./config/firebaseConfig.json").config;

firebase.initializeApp(firebaseConfig);

firebase.database.enableLogging(true);

var sessionsRef = firebase.database().ref("sessions");
sessionsRef.push({
  startedAt: firebase.database.ServerValue.TIMESTAMP
});