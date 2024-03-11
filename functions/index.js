
 

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

 exports.post = onRequest( async(request, response) => {
 // logger.info("Hello logs!", {structuredData: true});

 const body = request.body

 const type = body.type


 if( type === "personLikesMe"){
  const myId = body.myId
  const idofPersonThatILike = body.idofPersonThatILike

   await firestore.collection("users").doc(idofPersonThatILike).collection("TheyLikeMe").doc(myId).set(
    {
uid:myId,
documentReference: firestore.collection("users").doc(myId)

   }
   ,{merge:true})
   response.send("Successfull")

 }

 if( type === "IDontLikeYou"){
  const myId = body.myId
  const idOfPersonThatIDontLike = body.idOfPersonThatIDontLike

  await firestore.collection("users").doc(myId).collection("TheyLikeMe").doc(idOfPersonThatIDontLike).delete()
  response.send("Sucessfully Deleted")
 }

 if (type === "weLikeEachOther"){
  const myId = body.myId
  const idofPersonThatILike = body.idofPersonThatILike

 //I prepare the 2 objects
 // other person´s object
 const otherPersonObject = {
  uid: idofPersonThatILike,
  documentReference: firestore.collection("users").doc(idofPersonThatILike)
}
//  My object 
 const myObject = {
  uid:myId,
  documentReference: firestore.collection("users").doc(myId)
 }

 // 2inserts in welikeeachother subcollection
await firestore.collection("users").doc(idofPersonThatILike).collection("weLikeEachOther").doc(myId).set(myObject, {merge:true})
await firestore.collection("users").doc(myId).collection("weLikeEachOther").doc(idofPersonThatILike).set(otherPersonObject, {merge:true})

// Delete the document from my subcollection of "theyLikeMe"
await firestore.collection("users").doc(myId).collection("TheyLikeMe").doc(idofPersonThatILike).delete()

//Create teh chat Document in the chat collection
const idOfDocument = generateChatId(myId, idofPersonThatILike)

await firestore.collection("chats").doc(idOfDocument).set({
  idsConcatenated: idOfDocument,
  arrayOfPeopleInConversation:[myId, idofPersonThatILike]
},{merge:true})


response.send("We like Each other successfully done")
 }

   response.send("Hello iam a post!");
 });


 const generateChatId = (id1,id2) => {
const array =[id1,id2]
array.sort()
return ´${array[0]}-${array[1]}´


 }