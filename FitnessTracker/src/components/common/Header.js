// Import libraries for making a component
import React from "react";
import { Text, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
// Make a component
const Header = props => {
  const { textStyle, viewStyle } = styles;

  return (
  <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#00ccff', '#00e6d3', '#00e7b1']} style={styles.viewStyle}>
    <Text style={styles.textStyle}>
      {props.headerText}
    </Text>
</LinearGradient>
  );
};

const styles = {
  viewStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    elevation: 2,
    position: "relative",
  },
  textStyle: {
    paddingTop:20,
    fontWeight: '600',
    color: '#fff',
    fontSize: 22,
    fontFamily:'arial', 
   },
};

// Make the component available to other parts of the app
export { Header };
