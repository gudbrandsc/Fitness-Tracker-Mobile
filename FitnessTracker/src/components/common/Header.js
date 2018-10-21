// Import libraries for making a component
import React from "react";
import { Text, View } from "react-native";

// Make a component
const Header = props => {
  const { textStyle, viewStyle } = styles;

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{props.headerText}</Text>
    </View>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    height: 63,
    elevation: 2,
    position: "relative",
    borderBottomWidth: 0.5,
    borderColor: '#d6d7da',
  },
  textStyle: {
    paddingTop:20,
    fontWeight: '600',
    color: '#636463',
    fontSize: 22,
    fontFamily:'HelveticaNeue',  }
};

// Make the component available to other parts of the app
export { Header };
