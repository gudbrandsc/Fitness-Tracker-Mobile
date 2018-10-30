import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView } from "react-native";
import CategoryDetail from './CategoryDetail'



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
      if(value1 === '' || value2 === '' ){
        this.state.inputValues.splice(objIndex, 1)
      }else{
        this.state.inputValues[objIndex].value1 = value1
        this.state.inputValues[objIndex].value2 = value2

      }
    }
    console.log(this.state.inputValues)
  };


  renderUser () {
   return this.props.workouts.map(workout =>
    <CategoryDetail onUpdate={this.onUpdate.bind(this)} key={workout.id} workout={workout} />
   );
  }

  render(){
    return (
      <ScrollView style={styles.container}>
        { this.renderUser() }
      </ScrollView>
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
  }
});


export default CategoryList;
