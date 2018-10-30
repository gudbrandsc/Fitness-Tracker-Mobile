import React, { Component } from "react";
import { Text, View, TouchableWithoutFeedback } from "react-native";
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
    };
  }

  subUpdate = (id, value1, value2) => {
    this.props.onUpdate(id, value1, value2)

  };

  renderDescription(){
    if(this.state.active === true){
    return this.state.workoutTable.map(type =>
      <SubCategory subUpdate={this.subUpdate.bind(this)} key={type.id} type={type}>

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
      <Card>
      <TouchableWithoutFeedback onPress={() => this.setState({active: !this.state.active})}>
        <View>
          <CardSection>
            <Text>
            {this.props.workout.CategoryName}
            </Text>
          </CardSection>
          <View style={{    backgroundColor: "#fff", justifyContent: "center", flexDirection: "column",}}>
          {this.renderDescription()}
          </View>
        </View>
      </TouchableWithoutFeedback>
      </Card>
    );
  }
}



export default CategoryDetail;
