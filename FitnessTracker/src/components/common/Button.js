import React from "react";
import { Text, TouchableOpacity } from "react-native";

const Button = ({ onPress, children, type, size }) => {
  const { buttonStyle, textStyle } = styles;

  const buttonType = function(type) {
    if (type === "primary") {
      return { backgroundColor: "#007aff", borderColor: "#0071ec" };
    } else if (type === "secondary") {
      return { backgroundColor: "#6c757d", borderColor: "#6c757d" };
    } else if (type === "danger") {
      return { backgroundColor: "#dc3545", borderColor: "#dc3545" };
    }
    return { backgroundColor: "#00ab38", borderColor: "#00ab38" };
  };

  const buttonSize = function(size) {
    if (size === "large") {
      return { fontSize: 16, fontWeight: "600" };
    } else if (size === "medium") {
      return { fontSize: 10, fontWeight: "300" };
    } else if (size === "small") {
      return { fontSize: 8, fontWeight: "200" };
    }
    return { fontSize: 16, fontWeight: "600" };
  };

  return (
    <TouchableOpacity onPress={onPress} style={[buttonStyle, buttonType(type)]}>
      <Text style={[textStyle, buttonSize(size)]}>{children}</Text>
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
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5
  }
};

export { Button };
