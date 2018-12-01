import React, { Component } from "react";
import { Text, View, TouchableWithoutFeedback,  StyleSheet } from "react-native";
import { Card, CardSection } from "../common";
import SubCategory from "./SubCategory";


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

  componentWillReceiveProps(nextProps) {
    if(this.props.reset !== nextProps.reset){
      this.setState({active: false})
    }

    if(this.props.missingField !== nextProps.missingField){
      this.setState({activeMissingfield: true})
    }
} 


  subUpdate = (id, value1, value2, value3) => {
    console.log("cat detail: " + value1 + " and " + value2 + " and " + value3)
    this.props.onUpdate(id, value1, value2, value3)
  };

  renderDescription(){
    if(this.state.active === true){
      return this.state.workoutTable.map(type =>
        <SubCategory subUpdate={this.subUpdate.bind(this)} key={type.id} type={type} categoryId={this.props.workout.id} inputValues={this.props.inputValues} missingField={this.props.missingField} >

        </SubCategory>
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
