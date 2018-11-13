import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import CategoryDetail from "./CategoryDetail";
import { Button, Spinner } from "../common";
import axios from "axios";

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValues: [],
      loading: false
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

    var exist = this.state.inputValues.find(function(element) {
      return element.id === id;
    });

    if (exist === undefined) {
      this.setState({
        inputValues: [...this.state.inputValues, newelement]
      });
    } else {
      objIndex = this.state.inputValues.findIndex(obj => obj.id == id);
      //Remove elemt if the value is now empty
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
        <CategoryDetail onUpdate={this.onUpdate.bind(this)} key={workout.id} workout={workout} inputValues={this.state.inputValues} reset={this.props.reset} />
      );
    }
    return <Spinner size={"small"} />;
  }

  AddWorkout = () => {
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
