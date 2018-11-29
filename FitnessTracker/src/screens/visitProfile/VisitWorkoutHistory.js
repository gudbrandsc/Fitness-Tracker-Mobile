import React, { Component } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { Spinner } from "../../components/common";
import WorkoutCard from "../../components/workoutHistory/WorkoutCard";
import axios from "axios";

class VisitWorkoutHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      history: [],
      loading: true,
      visitedUserId: ""
    };
  }

  componentDidMount() {
    if (this.props.screenProps.visitedUserId !== undefined){
      console.log(this.props.screenProps.visitedUserId  + "hisotry")
      try {
        const visitedUserId = this.props.screenProps.visitedUserId;
        this.setState({ visitedUserId: visitedUserId });
        this.fetchData(visitedUserId);
      } catch (error) {
        this.setState({
          error: "Can't get Data. Please check internet connectivity."
        });
      }
    }
  }
  //TODO if user do not have workout display text about it 
  fetchData(visitedUserId) {
    axios
      .get("http://localhost:8000/api/newexercisehistory/" + visitedUserId)
      .then(response =>
        this.setState({ history: response.data}))
      .then(this.checkSearchResp.bind(this));

  }

  checkSearchResp() {
    if (this.state.history && this.state.history.length > 0) {
      this.setState({ error: "", loading: false });
    } else {
      this.setState({
        error: "No workout history",
        loading: false
      });
    }
  }



  showList() {
    if (this.state.loading === false) {
      if(this.state.history && this.state.history.length > 0 ){
      return this.state.history.map(session => (
        <WorkoutCard key={session.sessionid} session={session} />
      ));
      } 
    } else {
      return <Spinner />;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 1, backgroundColor: "#f7f6ef" }}>
        <Text style={{textAlign:'center'}}>{this.state.error}</Text>
        <ScrollView>
          <View style={styles.container}>{this.showList()}</View>
        </ScrollView>
      </View>
    );
  }
}

export default VisitWorkoutHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // main axis
    justifyContent: "center" // main axis
  }
});
