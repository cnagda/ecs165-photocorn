const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const functions = require('firebase-functions');
const admin = require('firebase-admin');
var fetch = require('node-fetch')
admin.initializeApp(functions.config().firebase);

firebase.initializeApp({
    apiKey: "AIzaSyDv2e6dTo4qtQhJ4X5XgT3Wr6TzBbrXorg",
    authDomain: "expo-insta-app.firebaseapp.com",
    databaseURL: "https://expo-insta-app.firebaseio.com",
    projectId: "expo-insta-app",
    storageBucket: "expo-insta-app.appspot.com",
    messagingSenderId: "713043675850"
})

// Credit to tutorial: https://www.youtube.com/watch?v=R2D6J10fhA4
// for push notification send code
// listens for a change to the updates table and notifies all users of the change.
exports.sendPushNotifications = functions.firestore.document('Updates/{id}').onCreate((snap, context) =>{
    //const root = event.data.ref.root
    var messages = []
     console.log("new update!")
     var newUpdate = snap.data()
    // Get all users from the database
    //return root.child('/users').once('value').then(function(snapshot){
      // childSnapshot is an individual user
      if (newUpdate.currUser) {
          firebase.firestore().collection("users").where("userID", "==", newUpdate.currUser).get().then(function(querySnapshot) {
              querySnapshot.forEach(function(childSnapshot){
                 var expoToken = childSnapshot.data().expoToken

                 if (expoToken){
                    messages.push({
                      "to": expoToken,
                      "body": "New Note Added"
                    }
                    )
                 }
                 else {
                    console.log("no token")
                 }
              //})

                return Promise.all(messages)

            }).then(messages =>{
                fetch('https://exp.host/--/api/v2/push/send', {
                  method: "POST",
                  headers:{
                     "Accept": "application/json",
                     "Content-Type": "application/json"
                  },
                  body: JSON.stringify(messages)
                })
            })
          })

      }

});

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return firebase.firestore().collection('messages').doc().set({original: original}).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        return res.redirect(303, snapshot.ref.toString());
    });
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
