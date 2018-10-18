import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, CardSection, Button, Input, Spinner, Header } from "../components/common";

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
            <Button type={'primary'}>Log out</Button>
          </CardSection>
        </Card>
      </View>
    );
  }
}
