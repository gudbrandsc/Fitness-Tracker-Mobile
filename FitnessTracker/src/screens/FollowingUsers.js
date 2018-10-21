import React, { Component } from "react";
import { AsyncStorage, View, Text } from "react-native";
import { Spinner, Header } from "../components/common";
import axios from "axios";
import FollowingList from "../components/followingList/FollowingList";

class FollowingUsers extends Component {
  static navigationOptions = {
    headerTitle: "Following"
  };

  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: false,
      users: [],
      userId: ""
    };
  }

  componentDidMount() {
    this.retrieveDetails();
  }
  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ userId: id });
      axios
        .get("http://localhost:8000/api/listfollower/" + id)
        .then(response => this.setState({ users: response.data }))
        .then(this.checkSearchResp.bind(this));
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  };

  checkSearchResp() {
    if (this.state.users && this.state.users.length > 0) {
      this.setState({ error: "", loading: false });
    } else {
      this.setState({
        error: "You are not following any users yet..",
        loading: false
      });
    }
  }

  checkResponse(users, loading) {
    console.log(this.state.userId + " from comonent");

    if (loading) {
      return <Spinner size={"small"} />;
    }
    if (users && users.length > 0) {
      console.log(this.state.userId + " is the user id ");
      return <FollowingList users={users} userId={this.state.userId} />;
    }
  }

  render() {
    const { users, term, loading } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {this.checkResponse(users, loading)}
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}

export default FollowingUsers;
