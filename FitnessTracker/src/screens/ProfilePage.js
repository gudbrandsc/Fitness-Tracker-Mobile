import React, { Component } from "react";
import { View, Text } from "react-native";
import {
  Card,
  CardSection,
  Button,
  Input,
  Spinner,
  Header
} from "../components/common";

class ProfilePage extends Component {
  render() {
    return (
      <View>
        <Header headerText={"Profile"} />
        <Card>
          <CardSection>
            <Button type={"danger"}>Log out</Button>
          </CardSection>
        </Card>
      </View>
    );
  }
}

export default ProfilePage;
