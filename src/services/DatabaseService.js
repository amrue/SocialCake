import '@firebase/firestore';
import firebase from '@firebase/app';

const db = firebase.firestore();

//saves data to Firestore
const saveFileToDatabase = file => {
  db
    .collection('files')
    .add({
      fileName: file.name,
      lastModified: file.lastModified,
      md5: file.md5,
      sha1: file.sha1,
      url: file.url,
      ownerAddress: 'somePublicKey',
    })
    .then(function(docRef) {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(function(error) {
      console.error('Error adding document: ', error);
    });
};

const DatabaseService = {
  saveFileToDatabase,
};

export default DatabaseService;
