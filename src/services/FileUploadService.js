import '@firebase/storage';
import '@firebase/firestore';
import firebase from '@firebase/app';

const storageRef = firebase.storage().ref();

const data = {
  uploading: false,
  percent: 0,
  file: '',
  error: '',
};

const handleFileSelect = e => {
  data.file = e.target.files[0];
};

const handleFileUpload = () => {
  data.uploading = true;
  var someVar = storageRef.child('file').put(data.file);
  someVar
    .then(snap => {
      data.uploading = false;
    })
    .catch(err => data.error.message);

  someVar.on(
    'state_changed',
    function(snapshot) {
      var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    },
    function(error) {
      // Handle unsuccessful uploads
    },
    function() {
      var downloadURL = someVar.snapshot.downloadURL;
      console.log(downloadURL);
    },
  );
};

const FileUploadService = {
  data,
  handleFileSelect,
  handleFileUpload,
};
export default FileUploadService;
