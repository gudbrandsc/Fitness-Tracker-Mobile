import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";

/**
 * Component that displays a specific workout exercise.
 */
export default class ExerciseItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      follows: false,
      start: true
    };
  }

  // Render information about the exercise. 
  renderWorkoutDetails() {
    if (this.props.cardio === "true") {
      return (
        <View style={styles.SubWorkoutDetails}>
          <Text style={styles.WorkoutText}>Time:</Text>
          <Text style={{ marginRight: 5, fontSize: 14 }}>
            {this.props.sets} min
          </Text>
          <Text style={styles.WorkoutText}>Distance:</Text>
          <Text style={{ marginRight: 5, fontSize: 14 }}>
            {this.props.reps} miles
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.SubWorkoutDetails}>
        <Text style={styles.WorkoutText}>Sets:</Text>
        <Text style={{ marginRight: 5, fontSize: 14 }}>{this.props.sets}</Text>
        <Text style={styles.WorkoutText}>Reps:</Text>
        <Text style={{ marginRight: 5, fontSize: 14 }}>{this.props.reps}</Text>
        <Text style={styles.WorkoutText}>Weight:</Text>
        <Text style={{ marginRight: 5, fontSize: 14 }}>{this.props.weight}</Text>
      </View>
    );
  }

  render() {
    return (
        <View style={styles.MainContainer}>   
            <View style={styles.WorkoutContainer}>
            <Avatar
                large
                source={{
                uri: this.props.imageurl
                }}
            />
                <View style={styles.WorkoutDetailsMain}>
                    <Text style={{ fontSize: 18}}>
                    {this.props.workoutName}
                    </Text>
                    {this.renderWorkoutDetails()}
                </View>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    MainContainer: {
      flex: 1,
      margin: 5,
      flexDirection: "column",
      justifyContent: "space-evenly",
      elevation: 2,
      borderBottomWidth: 1,
      borderColor: '#ddd'
    },

    WorkoutContainer: {
      height: "auto",
      flexDirection: "row",
      width:'80%',
    },
    WorkoutDetailsMain: {
      flexDirection: "column",
      justifyContent: "space-evenly",
      paddingLeft: 5
    },
    SubWorkoutDetails: {
      flexDirection: "row",
      paddingRight: 5
    },
    WorkoutText: {
      marginRight: 5,
      fontSize: 14,
      fontWeight: "bold",
      color: '#404040'
    }
});