import React, { Component } from "react";
import { ScrollView, View, StyleSheet, AsyncStorage, Text } from "react-native";
import { Header, Spinner } from "../components/common";
import WorkoutCard from "../components/workoutHistory/WorkoutCard";
import axios from "axios";

let _this = null;

class WorkoutHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      history: [],
      loading: true,
      userId: ""
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarOnPress({ navigation, defaultHandler }) {
        _this.fetchData(_this.state.userId);
        defaultHandler();
      }
    };
  };

  componentDidMount() {
    _this = this;
    this.retrieveDetails();
  }

  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ userId: id });
      this.fetchData(id);
    } catch (error) {
      this.setState({
        error: "Can't get Data. Please check internet connectivity."
      });
    }
  };

  fetchData(id) {
    this.setState({ loading: true });
    axios
      .get("http://localhost:8000/api/newexercisehistory/" + id)
      .then(response => this.setState({ history: response.data }))
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
      var history = this.state.history;
      history.sort(function(a, b) {
        return new Date(b.createddate) - new Date(a.createddate);
      });
      return history.map(session => (
        <WorkoutCard key={session.sessionid} session={session} />
      ));
    } else {
      return <Spinner />;
    }
  }

  loadError(){
    if(this.state.error !== ""){
    return( 
    <View style={styles.errorTextContainer}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {this.state.error}
      </Text>
    </View>    
    );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f7f6ef" }}>
          {this.loadError()}
         <ScrollView>
          <View style={styles.container}>{this.showList()}</View>
        </ScrollView>
      </View>
    );
  }
}

export default WorkoutHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // main axis
    justifyContent: "center" // main axis
  },
  errorTextContainer: {
    marginTop: 25,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    height: "auto"
  },
});
