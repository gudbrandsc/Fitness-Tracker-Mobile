import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Spinner } from "../common";
import { Avatar } from "react-native-elements";
import axios from "axios";

/**
 * Component that displays a spesific user.
 */
class FollowingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: "",
      error: "",
      loading: false,
      follows: this.props.user.FollowingFollower,
      userId: "",
      otherUserId: ""
    };
  }

  // If the following state is changed then make sure the profile page 
  // rerender the following count. 
  componentDidUpdate(){
    this.props.resetDetail();
  }

  // Set initial values 
  componentDidMount(){
    this.setState({loading:true})
    var otherID = this.props.user.FollowerId;
    if(this.props.followingRequest){
      otherID = this.props.user.FollowingId;
    } 
    this.setState({loading:false, userId: this.props.userId, otherUserId: otherID })

  }

  // Function used to follow the displayed user 
  // function also calls function to reset following count in profile page 
  onFollowPress = () => {
    this.setState({loading:true})
    const requestUrl =
      "http://localhost:8000/api/createfollower/" +
      this.props.userId +
      "/" +
      this.state.otherUserId;
    axios.get(requestUrl).then(
      function(response) {
        if (response.status === 200) {
          this.setState({
            follows: "true",
            loading: false
          });
          this.props.resetDetail();
        } else {
          this.setState({
            loading: false,
            error: "Unable to unfollow.."
          });
        }
      }.bind(this)
    ).catch(error => {
      console.log(error)
    });
  };

  // Function used to unfollow the displayed user 
  // function also calls function to reset following count in profile page 
  onUnfollowPress = () => {
    this.setState({loading:true})
    const requestUrl =
      "http://localhost:8000/api/removefollower/" +
      this.props.userId +
      "/" +
      this.state.otherUserId;
    axios.get(requestUrl).then(
      function(response) {
        if (response.status === 200) {
          this.setState({
            follows: "false",
            loading: false
          });
          this.props.resetDetail();
        } else {
          this.setState({
            loading: false,
            error: "Unable to unfollow.."
          });
        }
      }.bind(this)
    ).catch(error => {
      console.log(error)
    });
  };

  // Function that renders a follow/unfollow button based on the following state of 
  // the logged in user. 
  renderFollowingButton() {
    if(!this.state.loading){
      console.log(parseInt(this.props.userId) + " = " + parseInt(this.state.otherUserId))
      if(parseInt(this.props.userId) !==  parseInt(this.state.otherUserId)){
        if (this.state.follows === "true") {
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
    } else {
      return( 
      <View style={{marginRight:25}}>
        <Spinner size={"small"}/> 
      </View>);
    }
  }

  render() {
    const { viewStyleOne, textStyle, textStyle3 } = styles;
    const {
      FirstName,
      LastName,
      UserName,
      ImageUrl
    } = this.props.user;
    return (
      <View style={styles.row}>
        <Avatar
          small
          rounded
          source={{
            uri: ImageUrl
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
