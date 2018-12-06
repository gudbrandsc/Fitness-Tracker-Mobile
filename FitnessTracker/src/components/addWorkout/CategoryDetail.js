import React, { Component } from "react";
import { Text, View, TouchableWithoutFeedback,  StyleSheet } from "react-native";
import SubCategory from "./SubCategory";


/**
 * Component that displays a workout category, like Chest, cardio, Biceps...
 */
class CategoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: "",
      error: "",
      loading: false,
      follows: true,
      active: false,
      workoutTable: this.props.workout.Workout_tables,
      fieldVal: '',
      activeMissingfield: false
    };
  }

  // If a workout session is submitted then reset active state, if any workouts are missing a field 
  // then allow them to activate missing field border.
  componentWillReceiveProps(nextProps) {
    if(this.props.reset !== nextProps.reset){
      this.setState({active: false})
    }

    if(this.props.missingField !== nextProps.missingField){
      this.setState({activeMissingfield: true})
    }
  } 

  //Function used to store user input to parent component
  subUpdate = (id, value1, value2, value3) => {
    this.props.onUpdate(id, value1, value2, value3)
  };

  // If category detail is active then return a list of SubCategories
  renderDescription(){
    if(this.state.active === true){
      return this.state.workoutTable.map(type =>
        <SubCategory subUpdate={this.subUpdate.bind(this)} key={type.id} type={type} categoryId={this.props.workout.id} inputValues={this.props.inputValues} missingField={this.props.missingField} />
      );
    }
  }

  //Check if component is active or not
  checkActive(){
    if(this.props.active === true){
      return false;
    }
    return true
  }

  render() {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => this.setState({ active: !this.state.active })}>
          <View style={styles.categoryTouchAbleStyle  }>
            <Text style={styles.CategoryNameStyle}>
            {this.props.workout.CategoryName}
            </Text>
          </View>
          </TouchableWithoutFeedback>

          <View style={{ backgroundColor: "#f7f6ef", justifyContent: "center", flexDirection: "column"}}>
          
          {this.renderDescription()}
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  categoryTouchAbleStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    flexDirection: "row",
    borderColor: "#fff",
    position: "relative",
  },
  CategoryNameStyle: {
    color: '#636463',
    fontSize: 20,
    fontFamily:'HelveticaNeue',
  }
});


export default CategoryDetail;
