import React, { Component } from "react";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}
import VisitProfileSubCategoriesRouter from "./visitProfile/VisitProfileSubCategoriesRouter";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { Button, Spinner } from "../components/common";
import VisitFollowersButton from "./visitProfile/VisitFollowersButton";
import VisitFollowingButton from "./visitProfile/VisitFollowingButton";
import { Avatar } from "react-native-elements";
import axios from "axios";

class VisitProfilePage extends Component {
  static navigationOptions = {
    headerTitle: "Profile",
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

  state = {
    loggedInUserID: "",
    visitedUserId: "",
    name: "",
    error: "",
    loading: true,
    avatarSource:
      "https://res.cloudinary.com/fitnesstracker/image/upload/v1540766575/blank-profile-picture.png",
    animationErrorHeight: "0.5%",
    loadFollowers: false,
    loadFollowing: false,
    imFollowing: false,
    badgeList: [],
  };

  componentDidMount() {
    const { navigation } = this.props;
    const follows = navigation.getParam("follows", "false");
    const visitedUserId = navigation.getParam("visitedUserId");
    const loggedInUserID = navigation.getParam("loggedInUserID");
    console.log("Visit profile ids: " + visitedUserId + " and loggedin: " + loggedInUserID )

    this.setState({
      imFollowing: follows,
      visitedUserId: visitedUserId,
      loggedInUserID: loggedInUserID,
      loading: false
    });
    this.getUserData(visitedUserId);
  }

  getUserData(visitedUserId) {
    try {
      console.log("The visit profile " + visitedUserId);
      fetch("http://localhost:8000/api/user_details/" + visitedUserId, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(response =>
          response.json().then(data => ({
            data: data,
            status: response.status
          }))
        )
        .then(
          res => {
            this.setState({ loadFollowers: true, loadFollowing: true });
            if (res.status === 200) {
              const name = res.data.FirstName + " " + res.data.LastName;
              this.setState({ name });
              this.setState({ avatarSource: res.data.ImageUrl });
              this.onSuccess();
              this.retrieveBadges();
            } else {
              this.onFailure(
                "Can't get Data. Please check internet connectivity."
              );
            }
          },
          error => {
            console.log(error);
            this.onFailure(
              "Can't get Data. Please check internet connectivity."
            );
          }
        );
    } catch (error) {
      this.onFailure("Can't get Data. Please check internet connectivity.");
    }
  }

  onFailure(err) {
    this.setState({ error: err, loading: false, animationErrorHeight: "auto" });
  }

  onSuccess() {
    this.setState({ loading: false, error: "", animationErrorHeight: "0.5%" });
  }

  updateInfo(name, picUrl) {
    this.setState({ name });
    this.setState({ avatarSource: picUrl });
  }

  /**
   * A function called when pressing the close button in the animation error box
   */
  onCloseAnimationBox() {
    this.setState({ error: "", animationErrorHeight: "0.5%" });
  }

  renderFollowersButton() {
    if (this.state.loading === false && this.state.visitedUserId !== "") {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("visitFollowersPage", {
              visitedUserId: this.state.visitedUserId,
              loggedInUserID: this.state.loggedInUserID,
              updateFollowState: this.updateFollowState
            });
          }}
        >
          <VisitFollowersButton visitedUserId={this.state.visitedUserId} imFollowing = {this.state.imFollowing} />
        </TouchableOpacity>
      );
    } else {
      return <Spinner size={"small"} />;
    }
  }

  renderFollowingButton() {
    if (this.state.loading === false && this.state.visitedUserId !== ""  && this.state.loggedInUserID !== "") {
      console.log("Render following page " +this.state.visitedUserId +" cur: " +  this.state.loggedInUserID)
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("visitFollowingPage", {
              visitedUserId: this.state.visitedUserId,
              loggedInUserID: this.state.loggedInUserID,
              updateFollowState: this.updateFollowState
            });
          }}
        >
          <VisitFollowingButton
            visitedUserId={this.state.visitedUserId}
            loggedInUserID={this.state.loggedInUserID}
            imFollowing = {this.state.imFollowing}
          />
        </TouchableOpacity>
      );
    } else {
      return <Spinner size={"small"} />;
    }
  }

  renderSubCategoryList() {
    if (this.state.loading === false) {
      console.log("return profile router : " + this.state.visitedUserId);
      return (
        <VisitProfileSubCategoriesRouter
          screenProps={{ visitedUserId: this.state.visitedUserId }}
        />
      );
    } else {
      return <Spinner size={"small"} />;
    }
  }

  renderFollowUnfollowButton() {
    if (this.state.imFollowing === true) {
      return (
        <Button
          onPress={this.onUnfollowPress}
          type={"danger"}
          size={"large"}
          children={"Unfollow"}
        />
      );
    }
    return (
      <Button
        onPress={this.onFollowPress}
        type={"primary"}
        size={"large"}
        children={"Follow"}
      />
    );
  }

  onFollowPress = () => {
    const { navigation } = this.props;
    //TODO Add loading
    const requestUrl =
      "http://localhost:8000/api/createfollower/" +
      this.state.loggedInUserID +
      "/" +
      this.state.visitedUserId;
    console.log(requestUrl);
    axios.get(requestUrl).then(
      function(response) {
        if (response.status === 200) {
          this.setState({
            imFollowing: true,
            loading: false,
          });
          navigation.state.params.updateFollow(true);
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
    const { navigation } = this.props;

    const requestUrl =
      "http://localhost:8000/api/removefollower/" +
      this.state.loggedInUserID +
      "/" +
      this.state.visitedUserId;
    axios.get(requestUrl).then(
      function(response) {
        if (response.status === 200) {
          this.setState({
            imFollowing: false,
            loading: false
          });
          navigation.state.params.updateFollow(false);
        } else {
          this.setState({
            loading: false,
            error: "Unable to unfollow.."
          });
        }
      }.bind(this)
    );
  };

  retrieveBadges() {
    if (!this.state.loading) {
      try {
        fetch("http://localhost:8000/api/getbadges/" + this.state.visitedUserId, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
          .then(response =>
            response.json().then(data => ({
              data: data,
              status: response.status
            }))
          )
          .then(
            res => {
              if (res.status === 200) {
                const badgeList = res.data;
                this.setState({ badgeList });
              } else {
                this.onFailure("Could not retrieve badges for this user.");
              }
            },
            error => {
              this.onFailure(
                "Can't get Data. Please check internet connectivity."
              );
            }
          );
      } catch (error) {
        this.onFailure("Can't get Data. Please check internet connectivity.");
      }
    }
  }

  showBadgeInfo(title, info) {
    Alert.alert(title + " Badge", info, [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]);
  }

  renderBadges() {
    if (this.state.badgeList.length > 0) {
      return (
        <React.Fragment>
          {this.state.badgeList.map(b => (
            <TouchableOpacity
              key={b.BadgeId}
              style={{ height: 50, width: 50, marginRight: 8 }}
              onPress={() => this.showBadgeInfo(b.BadgeName, b.BadgeInfo)}
            >
              <Image
                style={{ height: 50, width: 50 }}
                source={{ uri: b.ImageUrl }}
              />
            </TouchableOpacity>
          ))}
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              height: "35%"
            }}
          >
            <View style={{ flexDirection: "row", width: 100 }}>
              <View style={styles.profileImgContainer}>
                <Avatar
                  large
                  rounded
                  source={{
                    uri: this.state.avatarSource
                  }}
                />
              </View>
              <View
                style={{
                  height: "auto",
                  width: "auto",
                  justifyContent: "center",
                  marginLeft: 40
                }}
              >
                <View style={{ flex: 0.8, marginRight: 10 }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <View style={{ width: "100%" }}>
                      {this.renderFollowingButton()}
                    </View>
                    <View style={{ width: "100%", marginLeft: 15 }}>
                      {this.renderFollowersButton()}
                    </View>
                  </View>
                </View>

                <View style={{ flex: 1, flexDirection: "row", marginTop: 15 }}>
                  <View style={{ width: "190%", paddingTop: 10 }}>
                    {this.renderFollowUnfollowButton()}
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                height: "auto",
                width: "auto",
                flexDirection: "column",
                marginLeft: 20,
                marginTop: 20
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}
              >
                {this.state.name}
              </Text>
              <ScrollView horizontal={true}>{this.renderBadges()}</ScrollView>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              height: "65%"
            }}
          >
            <VisitProfileSubCategoriesRouter
              visitedUserId={this.props.navigation.getParam("visitedUserId")}
            />
          </View>
          <AnimationErrorBox
            errorMsg={this.state.error}
            viewHeight={this.state.animationErrorHeight}
            onPress={this.onCloseAnimationBox.bind(this)}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            height: "65%"
          }}
        >
          {this.renderSubCategoryList()}
        </View>
        <AnimationErrorBox
          errorMsg={this.state.error}
          viewHeight={this.state.animationErrorHeight}
          onPress={this.onCloseAnimationBox.bind(this)}
        />
      </View>
    );
  }
}

const styles = {
  profileImgContainer: {
    marginLeft: 15
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: "center",
    color: "red"
  }
};

export default VisitProfilePage;
