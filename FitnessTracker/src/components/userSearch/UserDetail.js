import React, { Component } from "react";
import { StyleSheet, Text, View,TouchableOpacity } from "react-native";
import { Button, Spinner } from "../common";
import { Avatar } from "react-native-elements";
import axios from "axios";

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_following: this.props.user.user_following,
      statusCode: "",
      error: "",
      loading: false,
      follows: false,
      start: true
    };
  }

  componentDidMount() {
    if (
      this.props.user.follower_tables &&
      this.props.user.follower_tables.length > 0
    ) {
      this.setState({
        follows: true,
        start: false
      });
    } else {
      this.setState({
        follows: false,
        start: false
      });
    }
  }

  onFollowPress = () => {
    const requestUrl =
      "http://localhost:8000/api/createfollower/" +
      this.props.loggedInUserID +
      "/" +
      this.props.user.id;
    axios.get(requestUrl).then(
      function(response) {
        if (response.status === 200) {
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
    const requestUrl =
      "http://localhost:8000/api/removefollower/" +
      this.props.loggedInUserID +
      "/" +
      this.props.user.id;
    axios.get(requestUrl).then(
      function(response) {
        if (response.status === 200) {
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
    if (this.state.start) {
      if (
        this.props.user.follower_tables &&
        this.props.user.follower_tables.length > 0
      ) {
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
    } else {
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
  }


  updateFollow = data => {
    this.setState({follows: data});
    this.forceUpdate()
  };

  goToUserProfile(){
    this.props.navigation.navigate(
      "visitProfilePage", {
        follows: this.state.follows,
        loggedInUserID: this.props.loggedInUserID,
        visitedUserId: this.props.user.id,
        updateFollow: this.updateFollow
      }
    );
  }

  render() {
    const {
      FirstName,
      LastName,
      UserName,
      ImageUrl
    } = this.props.user;
    return (
      <View style={styles.row}>
        <TouchableOpacity style={{flex:1,  flexDirection: "row",}} onPress={() => this.goToUserProfile()}>
        <Avatar
          small
          rounded
          source={{
            uri: ImageUrl
          }}
          
          activeOpacity={0.7}
        />

        <View style={styles.row_cell_timeplace}>
          <Text style={styles.row_name}>
            {FirstName} {LastName}
          </Text>
          <Text style={styles.row_userName}>{UserName}</Text>
        </View>
        </TouchableOpacity>
        <View style={styles.row_cell_temp}>
        {this.renderFollowingButton()}
        </View>
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
    flexDirection: "column",
    paddingTop:2
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

export default UserDetail;
