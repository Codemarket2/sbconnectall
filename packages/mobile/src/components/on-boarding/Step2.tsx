import React from 'react';
import { View } from 'react-native';
import { Button, Caption, Headline, Subheading, Divider } from 'react-native-paper';
import styled from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const StyledWraper = styled.View`
  flex: 1;
`;

const Card = styled.View`
  margin: 8px 0;
  flex-direction: row;
  align-items: center;
`;
const Gap = styled.View`
  margin: 8px 0;
`;

export default function Step1({ handleContinue }) {
  return (
    <StyledWraper>
      <Headline style={{ textAlign: 'center' }}> Great, let's get Empowered</Headline>
      <Subheading style={{ textAlign: 'center' }}>
        Discover the different ways you can take your business to the next level.
      </Subheading>
      <Gap />
      <CardComponent
        caption={`Coaching is personal. No matter what your expertise is,${'\n'} this is the place to share it.`}
      />
      <Divider />
      <CardComponent
        caption={`Achieve better results. From introduction to impact,${'\n'} all of Drreamz is at your fingertips.`}
      />
      <Divider />
      <CardComponent
        caption={`A new opportunity. Wherever and whenever you need,${'\n'}you'll always have someone to turn to.`}
      />
      <Gap />
      <Button mode="contained" onPress={() => handleContinue(3)}>
        Continue
      </Button>
    </StyledWraper>
  );
}

const CardComponent = ({ caption }) => (
  <Card>
    <View>
      <MaterialCommunityIcons name="briefcase-variant" size={40} />
    </View>
    <View style={{ marginLeft: 8 }}>
      <Caption>{caption}</Caption>
    </View>
  </Card>
);
