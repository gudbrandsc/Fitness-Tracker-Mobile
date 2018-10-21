import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Card,
  CardSection,
  Button,
  Input,
  Spinner,
  Header
} from "../components/common";

export default class Homepage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex:1}}>
        <Header headerText={"HomePage"} />
        <View style={{flex:1, backgroundColor: '#e9e9ef'}}>
        <Card>
          <CardSection>
            <Text>Under Construction</Text>
          </CardSection>
        </Card>
        </View>
      </View>
    );
  }
}
