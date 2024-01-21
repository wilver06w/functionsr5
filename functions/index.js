const  request = require("request");
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

async function translateTextRequest(text, targetLanguageCode) {
// const translateTextRequest = async (text, targetLanguageCode) => {
  const url = 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyBNb9ZXA7e3yZUsJhKgsykgtLNJ1it0Njc';
try{
  request(
    {
      url: url,
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST',
    json: {q: text, target: targetLanguageCode,}
  }, function(error, response, body){
    const translation = response.body.data.translations[0];
    const translatedText = translation.translatedText;

    logger.info("Traducido: "+translatedText);
    return translatedText;
  });
}catch(error){
  logger.info("Error: "+error);
  return error;
}
};
// async function translateTextRequest(text, targetLanguageCode) {
//   const url = 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyBNb9ZXA7e3yZUsJhKgsykgtLNJ1it0Njc';
// try{
//   request(
//     {
//       url: url,
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     method: 'POST',
//     json: {q: text, target: targetLanguageCode,}
//   }, function(error, response, body){
//     const translation = response.body.data.translations[0];
//     const translatedText = translation.translatedText;

//     logger.info("Traducido: "+translatedText);
//     return translatedText;
//   });
// }catch(error){
//   logger.info("Error: "+error);
//   return error;
// }
// };

// async function translateTextRequest(text, targetLanguageCode) {
//   try {
//     const url = 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyBNb9ZXA7e3yZUsJhKgsykgtLNJ1it0Njc';

//     const options = {
//       url,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//       json: { q: text, target: targetLanguageCode },
//     };

//     const response = request(options);
//     const translation = response.body.data.translations[0];
//     const translatedText = translation.translatedText;

//     return translatedText;
//   } catch (error) {
//     console.error('Error al traducir texto:', error);
//     throw error;
//   }
// }


exports.createTraslate = onDocumentCreated("user/{userid}/task/{taskid}" ,async (event) =>{

  const title = event.data.data().title ?? '';
  const description = event.data.data().description ?? '';
  logger.info(title);
  logger.info(description);

  var titleEng = await translateTextRequest(title, 'en');
  var descriptionEng =   await translateTextRequest(description, 'en');

  logger.info(titleEng);
  logger.info(descriptionEng);

  if (titleEng !== undefined && descriptionEng !== undefined) {

    return  event.data.ref.set(
        {
          ttitle: 'aca',
          tdescription: 'ww',
        },
        {merge: true,});
      }
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
