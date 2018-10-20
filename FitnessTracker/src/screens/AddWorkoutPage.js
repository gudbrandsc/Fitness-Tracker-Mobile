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
      <View>
        <Header headerText={"Add Workout"} />
        <Card>
          <CardSection>
            <Text>Under Construction</Text>
          </CardSection>
        </Card>
      </View>
    );
  }
}
