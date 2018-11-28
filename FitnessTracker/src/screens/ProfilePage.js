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
    followingIdentifier: 0,
    followerIdentifier: 0
  };

  componentDidMount() {
    this.retrieveDetails();
  }

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

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        const followerIdentifier = this.state.followerIdentifier + 1;
        const followingIdentifier = this.state.followingIdentifier + 1;
        this.setState({ followerIdentifier, followingIdentifier });
        this.retrieveDetails();
      }
    );
  };

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

  onFailure(err) {
    this.setState({
      error: err,
      loading: false,
      animationErrorHeight: "auto",
      refreshing: false
    });
  }

  onSuccess() {
    console.log("Success");
    this.setState({
      loading: false,
      error: "",
      animationErrorHeight: "0.5%",
      refreshing: false
    });
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

  render() {
    return (
      <FlatList
        data={this.state.flatListData}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              backgroundColor: "#f4f4f4",
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height - 150
            }}
          >
            <View style={{ marginTop: 20 }}>
              <View
                style={{
                  flexDirection: "column",
                  width: "100%",
                  height: "auto"
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

                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <View
                          style={{ height: 32, marginTop: 15, width: "100%" }}
                        >
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
                            width: "100%",
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
                    height: "auto",
                    width: "auto",
                    flexDirection: "column",
                    marginLeft: 20,
                    marginTop: 20
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {this.state.name}
                  </Text>
                  <ScrollView
                    horizontal={true}
                    style={{ marginTop: 8, marginBottom: 8 }}
                  >
                    {this.renderBadges()}
                  </ScrollView>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  width: "100%",
                  height: "63%"
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
        )}
        scrollEnabled={false}
        keyExtractor={item => "1"}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
      />
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
