// const {translateImport} = require('@google-cloud/translate').v2;
const {TranslationServiceClient} = require('@google-cloud/translate');

// Configuration for the client
const translationServiceClient = new TranslationServiceClient({
    // credentials: CREDENTIALS,
    projectId: 'quizr5-411821',
});


async function translateText(text) {
// const translateText = async (text) => {

  try {
      let [response] = await translationServiceClient.translate(text, 'en');
      console.log(`Error at translateText --> ${error}`);
      return response;
  } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return '';
  }
};

// async function translateTextNew(text) {
//   // Construct request
//   const request = {
//       parent: `projects/${projectId}/locations/${location}`,
//       contents: [text],
//       mimeType: 'text/plain', // mime types: text/plain, text/html
//       sourceLanguageCode: 'en',
//       targetLanguageCode: 'es',
//   };

//   // Run request
//   const [response] = await translationClient.translateText({
//     contents: [text],
//     mimeType: 'text/plain', // mime types: text/plain, text/html
//     sourceLanguageCode: 'es',
//     targetLanguageCode: 'en',
//   });

//   for (const translation of response.translations) {
//       return translation.translatedText;
//   }
// }
