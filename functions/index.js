// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

exports.changeTitle = onDocumentCreated("user/{userid}/task/{taskid}" ,(event) =>{
    return event.data.ref.set(
      {
        ttitle: 'Traducido titulo',
        tdescription: 'Traducido descripcion',
      },
   {merge: true,});
});