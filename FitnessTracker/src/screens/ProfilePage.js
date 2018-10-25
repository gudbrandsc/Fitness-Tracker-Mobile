import React, { Component } from "react";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}
import ProfileSubCategoriesRouter from "./ProfileSubCategoriesRouter";
import {
  AsyncStorage,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { Button } from "../components/common";
import  FollowingButton  from "../components/profilePage/FollowingButton";


class ProfilePage extends Component {
  static navigationOptions = {
    headerTitle: "My Profile"
  };

  state = {
    id: "",
    name: "",
    error: "",
    loading: false,
    avatarSource: require("../components/UIdesign/blank-profile-picture.png"),
    pic: null,
    animationErrorHeight: "0.5%",
    followingNumber: '',
    followData: []
  };

  componentDidMount() {
    this.retrieveDetails();
  }


  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      this.setState({ id });
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
              this.setState({ name });
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

  updateInfo(name) {
    this.setState({ name });
  }

  /**
   * A function called when pressing the close button in the animation error box
   */
  onCloseAnimationBox() {
    this.setState({ error: "", animationErrorHeight: "0.5%" });
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 20}}>
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            height: "40%"
          }}
        >
          <View style={{ flexDirection: "row", width: 100 }}>
            <View style={styles.profileImgContainer}>
              <Image
                source={this.state.avatarSource}
                style={{
                  height: 90,
                  width: 90,
                  borderRadius: 50
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
            <View style={{flex:1, marginRight: 5}}>
            <View style={{flex:1, flexDirection: "row", justifyContent: 'space-between', alignContent: 'stretch'}}>
              <View style={{width: '100%'}}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("following"); }}>
                  <FollowingButton />
                </TouchableOpacity>
                </View>
                <View style={{width: '100%'}}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("following"); }}>
                  <FollowingButton />
                </TouchableOpacity>
              </View>
            </View>

              <View style={{flex:1, flexDirection: "row", justifyContent: 'space-between'}}>
                <View style={{ height: 32, marginBottom: 20, width: '100%' }}>
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
                <View style={{ height: 32, width: '100%',marginBottom: 20 }}>
                  <Button
                    size={"large"}
                    type={"green"}
                    onPress={() => {
                      this.props.navigation.navigate("following");
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
            height: "60%"
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
    marginLeft: 15,
    height: 90,
    width: 90,
    borderRadius: 50,
    overflow: "hidden",
    borderColor: "#007aff",
    borderWidth: 1
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: "center",
    color: "red"
  }
};

export default ProfilePage;
