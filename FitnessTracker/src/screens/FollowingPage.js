import React, { Component } from "react";
import { AsyncStorage, View, Text } from "react-native";
import { Spinner, Header } from "../components/common";
import axios from "axios";
import FollowingList from "../components/followingList/FollowingList";

class FollowingPage extends Component {
  static navigationOptions = {
    headerTitle: "Following",
    headerStyle: {
      backgroundColor: "#00e6d3",
      height: 60
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "600",
      color: "#fff",
      fontSize: 22,
      fontFamily: "arial"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: true,
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
      this.fetchData(id);
    } catch (error) {
      this.setState({ error: "Unable to fetch data, try again later..." });
    }
    this.setState({ loading: false });
  };

  fetchData(id) {
    axios
      .get("http://localhost:8000/api/listfollows/" + id + "/" + id)
      .then(response => this.setState({ users: response.data }))
      .then(this.checkSearchResp.bind(this))
      .catch(error => {
        console.log(error)
    });
  }

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

  resetComponent = () => {
    console.log("Follow was clicked reset in homepage")
    if (this.props.navigation.state.params.Home.state.resetComp === "false") {
      this.props.navigation.state.params.Home.setState({ resetComp: "true" });
    } else {
      this.props.navigation.state.params.Home.setState({ resetComp: "false" });
      this.props.navigation.state.params.Home.handleRefresh();
    }
  };

  checkResponse(users, loading) {
    if (loading) {
      return <Spinner size={"small"} />;
    }
    if (users && users.length > 0) {
      return (
        <FollowingList
          users={users}
          userId={this.state.userId}
          otherUserId={this.state.userId}
          followingRequest={true}
          resetComponent={this.resetComponent.bind(this)}
        />
      );
    }
  }

  render() {
    const { users, loading } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {this.checkResponse(users, loading)}
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}

export default FollowingPage;
