import React, { Component } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

class FadeBox extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0) // Initial value for opacity: 0
  };

  fadeIn() {
    Animated.timing(
      this.state.fadeAnim, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 350 // Make it take a while 350 ms
      }
    ).start(); // Starts the animation
  }

  fadeout() {
    Animated.timing(
      this.state.fadeAnim, // The animated value to drive
      {
        toValue: 0, // Animate to opacity: 0 (opaque)
        duration: 100 // Make it take a while 100 ms
      }
    ).start(); // Starts the animation
  }

  renderContent() {
    if (this.props.errorMsg !== "") this.fadeIn();
    else this.fadeout();
    let { fadeAnim } = this.state;

    return (
      <Animated.View // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim // Bind opacity to animated value
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }

  render() {
    return this.renderContent();
  }
}

class AnimationErrorBox extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <FadeBox
          style={{
            width: "100%",
            height: this.props.viewHeight,
            backgroundColor: "#FF0000",
            justifyContent: "space-between",
            position: "absolute",
            bottom: 0
          }}
          errorMsg={this.props.errorMsg}
        >
          <Text
            style={{
              width: "100%",
              fontSize: 20,
              textAlign: "left",
              margin: 15,
              fontWeight: "bold"
            }}
          >
            {this.props.errorMsg}
          </Text>
          <TouchableOpacity style={{ margin: 10 }} onPress={this.props.onPress}>
            <Text style={{ fontSize: 18, textAlign: "right" }}>Close</Text>
          </TouchableOpacity>
        </FadeBox>
      </View>
    );
  }
}

export default AnimationErrorBox;
