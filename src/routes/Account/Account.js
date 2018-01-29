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
import FileService from '../../services/FileService';
import DatabaseService from '../../services/DatabaseService';
import * as MosaicService from '../../nem/MosaicService';
import * as NamespaceService from '../../nem/NamespaceService';
import CryptoJS from 'crypto-js';
import { getNamespaceName } from '../../nem/AccountUtils';

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

//implement
const createMosaicForFile = (mosaicId, fileData) => {
  const namespaceName = getNamespaceName();

  MosaicService.createMosaic(mosaicId, namespaceName, fileData).subscribe(
    m => console.log(`Mosaic successfully created ${m}`),
    e => console.log(`Error creating mosaic ${e}`),
  );
};

/*
 * Implement. Create an object with file data, such as name, description,
 * hash, and uploader address
 */
const processFileData = () => {
  let fileData = {
    name: FileService.data.file.name,
    lastModified: FileService.data.file.lastModified,
    md5: FileService.data.hashes.md5,
    sha1: FileService.data.hashes.sha1,
    url: FileService.data.url,
    owner: '', // the owners public key would go here
    price: 1000000,
  };
  DatabaseService.saveFileToDatabase(fileData).then(docRef => {
    createMosaicForFile(docRef, fileData);
  });
};

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
              <input type="file" onChange={FileService.handleFileSelect} />
              <button
                onClick={() => {
                  FileService.handleFileUpload(processFileData);
                }}
              >
                Upload
              </button>
            </div>
            {FileService.data.uploading ? (
              <div>
                <div className="load-bar" />
                <span>Uploading: {FileService.data.percent}%</span>
              </div>
            ) : (
              ''
            )}
            <pre>
              <code>
                {FileService.data.error ? (
                  <span className="error">{FileService.data.error}</span>
                ) : (
                  ''
                )}
              </code>
            </pre>
          </div>
        </Content>
      </Container>
    );
  }
}

export default Home;
