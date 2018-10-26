import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { Button, Spinner, Card, CardSection } from "../common";


class CategoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: "",
      error: "",
      loading: false,
      follows: true,
      active: false,
      workoutTable: this.props.workout.Workout_tables
    };
  }

  renderDescription(){
    console.log(this.state.workoutTable)
    if(this.state.active === true){
    return this.state.workoutTable.map(type =>
      <Text>{type.WorkoutName}</Text>
    );
    }
  }
  checkActive(){
    if(this.props.active === true){
      return false;
    }
    return true
  }

  render() {
    console.log(this.props)
    return (

      <TouchableWithoutFeedback onPress={() => this.setState({active: !this.state.active})}>
        <View>
          <CardSection>
            <Text>
            {this.props.workout.CategoryName}
            </Text>
          </CardSection>
          {this.renderDescription()}
        </View>
      </TouchableWithoutFeedback>

    );
  }
}



export default CategoryDetail;
