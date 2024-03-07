
 

 const {onCall} = require("firebase-functions/v2/https")
 const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 const admin = require ("firebase-admin"); 
 admin.initializeApp();
 const firestore = admin.firestore();
 

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

 exports.get = onRequest(async(request, response) => {
 // logger.info("Hello logs!", {structuredData: true});
   

   const result = await firestore.collection("users").add({name:"Jesse"})
   response.send(result);
 });

 exports.post = onRequest((request, response) => {
 // logger.info("Hello logs!", {structuredData: true});
   response.send("Hello iam a post!");
 });