const request = require("request");
const axios = require("axios");

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.

const {TranslationServiceClient} = require('@google-cloud/translate');
// const {TranslationServiceClient} = require('@google-cloud/translate').v2;

const {logger} = require("firebase-functions");
const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
require('dotenv').config();

// const CREDENTIALS = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
// const {traslateClass} = require("./google_translate");
// The Firebase Admin SDK to access Firestore.
initializeApp();

const client = new TranslationServiceClient();



const createTraslate = async (text, targetLanguageCode) => {
  const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyBNb9ZXA7e3yZUsJhKgsykgtLNJ1it0Njc`,
  {
    q: text, target: targetLanguageCode,
  });

  const data = response.data.data;
  const translation = data.translations[0];
  const translatedText = translation.translatedText;


  return translatedText;
};


exports.createTraslate = onDocumentCreated("user/{userid}/task/{taskid}" ,async (event) =>{

  const title = event.data.data().title ?? '';
  const description = event.data.data().description ?? '';
  logger.info(title);
  logger.info(description);

  var titleEng = await createTraslate(title, 'en');
  var descriptionEng =   await createTraslate(description, 'en');

  logger.info(titleEng);
  logger.info(descriptionEng);

  // if (titleEng !== undefined && descriptionEng !== undefined) {

    return  event.data.ref.set(
        {
          ttitle: titleEng,
          tdescription: descriptionEng,
          // ttitle: 'aca',
          // tdescription: 'ww',
        },
        {merge: true,});
      // }
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
