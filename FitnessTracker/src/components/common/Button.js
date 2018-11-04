import React from "react";
import { Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Button = ({ onPress, children, type, size }) => {
  const { buttonStyle, textStyle } = styles;

  const buttonType = function(type) {
    if (type === "primary") {
      return ["#00ccff", "#17d1ff", "#2fd5ff"];
    } else if (type === "secondary") {
      return ["#B9B9B9", "#ABABAB", "#9F9F9F"];
    } else if (type === "success") {
      return ["#00e7b1", "#00f0b8", "#00f4bb"];
    } else if (type === "danger") {
      return ["#e53935", "#f64348", "#f54b51"];
    } else {
      //Return primary if nothing is defined
      return ["#00ccff", "#17d1ff", "#2fd5ff"];
    }
  };

  const buttonSize = function(size) {
    if (size === "large") {
      return { fontSize: 16, fontWeight: "600" };
    } else if (size === "medium") {
      return { fontSize: 10, fontWeight: "300" };
    } else if (size === "small") {
      return { fontSize: 8, fontWeight: "200", minWidth: "15%" };
    }
    return { fontSize: 16, fontWeight: "600" };
  };

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={buttonType(type)}
        style={styles.LinearGradientStyle}
      >
        <Text style={[textStyle, buttonSize(size)]}>{children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    color: "#fff",
    textAlign: "center",
    margin: 4
  },
  buttonStyle: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5
  },
  LinearGradientStyle: {
    borderRadius: 10
  }
};

export { Button };
