/**
 * React Starter Kit for Firebase and GraphQL
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

/* @flow */

import React from 'react';
import styled from 'styled-components';
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import '@firebase/storage';
import '@firebase/firestore';
import firebase from '@firebase/app';
import FileUploadService from '../../services/FileUploadService';

const storageRef = firebase.storage().ref();
const db = firebase.firestore();

const Container = styled.div`
  max-width: 600px;
  box-sizing: border-box;
  margin: 0 auto;
`;

const Content = styled(Card)`
  padding: 1em 2em;
  margin: 2em 0;
`;

//saves data to Firestore
const saveToDatabase = () => {
  db
    .collection('users')
    .add({ first: 'Ada', last: 'Lovelace', born: 1815 })
    .then(function(docRef) {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(function(error) {
      console.error('Error adding document: ', error);
    });
};

//implement
const calculateFileHash = () => {
  //see https://github.com/sytelus/CryptoJS
  //specifically the rollups for md5 and sha1 (md5 is more important for now)
};

//implement
const createMosaicForFile = () => {
  //all nem specifical services should be in the nem directory
};

/*
 * Implement. Create an object with file data, such as name, description,
 * hash, and uploader address
 */
const processFileData = () => {};

class Home extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Content>
          <Typography type="headline">My Account</Typography>
          <Typography type="body1">
            Welcome, {this.props.user && this.props.user.displayName}!
          </Typography>
          <div className="container">
            <div className="form">
              <input
                type="file"
                onChange={FileUploadService.handleFileSelect}
              />
              <button onClick={FileUploadService.handleFileUpload}>
                Upload
              </button>
            </div>
            {FileUploadService.data.uploading ? (
              <div>
                <div className="load-bar" />
                <span>Uploading: {FileUploadService.data.percent}%</span>
              </div>
            ) : (
              ''
            )}
            <pre>
              <code>
                {FileUploadService.data.error ? (
                  <span className="error">{FileUploadService.data.error}</span>
                ) : (
                  ''
                )}
                {JSON.stringify(FileUploadService.data.file, null, 2)}
              </code>
            </pre>
          </div>
        </Content>
      </Container>
    );
  }
}

export default Home;
