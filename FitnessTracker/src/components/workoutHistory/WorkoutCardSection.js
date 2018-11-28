import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet,  Text, View, FlatList} from 'react-native';
import { Icon } from 'react-native-elements'
import ExerciseItem from './ExerciseItem'

class WorkoutCardSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    }
  }

  getIcon(){
    if(this.state.active === true){
        return 'remove-circle-outline';
    }
    return  'add-circle-outline' ;
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


