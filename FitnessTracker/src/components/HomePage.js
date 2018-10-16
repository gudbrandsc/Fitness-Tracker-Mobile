import React, { Component } from "react";
import { Text, View } from "react-native";

/**
 * A class that handles homepage
 * @author Hassan Ch
 */
class HomePage extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Welcome HomePage</Text>
      </View>
    );
  }
}

export default HomePage;
