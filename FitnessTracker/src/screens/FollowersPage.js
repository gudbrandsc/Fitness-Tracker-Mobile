import React, { Component } from "react";
import { AsyncStorage, View, Text } from "react-native";
import { Spinner, Header } from "../components/common";
import axios from "axios";
import FollowingList from "../components/followingList/FollowingList";

class FollowersPage extends Component {
  static navigationOptions = {
    headerTitle: "Followers",
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
      .get("http://localhost:8000/api/listfollowers/" + id + "/" + id)
      .then(response => this.setState({ users: response.data }))
      .then(this.checkSearchResp.bind(this));
  }

  checkSearchResp() {
    if (this.state.users && this.state.users.length > 0) {
      this.setState({ error: "", loading: false });
    } else {
      this.setState({
        error: "You don't have any followers yet..",
        loading: false
      });
    }
  }

  resetComponent = () => {
    if (this.props.navigation.state.params.Home.state.resetComp === "false") {
      this.props.navigation.state.params.Home.setState({ resetComp: "true" });
    } else {
      this.props.navigation.state.params.Home.setState({ resetComp: "false" });
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
          otherUserId={this.state.userId}
          userId={this.state.userId}
          followingRequest={false}
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

export default FollowersPage;
