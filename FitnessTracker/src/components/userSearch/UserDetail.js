import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Linking} from 'react-native';
import {Card, CardSection, Button} from '../common'


const UserDetail = ({user}) => {
  const {FirstName, LastName} = user;
  const {
    thumbnailStyle,
    headerContentStyle,
    thumbnailContainerStyle,
    headerTextStyle,
    imageStyle
  }= styles;

  return (
    <Card>
      <CardSection>
        <View>
          <Text>{ FirstName }</Text>
          <Text>{ LastName }</Text>
        </View>
      </CardSection>
    </Card>
  )
}

const styles = {
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerTextStyle: {
    fontSize: 18
  },
  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  }
};

export default UserDetail;
