import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, CardSection, Button, Input, Spinner, Header } from "../common";

export default class AnalyticsPage extends Component {
  render() {
    return (
      <View>
        <Header headerText={"Analytics"} />
        <Card>
          <CardSection>
            <Button>Log out</Button>
          </CardSection>
        </Card>
      </View>
    );
  }
}