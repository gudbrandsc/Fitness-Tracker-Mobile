import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, CardSection, Button, Input, Spinner, Header } from "../components/common";

export default class AddWorkoutPage extends Component {
  render() {
    return (
      <View>
        <Header headerText={"Add Workout"} />
        <Card>
          <CardSection>
            <Button type={'primary'}>Log out</Button>
          </CardSection>
        </Card>
      </View>
    );
  }
}
