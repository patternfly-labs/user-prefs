const functions = require("firebase-functions");
const app = require('express')();
const cors = require('cors');

app.use(cors({ origin: true }));

const { getUserPrefs, editUserPref, getUserPref } = require('./API/userPrefs');

/*
 Get all prefs
*/
app.get('/prefs', getUserPrefs);
/*
 Post a pref 
 ex body:
 {
    "key": "test.checkboxId",
    "value": "true"
}
*/
app.get('/pref/:key', getUserPref);
app.post('/pref', editUserPref);

exports.api = functions.https.onRequest(app);

// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
// });
