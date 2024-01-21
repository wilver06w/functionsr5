const {axios} = require("axios");

const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");

initializeApp();

const createTraslate = async (text, targetLanguageCode) => {
  const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${process.env.TRANSLATEKEY}`,
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

  var titleEng = await createTraslate(title, 'en');
  var descriptionEng =   await createTraslate(description, 'en');

    return  event.data.ref.set(
        {
          ttitle: titleEng,
          tdescription: descriptionEng,
        },
        {merge: true,});
});




  exports.updateTraslate = onDocumentUpdated("user/{userid}/task/{taskid}" ,async (event) =>{
    const ttitle = event.data.after.data().ttitle ?? '';
    const tdescription = event.data.after.data().tdescription ?? '';
    const title = event.data.after.data().title ?? '';
    const description = event.data.after.data().description ?? '';

  if(ttitle == '' && tdescription == ''){
    var titleEng = await createTraslate(title, 'en');
    var descriptionEng =   await createTraslate(description, 'en');

    return event.data.after.ref.update({
      ttitle: titleEng,
      tdescription: descriptionEng,
    });
  }

    return new Promise((resolve, reject) => {
      resolve(true);
    });
});
