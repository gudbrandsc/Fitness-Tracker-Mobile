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
    this.retrieveData();
  }



  retrieveData() {
    try {
      this.setState({ loading: true });
      console.log("http://localhost:8000/api/listfollows/" +
      this.props.loggedInUserID +
      "/" +
      this.props.visitedUserId)
      axios
        .get(
          "http://localhost:8000/api/listfollows/" +
            this.props.loggedInUserID +
            "/" +
            this.props.visitedUserId
        )
        .then(
          function(response) {
            console.log("Response for following is" + response.data.message);
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
            console.log("Couldn't load following");
            this.setState({ loading: false });
          }.bind(this)
        );
    } catch (error) {
      this.setState({ loading: false });
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
      return <Spinner size="small" />;
    }
  }

  render() {
    return (
      <View style={{ flexDirection: "column" }}>{this.renderCount()}</View>
    );
  }
}

export default VisitFollowingButton;
