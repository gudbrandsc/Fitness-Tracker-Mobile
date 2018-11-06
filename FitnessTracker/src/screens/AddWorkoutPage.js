import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { Spinner, Header } from "../components/common";
import axios from 'axios';
import CategoryList from "../components/addWorkout/CategoryList";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

export default class AddWorkoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: true,
      workouts:[],
      userId: '',
      resetState: false
    };
  }

  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ userId: id });
    } catch (error) {
      this.setState({ error: "Can't get Data. Please check internet connectivity." });
    }
  };

  componentDidMount(){
    this.retrieveDetails();
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
    if(this.state.loading === false && this.state.userId !== ''){
      return <CategoryList showAlert={this.showAlert.bind(this)} workouts={ this.state.workouts } userId={this.state.userId} reset={this.state.resetState} />
    }
    return <Spinner />
  }

  showAlert = (success, message) => {
    const type = 'success';

    if(success !== true){
      type = 'danger'
    } else {
      this.setState({resetState: !this.state.resetState})
    }

    showMessage({
      message: message,
      type: type,
    });
  };



  render() {
    console.log('Call render from page class')
    return (
      <View style={{flex:1}}>
        <Header headerText={"Add Workout"} />
        <FlashMessage style={{height:80}} ref={ref => this.dropdown = ref} />
        <View style={{flex:1, backgroundColor: '#f7f6ef'}}>
        {this.renderWorkoutList()}
        </View>
      </View>
    );
  }
}
