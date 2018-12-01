import React, { Component } from "react";
import { View, Text, FlatList, AsyncStorage, Dimensions } from "react-native";
import { List } from "react-native-elements";
import JournalItems from "./JournalItems";

/**
 * Script that shows the journals added by the people the user is following. It renders the JournalItems Component in
 * FlatList.
 */
class JournalNewsFeed extends Component {
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

  /**
   * A function that gets the login data from Async storage then calls the retrieveData function.
   */
  getID = async () => {
    const id = await AsyncStorage.getItem("login");
    this.setState({ userId: id });
    this.retrieveData();
  };

  /**
   * A function that calls an API and returns all the journals for the people a user is following.
   * It extracts specific data from the response and calculates the date difference between the date of the journal
   * and the current date to show how long was the journal added and pushes everything to a list.
   * If journal response is empty then it will show empty journals...etc
   */
  retrieveData() {
    try {
      this.setState({ loading: true });
      const id = this.state.userId;

      fetch("http://localhost:8000/api/getnewsfeed/" + id, {
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
          results.sort(function(a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          for (var i = 0; i < results.length; i++) {
            const journalId = results[i].id + "";
            const email = results[i].User_Detail.UserName;
            const userImg = results[i].User_Detail.ImageUrl;
            const FullName =
              results[i].User_Detail.FirstName +
              " " +
              results[i].User_Detail.LastName;
            // Calculate the time difference between the date of journal and current date
            const dateDiff = Math.abs(
              new Date() - new Date(results[i].createdAt)
            );
            const seconds = dateDiff / 1000;
            var date = "";
            if (seconds / 86400 >= 1)
              date = Math.round(seconds / 86400) + "d ago";
            else if (seconds / 3600 >= 1)
              date = Math.round(seconds / 3600) + "hr ago";
            else if (seconds / 60 >= 1)
              date = Math.round(seconds / 60) + "min ago";
            else date = Math.round(seconds) + "sec ago";
            const journalText = results[i].Journal;
            const imageurl = results[i].imageurl;
            const dataFormat = {
              journalId,
              FullName,
              date,
              email,
              userImg,
              imageurl,
              journalText
            };
            data.push(dataFormat);
          }

          var emptyList = false;
          if (data.length === 0) {
            emptyList = true;
            const t = {
              text:
                "Empty news feed.\n\nPlease follow some people to see their journals.",
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
          this.onFailure("Couldn't load Journals. Please try again.");
        });
    } catch (error) {
      this.onFailure("Check internet connectivity.");
    }
  }

  /**
   * A function that accepts an error string message and shows it to the user as alert.
   * It also reset loading to false.
   */
  onFailure(err) {
    alert(err);
    this.setState({ loading: false });
  }

  /**
   * A function that resets loading to false
   */
  onSuccess() {
    this.setState({ loading: false });
  }

  /**
   * A function called by the FlatList. WHen scrolling down the refresh icon appears and this function is called.
   */
  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.retrieveData();
      }
    );
  };

  /**
   * A function called by the Flatlist to separate the items with a line.
   */
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

  /**
   * A function that renders the items in the page. if the list is empty, it shows a text saying that there are no journals.
   * Otherwise it renders the items in the FlatList component.
   */
  renderItems() {
    if (this.state.emptyList) {
      return (
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#fafafa",
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
          <JournalItems
            fullName={item.FullName}
            email={item.email}
            time={item.date}
            userImg={item.userImg}
            imageurl={item.imageurl}
            journalText={item.journalText}
          />
        )}
        keyExtractor={item => item.journalId}
        ItemSeparatorComponent={this.renderSeparator}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
      />
    );
  }

  /**
   * Main built in render function that loads the whole page
   */
  render() {
    return <View style={{ flex: 1 }}>{this.renderItems()}</View>;
  }
}
export default JournalNewsFeed;
