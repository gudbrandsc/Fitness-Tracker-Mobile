import React, { Component } from "react";
import { ScrollView, View, StyleSheet, AsyncStorage } from "react-native";
import {Header, Spinner} from "../components/common"
import WorkoutCard from "../components/workoutHistory/WorkoutCard";
import axios from 'axios';

class WorkoutHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      history: [],
      loading: true,
      userId: "", 
    };
  }

  componentDidMount(){
    this.retrieveDetails();
  }

  retrieveDetails = async () => {
    console.log("HELOSOSOSSO")

    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ userId: id });
      console.log(id)
      this.fetchData(id)
    } catch (error) {
      this.setState({ error: "Can't get Data. Please check internet connectivity." });
    }
  };

  fetchData(id) {
    console.log("Fetch data")
    axios
      .get("http://localhost:8000/api/newexercisehistory/" + id)
      .then(response => this.setState({ history: response.data, loading: false }))
  }


  getHistory(){
    if(this.state.userId !== ""){
      console.log("send get" + this.state.userId);
    }
  }

  showList(){
    if(this.state.loading === false){
      console.log(this.state.history)
      return this.state.history.map(session =>
        <WorkoutCard key={session.sessionid} session={session} />
      );
    }else {
      return <Spinner />
    }
  }


 
  render() {
    return (
      <View style={{flex:1}}>
        <Header headerText={"Workout history"} />
        <ScrollView>
        <View style={styles.container}>
          {this.showList()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default WorkoutHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
  },
});