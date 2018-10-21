import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Spinner } from "../common";
import { Avatar } from "react-native-elements";
import axios from "axios";

class FollowingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: "",
      error: "",
      loading: false,
      follows: true
    };
  }

  onFollowPress = () => {
    console.log("Send follow request");
    const requestUrl =
      "http://10.1.86.4:8000/api/createfollower/" +
      this.props.userId +
      "/" +
      this.props.user.FollowingId;
    console.log(requestUrl);
    axios.get(requestUrl).then(
      function(response) {
        console.log("Check response");
        if (response.status === 200) {
          console.log("Follow ok 200");
          this.setState({
            follows: true,
            loading: false
          });
        } else {
          this.setState({
            loading: false,
            error: "Unable to unfollow.."
          });
        }
      }.bind(this)
    );
  };

  onUnfollowPress = () => {
    console.log("Send unfollow request");
    const requestUrl =
      "http://10.1.86.4:8000/api/removefollower/" +
      this.props.userId +
      "/" +
      this.props.user.FollowingId;
    console.log(requestUrl);
    axios.get(requestUrl).then(
      function(response) {
        console.log("Check response");
        if (response.status === 200) {
          console.log("unFollow ok 200");
          this.setState({
            follows: false,
            loading: false
          });
        } else {
          this.setState({
            loading: false,
            error: "Unable to unfollow.."
          });
        }
      }.bind(this)
    );
  };

  renderFollowingButton() {
    console.log("rendering button");
    if (this.state.follows) {
      return (
        <Button
          onPress={this.onUnfollowPress}
          type={"danger"}
          size={"small"}
          children={"Unfollow"}
        />
      );
    } else {
      return (
        <Button
          onPress={this.onFollowPress}
          type={"primary"}
          size={"small"}
          children={"Follow"}
        />
      );
    }
  }

  render() {
    const { viewStyleOne, textStyle, textStyle3 } = styles;
    const { FirstName, LastName, follows, UserName } = this.props.user;
    return (
      <View style={styles.row}>
        <Avatar
          small
          rounded
          source={{
            uri:
              "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
          }}
          onPress={() => console.log("Works!")}
          activeOpacity={0.7}
        />
        <View style={styles.row_cell_timeplace}>
          <Text style={styles.row_name}>
            {FirstName} {LastName}
          </Text>
          <Text style={styles.row_userName}>{UserName}</Text>
        </View>
        <View style={styles.row_cell_temp}>{this.renderFollowingButton()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    alignSelf: "stretch"
  },
  row: {
    elevation: 1,
    borderRadius: 2,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    flexDirection: "row", // main axis
    justifyContent: "flex-start", // main axis
    alignItems: "center", // cross axis
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 16,
    marginTop: 0,
    backgroundColor: "#fff"
  },
  row_cell_timeplace: {
    flex: 1,
    flexDirection: "column"
  },
  row_cell_temp: {
    paddingLeft: 16,
    flex: 0,
    margin: 10
  },
  row_userName: {
    paddingLeft: 5,
    textAlignVertical: "bottom",
    includeFontPadding: false,
    fontSize: 10,
    fontFamily: "HelveticaNeue",
    color: "#a0a0a0",
    flex: 0
  },
  row_name: {
    paddingLeft: 5,
    textAlignVertical: "top",
    fontFamily: "HelveticaNeue",
    includeFontPadding: false,
    flex: 0
  }
});

export default FollowingDetail;
