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

async function translateText() {
  const text = 'Hola como estas!';
  const targetLanguageCode = 'es'; // English

  const [response] = await client.translateText({
    contents: [text],
    targetLanguageCode: targetLanguageCode,
    locations: 'global',
  });

  const translation = response.translations[0];
  logger.info(`Translated text: ${translation.translatedText}`);
}

exports.createTraslate = onDocumentCreated("user/{userid}/task/{taskid}" ,async (event) =>{

  const title = event.data.data().title ?? '';
  const description = event.data.data().description ?? '';
  logger.info(title);
  logger.info(description);

  // const titleEng =
   await translateText(title, 'en');
  // const descriptionEng =
   await translateText(description, 'en');

  logger.info(titleEng);
  logger.info(descriptionEng);

  return event.data.ref.set(
    {
      ttitle: '',
      tdescription: '',
      //  await  traslateClass.translateText(description)
      //       .then((res) => {
      //           console.log(res);
      //       })
      //       .catch((err) => {
      //           console.log(err);
      //       }),
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
