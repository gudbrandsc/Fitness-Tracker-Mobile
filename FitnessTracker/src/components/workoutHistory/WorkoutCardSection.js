import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ExerciseItem from './ExerciseItem'

class WorkoutCardSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  render() {
    return (
      <View styles={styles.container}>
       <ExerciseItem
            imageurl={this.props.exercise.categoryurl}
            workoutName={this.props.exercise.workoutname}
            cardio={this.props.exercise.cardio}
            sets={this.props.exercise.noofsets}
            reps={this.props.exercise.noofreps}
            weight={this.props.exercise.weight}
          /> 
      </View>
  );
  }
}
export default WorkoutCardSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


