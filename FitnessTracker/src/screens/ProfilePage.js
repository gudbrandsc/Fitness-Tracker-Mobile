import React, { Component } from "react";
import { View, Text } from "react-native";
import { Card, CardSection, Button, Input, Spinner, Header } from "../components/common";

class ProfilePage extends Component {
  render() {
    return (
      <View>
        <Header headerText={"Profile Page"} />
        <Card>
          <CardSection>
            <Button>Log out</Button>
          </CardSection>
        </Card>
      </View>
    );
  }
}

export default ProfilePage;
