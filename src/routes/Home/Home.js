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
import stomp from 'stompjs';
import * as nem from 'nem-sdk';

import DatabaseService from '../../services/DatabaseService';
import * as MosaicService from '../../nem/MosaicService';

import * as config from '../../config';

const Container = styled.div`
  max-width: 600px;
  box-sizing: border-box;
  margin: 0 auto;
`;

const Content = styled(Card)`
  padding: 1em 2em;
  margin: 2em 0;
`;

// create a STOMP client for testnet
const stompClient = stomp.client(
  'ws://104.128.226.60:7778/w/messages/websocket',
);

// subscribe to blockchain notifications for our address
// parse message to find file customer has purchased
const callback = function(frame) {
  stompClient.subscribe(
    '/unconfirmed/TDJOEZOVQOOLUQTGVT5ST43SIGC35OE6JA7GKIT5',
    function(data) {
      let transaction = JSON.parse(data.body).transaction;
      // ignore messages sent by us
      if (transaction.signer == config.nem.testKey) return;
      let customerPublicKey = transaction.signer;
      let message = transaction.message;
      let productId = nem.default.utils.format.hexMessage(message);
      let docRef = DatabaseService.getFileFromDatabase(productId);
      sendFileToCustomer(docRef, customerPublicKey);
    },
  );
};

const sendFileToCustomer = (docRef, customerPublicKey) => {
  docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        let message = doc.data().url;
        console.log(doc.id.toLowerCase());
        MosaicService.sendSingleMosaicWithEncryptedMessage(
          doc.id.toLowerCase(),
          customerPublicKey,
          message,
        );
      } else {
        // doc.data() is undefined
        console.log('No such document!');
      }
    })
    .catch(function(error) {
      console.log('Error getting document:', error);
    });
};
// Connect and subscribe
stompClient.connect({}, callback);

class Home extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Content>
          <Typography type="headline" gutterBottom>
            <strong>React Starter Kit</strong> for Firebase and GraphQL
          </Typography>
          <Typography type="body1" paragraph>
            This is a boilerplate project for creating React applications.
          </Typography>
          <Typography type="body1" paragraph>
            <a href="https://github.com/kriasoft/react-firebase-starter">
              https://github.com/kriasoft/react-firebase-starter
            </a>
          </Typography>
        </Content>
      </Container>
    );
  }
}

export default Home;
