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
            <strong>SocialCake:</strong> Sell directly to your fans and
            followers
          </Typography>
          <Typography type="body1" paragraph>
            SocialCake allows content creators of all kinds to sell digital
            goods directly to their audience. Artists, musicians, writers, and
            more can sell digital content simply by sharing a message.
          </Typography>
          <Typography type="body1" paragraph>
            Start by signing up and uploading a file. Then, you will receive a
            unique file ID. Share this ID on Facebook, Twitter, YouTube, or
            anywhere else you reach your audience. They send a payment with
            their NEM wallet to SocialCake using your ID as the message.
            SocialCake instantly sends them a Mosaic with an encrypted download
            link to the file, and file metadata such as the hashes to verify the
            integrity of the file and prove that they own it.
          </Typography>
        </Content>
      </Container>
    );
  }
}

export default Home;
