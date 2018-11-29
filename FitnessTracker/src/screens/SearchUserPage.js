import React, { Component } from "react";
import { Text, View, AsyncStorage, Platform } from "react-native";
import { Spinner, Header } from "../components/common";
import UserList from "../components/userSearch/UserList";
import axios from "axios";
import { SearchBar } from "react-native-elements";

export default class SearchUserPage extends Component {
  static navigationOptions = {
    header: <Header headerText={"Search"} />
  };
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: false,
      users: [],
      loggedInUserID: "",
      backendIP: ""
    };
    this.onButtonPress = this.onButtonPress.bind(this);
  }

  componentDidMount() {
    if (Platform.OS === "ios") {
      this.setState({ backendIP: "localhost" });
    } else {
      this.setState({ backendIP: "10.1.86.4" });
    }
    this.retrieveDetails();
  }

  retrieveDetails = async () => {
    try {
      const loggedInUserID = await AsyncStorage.getItem("login");
      this.setState({ loggedInUserID: loggedInUserID });
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  };

  onButtonPress(term) {
    this.setState({ error: "", loading: true });
    console.log("search: " + term + "userid: " + this.state.loggedInUserID  )
    axios
      .get(
        "http://" +
          this.state.backendIP +
          ":8000/api/searchuser/" +
          term +
          "/" +
          this.state.loggedInUserID
      )
      .then(response => {
        this.setState({ users: response.data });
      })
      .then(this.checkSearchResp.bind(this));
  }
  checkSearchResp() {
    if (this.state.users && this.state.users.length > 0) {
      this.setState({ error: "", loading: false });
    } else {
      this.setState({
        error: "No users matching search term...",
        loading: false
      });
    }
  }

  checkResponse(users, loading) {
    if (loading) {
      return <Spinner size={"small"} />;
    }
    if (users && users.length > 0) {
      return (
        <UserList
          navigation={this.props.navigation}
          users={users}
          loggedInUserID={this.state.loggedInUserID}
        />
      );
    }
  }

  render() {
    const { users, term, loading } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          lightTheme
          onChangeText={term => this.onButtonPress(term)}
          icon={{ type: "font-awesome", name: "search" }}
          placeholder="Search..."
        />
        <View style={{ flex: 1, backgroundColor: "#f7f6ef" }}>
          {this.checkResponse(users, loading)}
          <Text>{this.state.error}</Text>
        </View>
      </View>
    );
  }
}
