import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Spinner } from "../common";
import axios from "axios";

class FollowingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      followingCount: 0
    };
  }


  //Method to reset the state when a workout is submitted.
  componentWillReceiveProps(nextProps) {
    console.log("I want to update the render view")
    if (this.props.reset !== nextProps.reset) {
      this.updateData()
    }
  }


  updateData(){
    console.log("Hello from following button with id" + this.props.userid);
    try {
      axios
        .get("http://localhost:8000/api/listfollows/" + this.props.userid)
        .then(response =>
          this.setState({ followingCount: response.data.length })
        );
      this.setState({ loading: false });
    } catch (error) {
      console.log("Unable to fetch data");
    }
  }

  componentDidMount() {
    this.updateData()
  }

  renderCount() {
    console.log("Render in following");
    if (!this.state.loading) {
      return (
        <View>
          <Text
            style={{ fontSize: 15, fontWeight: "bold", textAlign: "center" }}
          >
            {this.state.followingCount}
          </Text>
          <Text style={{ fontSize: 15, textAlign: "center", color: "#a0a0a0" }}>
            Following
          </Text>
        </View>
      );
    } else {
      return <Text>Rendering</Text>;
    }
  }

  render() {
    return (
      <View style={{ flexDirection: "column" }}>{this.renderCount()}</View>
    );
  }
}

export default FollowingButton;
