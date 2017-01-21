var admin = require("firebase-admin");
var serviceAccount = require("./config/firebase/serviceAccountCredentials.json");
var databaseURL = require("./config/firebase/config.json").databaseURL;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

admin.database.enableLogging(true);

var sessionsRef = admin.database().ref("sessions");
sessionsRef.push({
  startedAt: admin.database.ServerValue.TIMESTAMP
});