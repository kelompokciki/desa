function getCollection(collectionName) {
  return firebaseDb.collection(collectionName).get();
}

function getDocument(collectionName, docId) {
  return firebaseDb.collection(collectionName).doc(docId).get();
}

window.getCollection = getCollection;
window.getDocument = getDocument;
