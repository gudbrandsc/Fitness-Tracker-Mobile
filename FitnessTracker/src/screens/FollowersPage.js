import React, { Component } from "react";
import {
  AsyncStorage,
  View,
  Text,
} from "react-native";
import {
  Spinner,
  Header
} from "../components/common";
import axios from 'axios';
import FollowingList from '../components/followingList/FollowingList';



class FollowersPage extends Component {
  static navigationOptions = {
    headerTitle: "Followers"
  };

  constructor(props) {
    super(props);
    this.state = {
      term: "",
      error: "",
      loading: false,
      users:[],
      userId: '',
    };
  }



  render() {

    return (
      <View style={{ flex: 1}}>
        <Text>List of all i follow</Text>
      </View>
    );
  }
}

export default FollowersPage;
