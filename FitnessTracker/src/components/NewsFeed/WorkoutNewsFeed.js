import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
} from "react-native";
import { List } from "react-native-elements";
import WorkoutItems from "./WorkoutItems";

class WorkoutNewsFeed extends Component {
  state = {
    loading: false,
    data: [],
    refreshing: false,
    userId: "",
    emptyList: true
  };

  componentDidMount() {
    this.getID();
  }

  getID = async () => {
    const id = await AsyncStorage.getItem("login");
    this.setState({ userId: id });
    this.retrieveDetails();
  };

  retrieveDetails() {
    try {
      this.setState({ loading: true });
      const id = this.state.userId;

      //fetch("http://localhost:8000/api/getexercisefeed/" + id, {
      fetch("http://localhost:8000/api/getexercisefeed/11", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(response =>
          response.json().then(data => ({
            data: data,
            status: response.status
          }))
        )
        .then(res => {
          const results = res.data;
          const data = [];
          for (var i = 0; i < results.length; i++) {
            const workoutId = results[i].id + "";
            const email = results[i].username;
            const FullName = results[i].firstname + " " + results[i].lastname;
            const dateDiff = Math.abs(
              new Date() - new Date(results[i].createddate)
            );
            const seconds = dateDiff / 1000;
            var date = "";
            if (seconds / 86400 !== 0)
              date = Math.round(seconds / 86400) + "d ago";
            else if (seconds / 3600 !== 0)
              date = Math.round(seconds / 3600) + "hr ago";
            else if (seconds / 60 !== 0)
              date = Math.round(seconds / 60) + "min ago";
            else date = Math.round(seconds) + "sec ago";
            const workoutName = results[i].workoutname;
            const category = results[i].categoryname;
            const imageurl = results[i].categoryurl;
            const sets = results[i].noofsets;
            const reps = results[i].noofreps;
            const weight = results[i].weight + "lbs";
            const dataFormat = {
              workoutId,
              FullName,
              date,
              email,
              imageurl,
              workoutName,
              category,
              sets,
              reps,
              weight
            };
            data.push(dataFormat);
          }

          var emptyList = false;
          if (data.length === 0) {
            emptyList = true;
            const t = {
              text:
                "Empty news feed.\n\nPlease follow some people to see their workout.",
              id: "1"
            };
            data.push(t);
          }

          this.setState({
            data,
            loading: false,
            refreshing: false,
            emptyList
          });
        })
        .catch(error => {
          this.onFailure(error);
        });
    } catch (error) {
      this.onFailure("Check internet connectivity.");
    }
  }

  onFailure(err) {
    alert(err);
    this.setState({ loading: false });
  }

  onSuccess() {
    this.setState({ loading: false });
  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.retrieveDetails();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  renderItems() {
    console.log(this.state.emptyList);
    if (this.state.emptyList) {
      return (
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#fafafa",
                width: Dimensions.get("window").width - 10,
                height: Dimensions.get("window").width,
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
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
        />
      );
    }
    return (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => (
          <WorkoutItems
            fullName={item.FullName}
            email={item.email}
            time={item.date}
            imageurl={item.imageurl}
            workoutName={item.workoutName}
            category={item.category}
            sets={item.sets}
            reps={item.reps}
            weight={item.weight}
          />
        )}
        keyExtractor={item => item.workoutId}
        ItemSeparatorComponent={this.renderSeparator}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
      />
    );
  }

  render() {
    return (
    <View>        
      
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        {this.renderItems()}
      </List>
      </View>

    );
  }
}
export default WorkoutNewsFeed;
