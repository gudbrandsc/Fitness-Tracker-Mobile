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
      <View>
        <Header headerText={"HomePage"} />
        <Card>
          <CardSection>
            <Text>Under Construction</Text>
          </CardSection>
        </Card>
      </View>
    );
  }
}
