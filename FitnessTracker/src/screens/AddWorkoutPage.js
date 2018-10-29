import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Spinner, Header } from "../components/common";
import axios from 'axios';
import CategoryList from "../components/addWorkout/CategoryList";


export default class AddWorkoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: true,
      workouts:[],
      userId: '',
    };
  }

  componentDidMount(){
    axios.get('http://localhost:8000/api/workoutcategories').then(response => this.setState({ workouts: response.data })).then(this.checkSearchResp.bind(this));
  }

  checkSearchResp(){
    if((this.state.workouts && this.state.workouts.length > 0)){
      this.setState({error: '', loading: false })
    } else {
      this.setState({error: 'Unable to fetch workouts', loading: false })
    }
  }


  renderWorkoutList(){
    if(this.state.loading === false){
      console.log(this.state.workouts)
      console.log('Render CategoryList')
      return <CategoryList workouts={ this.state.workouts }/>
    }
    return <Spinner />
  }


  render() {
    return (
      <View style={{flex:1}}>
        <Header headerText={"Add Workout"} />
        <View style={{flex:1, backgroundColor: '#e9e9ef'}}>
        {this.renderWorkoutList()}
        </View>
      </View>
    );
  }
}
