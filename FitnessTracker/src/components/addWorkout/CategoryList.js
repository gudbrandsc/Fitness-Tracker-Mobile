import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import CategoryDetail from "./CategoryDetail";
import { Button, Spinner } from "../common";
import axios from "axios";

/**
 * Component that renders a list of all exercise categories, and submits a workout session.
 *  
 */
class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValues: [], //List of all exercise that the user has added 
      loading: false,
      missingField: false,
      error:""
    };
  }

  /*Method used by child components to add input data to state list*/
  onUpdate = (id, value1, value2, value3) => {
    const newelement = {
      id: id,
      value1: value1,
      value2: value2,
      value3: value3
    };
    //Check if the exercise is already in the list
    var exist = this.state.inputValues.find(function(element) {
      return element.id === id;
    });

    //If exercise is not in the list 
    if (exist === undefined) {
      this.setState({
        inputValues: [...this.state.inputValues, newelement]
      });
    } else {
      objIndex = this.state.inputValues.findIndex(obj => obj.id == id);
      //If the user removed all input fields for a exercise then it should be removed.
      if (value1 === "" && value2 === "" && value3 === "") {
        this.state.inputValues.splice(objIndex, 1);
      } else {
        this.state.inputValues[objIndex].value1 = value1;
        this.state.inputValues[objIndex].value2 = value2;
        this.state.inputValues[objIndex].value3 = value3;
      }
    }
  };

  //Method to reset the state when a workout is submitted.
  componentWillReceiveProps(nextProps) {
    if (this.props.reset !== nextProps.reset) {
      this.setState({ inputValues: [], loading: false });
    }
  }

  /* Render all sub categories, if get request has not recieved data yet -> load spinner */
  renderCategoryDetail () {
    if(this.state.loading !== true){
      return this.props.workouts.map(workout =>
        <CategoryDetail onUpdate={this.onUpdate.bind(this)} key={workout.id} workout={workout} inputValues={this.state.inputValues} reset={this.props.reset} missingField={this.state.missingField}/>
      );
    }
    return <Spinner size={"small"} />;
  }

  // Function that submits a workout session to the backend. 
  AddWorkout = () => {
    var allFieldsEntered = true;
    
    // Checks that the user has added atleast one exercise else show alert
    if(this.state.inputValues && this.state.inputValues.length > 0 ){
      for(var i in this.state.inputValues) {
        // For each exercise that the user has entered make sure that all required input fields have been entered
        if(this.state.inputValues[i].value1 === "" || this.state.inputValues[i].value2 === "" || this.state.inputValues[i].value3 === ""  ){
          allFieldsEntered = false;
        }
      }

      // If there is an exercise with a missing inputfield then notify sub components to highlight them, and show an alert to the user.
      // Else submit the workout session.
      if(allFieldsEntered){
      this.setState({ loading: true });
      axios
        .post("http://localhost:8000/api/newexercise", {
          userid: this.props.userId,
          workouts: this.state.inputValues
        })
        .then(response => {
          if (response.status === 200) {
            this.props.showAlert(true, "Workout added");
          }
        })
        .catch(error => {
          this.props.showAlert(false, error);
        });
      } else {
        this.setState({ missingField: !this.state.missingField });
        alert("Please enter value all inputs for you exercises ")
      }
    }else{
      alert("Add atleast one exercise")
    }
  };

  render() {
    return (
      <View>
        <ScrollView style={styles.container}>
          {this.renderCategoryDetail()}
          <View style={styles.buttonContainerStyle}>
            <Button
              onPress={this.AddWorkout}
              type={"primary"}
              size={"large"}
              children={"Add workout"}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  v_container: {
    flex: 1,
    flexDirection: "column", // main axis
    justifyContent: "center", // main axis
    alignItems: "center" // cross axis
  },
  container: {
    alignSelf: "stretch"
  },
  submitButtonStyle: {
    height: 27
  },
  buttonContainerStyle: {
    paddingTop: 25,
    justifyContent: "center",
    flexDirection: "row",
    position: "relative"
  }
});

export default CategoryList;
