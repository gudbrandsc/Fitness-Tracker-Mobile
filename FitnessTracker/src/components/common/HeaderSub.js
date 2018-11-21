// Import libraries for making a component
import React from "react";
import { Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {Button} from './Button'

// Make a component
const HeaderSub = props => {
  const { textStyle, viewStyle } = styles;
  const { goBack } = this.props.navigation;

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["#00ccff", "#00e6d3", "#00e7b1"]}
      style={viewStyle}
    >
      <Button onPress={() => goBack()} title="Go back " />

    {this.text}
      <Text style={textStyle}>{props.headerText}</Text>
    </LinearGradient>
  );
};

const styles = {
  viewStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    position: "relative"
  },
  textStyle: {
    paddingTop: 20,
    fontWeight: "600",
    color: "#fff",
    fontSize: 22,
    fontFamily: "arial"
  }
};

// Make the component available to other parts of the app
export { HeaderSub };
