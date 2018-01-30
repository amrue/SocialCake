import React from 'react';
import styled from 'styled-components';
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import '@firebase/storage';
import '@firebase/firestore';
import firebase from '@firebase/app';
import FileService from '../../services/FileService';
import DatabaseService from '../../services/DatabaseService';
import * as MosaicService from '../../nem/MosaicService';
import * as NamespaceService from '../../nem/NamespaceService';
import CryptoJS from 'crypto-js';

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

const TextFieldStyle = {
  margin: '10px 0 10px 0',
};

const UploadButtonStyle = {
  marginLeft: '40px',
};

const state = {
  uploaderAddress: '',
  salePrice: '',
};

const createMosaicForFile = (mosaicId, fileData) => {
  MosaicService.createMosaic(mosaicId, fileData).subscribe(
    m => console.log(`Mosaic successfully created ${m}`),
    e => console.log(`Error creating mosaic ${e}`),
  );
};

// process uploaded file data and create mosaic
const processFileData = () => {
  let fileData = {
    name: FileService.data.file.name,
    lastModified: FileService.data.file.lastModified,
    md5: FileService.data.hashes.md5,
    sha1: FileService.data.hashes.sha1,
    url: FileService.data.url,
    owner: state.uploaderAddress,
    price: state.salePrice,
  };
  DatabaseService.saveFileToDatabase(fileData).then(docRef => {
    createMosaicForFile(docRef, fileData);
  });
};

function handleFormChange(e) {
  state.publicKey = e.target.value;
}

class Home extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Content>
          <Typography type="headline">Upload A File</Typography>
          <Typography type="body1">
            For user {this.props.user && this.props.user.displayName}
          </Typography>
          <div className="container">
            <div className="form">
              <TextField
                style={TextFieldStyle}
                label="NEM Address"
                helperText="Sales will be sent to this address"
                onChange={e => {
                  state.uploaderAddress = e.target.value;
                }}
                fullWidth
              />
              <br />
              <TextField
                style={TextFieldStyle}
                label="Sale Price"
                helperText="Price to charge customers in XEM"
                onChange={e => {
                  state.salePrice = e.target.value;
                }}
                fullWidth
                type="number"
              />
              <br />
              <br />

              <input
                id="raised-button-file"
                style={{ display: 'none' }}
                type="file"
                onChange={FileService.handleFileSelect}
              />

              <label htmlFor="raised-button-file">
                <Button raised component="span">
                  Choose File
                </Button>
              </label>

              <Button
                style={UploadButtonStyle}
                raised
                color="primary"
                onClick={() => {
                  FileService.handleFileUpload(processFileData);
                }}
              >
                Upload
              </Button>
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
