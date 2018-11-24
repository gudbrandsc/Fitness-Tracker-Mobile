import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Spinner } from "../../components/common";
import axios from "axios";

class VisitFollowingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      followingCount: 0
    };
  }

  componentDidMount() {
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

  renderCount() {
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
      return <Spinner />;
    }
  }

  render() {
    return (
      <View style={{ flexDirection: "column" }}>{this.renderCount()}</View>
    );
  }
}

export default VisitFollowingButton;
