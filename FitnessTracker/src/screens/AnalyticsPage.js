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
      <View style={{flex:1}}>
        <Header headerText={"Analytics"} />
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
