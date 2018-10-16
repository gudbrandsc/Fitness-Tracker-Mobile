import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, CardSection, Button, Input, Spinner, Header } from "../common";

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
            <Button>Log out</Button>
          </CardSection>
        </Card>
      </View>
    );
  }
}