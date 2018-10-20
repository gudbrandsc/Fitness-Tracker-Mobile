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

export default class AnalyticsPage extends Component {
  render() {
    return (
      <View>
        <Header headerText={"Analytics"} />
        <Card>
          <CardSection>
            <Text>Under Construction</Text>
          </CardSection>
        </Card>
      </View>
    );
  }
}
