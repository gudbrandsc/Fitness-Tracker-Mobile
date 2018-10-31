import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView } from "react-native";
import CategoryDetail from './CategoryDetail'
import { Button } from '../common';



class CategoryList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      inputValues: [],
    }
  }

  onUpdate = (id, value1, value2) => {
    const newelement =  { 
      id: id,
      value1: value1,
      value2: value2
    }

    var exist = this.state.inputValues.find(function(element) {
      return element.id === id ;
    });

    if(exist === undefined){
      this.setState({
        inputValues: [...this.state.inputValues, newelement]
      })
    }else{
      objIndex = this.state.inputValues.findIndex((obj => obj.id == id));
      //Remove elemt if the value is now empty
      if(value1 === '' && value2 === '' ){
        this.state.inputValues.splice(objIndex, 1)
      }else{
        this.state.inputValues[objIndex].value1 = value1
        this.state.inputValues[objIndex].value2 = value2

      }
    }
    console.log(this.state.inputValues)
  };


  renderCategoryDetail () {
   return this.props.workouts.map(workout =>
    <CategoryDetail onUpdate={this.onUpdate.bind(this)} key={workout.id} workout={workout} inputValues={this.state.inputValues} />
   );
  }

  AddWorkout = () => {
    this.setState({inputValues: []});

  }

  render(){
    return (
      <View>
      <ScrollView style={styles.container}>
        { this.renderCategoryDetail() }
        <View style={styles.buttonContainerStyle}>
          <Button
          onPress={this.AddWorkout}
          type={"primary"}
          size={"large"}
          children={"Submit"}
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
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
    alignItems: 'center', // cross axis
  },
  container: {
    alignSelf: "stretch",
  },
  submitButtonStyle: {
    height: 27
  },
  buttonContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    flexDirection: "row",
    borderColor: "#fff",
    position: "relative"
  }
});


export default CategoryList;
