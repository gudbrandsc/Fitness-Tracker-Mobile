import React, { Component } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { Avatar } from "react-native-elements";

export default class WorkoutItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      follows: false,
      start: true
    };
  }

  renderWorkoutDetails() {
    if (this.props.category === "Cardio") {
      return (
        <View style={styles.SubWorkoutDetails}>
          <Text style={styles.WorkoutText}>Time:</Text>
          <Text style={{ marginRight: 5, fontSize: 16 }}>
            {this.props.sets} min
          </Text>
          <Text style={styles.WorkoutText}>Distance:</Text>
          <Text style={{ marginRight: 5, fontSize: 16 }}>
            {this.props.reps} meters
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.SubWorkoutDetails}>
        <Text style={styles.WorkoutText}>Sets:</Text>
        <Text style={{ marginRight: 5, fontSize: 16 }}>{this.props.sets}</Text>
        <Text style={styles.WorkoutText}>Reps:</Text>
        <Text style={{ marginRight: 5, fontSize: 16 }}>{this.props.reps}</Text>
        <Text style={styles.WorkoutText}>Weight:</Text>
        <Text style={{ marginRight: 5, fontSize: 16 }}>
          {this.props.weight}
        </Text>
      </View>
    );
  }

  render() {
    styles = {
      MainContainer: {
        flex: 1,
        margin: 5,
        flexDirection: "column",
        justifyContent: "space-evenly",
      
        elevation: 2
      },
      HeaderContainer: {
        height: "auto",
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 5
      },
      userDetails: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        paddingLeft: 5
      },
      WorkoutContainer: {
        height: "auto",
        width: "100%",
        flexDirection: "row",
        padding: 10
      },
      WorkoutDetailsMain: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        paddingLeft: 20
      },
      SubWorkoutDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 5
      },
      WorkoutText: {
        marginRight: 5,
        fontSize: 16,
        fontWeight: "bold"
      }
    };
    return (
      <View style={styles.MainContainer}>
        <View style={styles.HeaderContainer}>
          <View style={styles.userDetails}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {this.props.fullName}
            </Text>
            <Text style={{ fontSize: 14 }}>{this.props.email}</Text>
          </View>
          <Text style={{ fontSize: 14 }}>{this.props.time}</Text>
        </View>
        <View style={styles.WorkoutContainer}>
          <Avatar
            large
            source={{
              uri: this.props.imageurl
            }}
          />
          <View style={styles.WorkoutDetailsMain}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {this.props.workoutName}
            </Text>
            {this.renderWorkoutDetails()}
          </View>
        </View>
      </View>
    );
  }
}
