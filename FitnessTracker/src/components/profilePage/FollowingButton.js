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

  componentDidMount() {
    this.retrieveData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.identifier !== this.props.identifier) {
      this.retrieveData();
    }
  }

  retrieveData() {
    try {
      this.setState({ loading: true });
      axios
        .get(
          "http://localhost:8000/api/listfollows/" +
            this.props.loggedInUserID +
            "/" +
            this.props.userId
        )
        .then(
          function(response) {
            if (response.status == 200) {
              this.setState({
                followingCount: response.data.length
              });
            }
            this.setState({ loading: false });
          }.bind(this)
        )
        .catch(
          function(error) {
            this.setState({ loading: false });
          }.bind(this)
        );
    } catch (error) {
      this.setState({ loading: false });
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
      return <Spinner size="small" />;
    }
  }

  render() {
    return (
      <View style={{ flexDirection: "column" }}>{this.renderCount()}</View>
    );
  }
}

export default FollowingButton;
