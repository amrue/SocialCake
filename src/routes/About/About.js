import React from 'react';
import styled from 'styled-components';
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import * as MosaicService from '../../nem/MosaicService.ts';
import * as _ from 'lodash';
import { Mosaic } from 'nem-library';

const Container = styled.div`
  max-width: 600px;
  box-sizing: border-box;
  margin: 0 auto;
`;

const Content = styled(Card)`
  padding: 1em 2em;
  margin: 2em 0;
`;

class About extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Content>
          <Typography type="headline" gutterBottom>
            About Us
          </Typography>
          <Typography type="body1" paragraph>
            SocialCake Team.
          </Typography>
        </Content>
      </Container>
    );
  }
}

export default About;
