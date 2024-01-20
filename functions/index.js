// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");

initializeApp();

exports.createTraslate = onDocumentCreated("user/{userid}/task/{taskid}" ,(event) =>{
  return event.data.ref.set(
    {
      ttitle: 'Traducido titulo',
      tdescription: 'Traducido descripcion',
    },
    {merge: true,});
  });

  exports.updateTraslate = onDocumentUpdated("user/{userid}/task/{taskid}" ,(event) =>{
    const title = event.data.after.data().ttitle ?? '';
    const description = event.data.after.data().tdescription ?? '';

  if(title == '' && description == ''){
    return event.data.after.ref.update({
      ttitle: 'Traducido titulo UpdateE',
      tdescription: 'Traducido descripcion UpdateE',
    });
  }

    return new Promise((resolve, reject) => {
      resolve(true);
    });
});
