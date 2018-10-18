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
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View>
        <Header headerText={"My Profile"} />
        <Card>
          <CardSection>
            <Button
              type={"secondary"}
              onPress={() => {
                this.props.navigation.navigate("details");
              }}
            >
              Details
            </Button>
          </CardSection>
        </Card>
      </View>
    );
  }
}

export default ProfilePage;
