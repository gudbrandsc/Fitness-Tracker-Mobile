import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  FlatList
} from "react-native";
import WorkoutCard from "../workoutHistory/WorkoutCard";
import axios from "axios";

/**
 * Script that shows the workouts added by the people the user is following.  It renders the WorkoutCard Component in
 * FlatList.
 */
class WorkoutNewsFeed extends Component {
  state = {
    term: "",
    history: null,
    loading: true,
    userId: "",
    refreshing: false
  };

  componentDidMount() {
    this.getID();
  }

  /**
   * A function that gets the login data from Async storage then calls the retrieveData function.
   */
  getID = async () => {
    const id = await AsyncStorage.getItem("login");
    this.setState({ userId: id });
    this.retrieveData();
  };

  /**
   * A function that calls an API and returns all the workouts for the people a user is following.
   */
  retrieveData() {
    axios
      .get("http://localhost:8000/api/getnewexercisefeed/" + this.state.userId)
      .then(response =>
        this.setState({
          history: response.data,
          loading: false,
          refreshing: false
        })
      )
      .catch(function(error) {
        this.setState({
          loading: false,
          refreshing: false
        });
        console.log("Couldn't get workout news feed");
      });
  }

  /**
   * A function called by the FlatList. WHen scrolling down the refresh icon appears and this function is called.
   */
  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
        loading: true
      },
      () => {
        this.retrieveData();
      }
    );
  };

  /**
   * A function that renders the items in the page. if the list is empty, it shows a text saying that there are no workouts.
   * Otherwise it renders the items in the FlatList component.
   */
  renderItems() {
    if (this.state.history !== null) {
      if (this.state.history.length === 0) {
        const w = {
          text:
            "Empty news feed.\n\nPlease follow some people to see their workouts.",
          id: "1"
        };
        var history = this.state.history;
        history.push(w);
        return (
          <FlatList
            data={history}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#f4f4f4",
                  width: Dimensions.get("window").width - 10,
                  height: Dimensions.get("window").height,
                  padding: 10
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    height: "100%",
                    width: "100%"
                  }}
                >
                  {item.text}
                </Text>
              </View>
            )}
            keyExtractor={item => item.id}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
          />
        );
      } else {
        var history = this.state.history;
        history.sort(function(a, b) {
          return new Date(b.createddate) - new Date(a.createddate);
        });
        return (
          <FlatList
            data={history}
            renderItem={({ item }) => (
              <WorkoutCard key={item.sessionid} session={item} />
            )}
            keyExtractor={item => item.sessionid}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            style={{ backgroundColor: "#f4f4f4" }}
          />
        );
      }
    }
  }

  /**
   * Main built in render function that loads the whole page
   */
  render() {
    return <View style={{ flex: 1 }}>{this.renderItems()}</View>;
  }
}
export default WorkoutNewsFeed;
