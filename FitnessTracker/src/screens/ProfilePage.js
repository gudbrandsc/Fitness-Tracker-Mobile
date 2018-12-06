import React, { Component } from "react";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}
import ProfileSubCategoriesRouter from "./ProfileSubCategoriesRouter";
import {
  AsyncStorage,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Dimensions
} from "react-native";
import { Button, Spinner, Header } from "../components/common";
import FollowersButton from "../components/profilePage/FollowersButton";
import FollowingButton from "../components/profilePage/FollowingButton";
import { Avatar } from "react-native-elements";

/**
 * A script that shows the user's name, picture, number of follower, number of people following him/her, badges earned,  workout
 * history, and expenses.
 * The page allows the user to check all the people s/he is following, the people following her/him, and all the profile details too.
 * Also, it allows the user to add expenses and search for gyms on the map too
 */
class ProfilePage extends Component {
  static navigationOptions = {
    header: <Header headerText={"Profile Page"} />
  };

  state = {
    userid: "",
    name: "",
    error: "",
    loading: true,
    avatarSource:
      "https://res.cloudinary.com/fitnesstracker/image/upload/v1540766575/blank-profile-picture.png",
    animationErrorHeight: "0.5%",
    badgeList: [],
    resetComp: "false",
    flatListData: [0],
    refreshing: false,
    followingIdentifier: 0, // this is an identifier passed to the followingButton page to retrieve the number of following again
    followerIdentifier: 0 // this is an identifier passed to the followerButton page to retrieve the number of followers again
  };

  componentDidMount() {
    this.retrieveDetails();
  }

  /**
   * A function that gets the user's ID from Async Storage and calls an API to get user's details.
   * On success, it updates the user's name and picture and calls retrieveBadges function.
   */
  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ userid: id });
      fetch("http://localhost:8000/api/user_details/" + id, {
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
              const name = res.data.FirstName + " " + res.data.LastName;
              const flatListData = [1];
              // updating flatListData to allow the FlatList component to rerender, otherwise the data will be updated but the view will stay the same
              this.setState({
                avatarSource: res.data.ImageUrl,
                name,
                flatListData
              });
              this.onSuccess();
              this.retrieveBadges();
            } else {
              this.onFailure(
                "Can't get Data. Please check internet connectivity."
              );
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
  };

  /**
   * A function called by the FlatList. WHen scrolling down the refresh icon appears and this function is called.
   * It refreshes the profile page by updating the identifiers and calling retrieveDetails function.
   */
  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        // increment the identifiers so that the Following/FollowerButton pages will calls the functions to retrieve the data again.
        const followerIdentifier = this.state.followerIdentifier + 1;
        const followingIdentifier = this.state.followingIdentifier + 1;
        this.setState({ followerIdentifier, followingIdentifier });
        this.retrieveDetails();
      }
    );
  };

  /**
   * A function that calls an API to get all the badges earned by the user and adds them to the badgeList on success.
   */
  retrieveBadges() {
    try {
      const id = this.state.userid;
      fetch("http://localhost:8000/api/getbadges/" + id, {
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
              const flatListData = [2];
              // updating flatListData to allow the FlatList component to rerender, otherwise the data will be updated but the view will stay the same
              this.setState({ badgeList, flatListData });
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

  /**
   * A function that accepts an error string message and change the state to show the Error Animation Box Component.
   */
  onFailure(err) {
    this.setState({
      error: err,
      loading: false,
      animationErrorHeight: "auto",
      refreshing: false
    });
  }

  /**
   * A function that resets the loading and refreshing in the state and closes the Error Animation Box Component.
   */
  onSuccess() {
    console.log("Success");
    this.setState({
      loading: false,
      error: "",
      animationErrorHeight: "0.5%",
      refreshing: false
    });
  }

  /**
   * A function that is passed in the navigation props to the ProfileDetails Page and called from there when the user updates
   * his/her details. So the name and the picture would change too if the user changed them from the Profile Details page.
   */
  updateInfo(name, picUrl) {
    this.setState({ name });
    this.setState({ avatarSource: picUrl });
  }

  /**
   * A function called from the ErrorBoxAnimation Component to close the Error Animation
   */
  onCloseAnimationBox() {
    this.setState({ error: "", animationErrorHeight: "0.5%" });
  }

  /**
   * A function called when a badge is pressed to show it's title and information.
   */
  showBadgeInfo(title, info) {
    Alert.alert(title + " Badge", info, [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]);
  }

  /**
   * A function that iterates through the badges list and renders them.
   */
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

  /**
   * A function that renders the Follower Button component
   */
  renderFollowersButton() {
    if (this.state.loading === false && this.state.userid !== "") {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("followers", { Home: this });
          }}
        >
          <FollowersButton
            userid={this.state.userid}
            reset={this.state.resetComp}
            identifier={this.state.followingIdentifier}
          />
        </TouchableOpacity>
      );
    } else {
      return <Spinner size="small" />;
    }
  }

  /**
   * A function that renders the Following Button component
   */
  renderFollowingButton() {
    if (this.state.loading === false && this.state.userid !== "") {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("following", { Home: this });
          }}
        >
          <FollowingButton
            userId={this.state.userid}
            reset={this.state.resetComp}
            identifier={this.state.followingIdentifier}
            loggedInUserID={this.state.userid}
          />
        </TouchableOpacity>
      );
    } else {
      return <Spinner size="small" />;
    }
  }

  /**
   * Main built in render function that loads the whole page. It renders the upper part of the profile page inside a FlatList component
   * to allow refresh. The second part of the page is a Top Tab navigation Component (ProfileSubCategoriesRouter) that includes
   * Workout history, Map Search, and Expenses.
   */
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f4f4f4"
        }}
      >
        <View
          style={{
            marginTop: 5,
            justifyContent: "space-between",
            flexDirection: "column"
          }}
        >
          <FlatList
            data={this.state.flatListData}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "column",
                  width: "100%",
                  height: 200,
                  marginTop: 10
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "95%",
                    justifyContent: "space-between"
                  }}
                >
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
                      height: 88,
                      width: "auto",
                      justifyContent: "center"
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "space-evenly"
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <View style={{ width: 110 }}>
                          {this.renderFollowingButton()}
                        </View>
                        <View style={{ width: 110, marginRight: 10 }}>
                          {this.renderFollowersButton()}
                        </View>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <View style={{ height: 32, marginTop: 15, width: 120 }}>
                          <Button
                            size={"large"}
                            type={"secondary"}
                            onPress={() => {
                              this.props.navigation.navigate("details", {
                                updateInfo: this.updateInfo.bind(this)
                              });
                            }}
                          >
                            Edit Profile
                          </Button>
                        </View>
                        <View
                          style={{
                            height: 32,
                            width: 130,
                            marginTop: 15,
                            marginLeft: 15
                          }}
                        >
                          <Button
                            size={"large"}
                            type={"success"}
                            onPress={() => {
                              this.props.navigation.navigate("journal");
                            }}
                          >
                            Add Journal
                          </Button>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: 100,
                    width: "auto",
                    flexDirection: "column",
                    marginLeft: 20,
                    marginTop: 10
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {this.state.name}
                  </Text>
                  <ScrollView
                    horizontal={true}
                    style={{
                      marginTop: 8,
                      marginBottom: 8,
                      height: 50
                    }}
                  >
                    {this.renderBadges()}
                  </ScrollView>
                </View>
              </View>
            )}
            scrollEnabled={false}
            keyExtractor={item => "1"}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
          />
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              height: "63.8%"
            }}
          >
            <ProfileSubCategoriesRouter />
          </View>
          <AnimationErrorBox
            errorMsg={this.state.error}
            viewHeight={this.state.animationErrorHeight}
            onPress={this.onCloseAnimationBox.bind(this)}
          />
        </View>
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

export default ProfilePage;
