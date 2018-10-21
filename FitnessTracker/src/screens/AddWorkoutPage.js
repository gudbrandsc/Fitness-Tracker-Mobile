import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Card,
  CardSection,
  Input,
  Spinner,
  Header
} from "../components/common";

export default class AddWorkoutPage extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <Header headerText={"Add Workout"} />
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
