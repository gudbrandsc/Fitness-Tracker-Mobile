import React, { Component } from "react";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}
import ProfileSubCategoriesRouter from "./ProfileSubCategoriesRouter";
import {
  AsyncStorage,
  View,
  ScrollView,
  Text,
  TouchableOpacity
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
    loadFollowers: false,
    loadFollowing: false
  };

  componentDidMount() {
    this.retrieveDetails();
  }

  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ userid: id });
      console.log("async id : " + this.state.userid);
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
            this.setState({ loadFollowers: true, loadFollowing: true });
            if (res.status === 200) {
              const name = res.data.FirstName + " " + res.data.LastName;
              this.setState({ name });
              this.setState({ avatarSource: res.data.ImageUrl });
              this.onSuccess();
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
  };

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
    if (this.state.loading === false && this.state.userid !== "") {
      console.log("profile page render button with id: " + this.state.userid);
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("followers");
          }}
        >
          <FollowersButton userid={this.state.userid} />
        </TouchableOpacity>
      );
    } else {
      return <Spinner />;
    }
  }

  renderFollowingButton() {
    if (this.state.loading === false && this.state.userid !== "") {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("following");
          }}
        >
          <FollowingButton userid={this.state.userid} />
        </TouchableOpacity>
      );
    } else {
      return <Spinner />;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
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
              <View style={{ flex: 1, marginRight: 5 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignContent: "stretch"
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
                  <View style={{ height: 32, marginTop: 15, width: "100%" }}>
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
            <ScrollView horizontal={true}>
              <Text style={{ fontSize: 20 }}>Badges</Text>
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            height: "65%"
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
