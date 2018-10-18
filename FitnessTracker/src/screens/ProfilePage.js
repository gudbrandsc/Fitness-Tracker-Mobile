import React, { Component } from "react";
import {
  AsyncStorage,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import {
  Card,
  CardSection,
  Button,
  Input,
  Spinner
} from "../components/common";
import AnimationErrorBox from "../components/common/AnimationErrorBox"; // this uses export default so can't be in {}

class ProfilePage extends Component {
  static navigationOptions = {
    headerTitle: "Create Account"
  };

  state = {
    id: "",
    name: "",
    error: "",
    loading: false,
    avatarSource: require("../components/UIdesign/blank-profile-picture.png"),
    pic: null,
    animationErrorHeight: "0.5%"
  };

  componentDidMount() {
    this.retrieveDetails();
  }

  retrieveDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("login");
      const pw = await AsyncStorage.getItem("pass");
      this.setState({ id: id, password: pw });
      fetch("http://10.1.86.4:8000/api/user_details/" + id, {
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

  /**
   * A function called when pressing the close button in the animation error box
   */
  onCloseAnimationBox() {
    this.setState({ error: "", animationErrorHeight: "0.5%" });
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
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
              <View style={{ height: 32, width: 200, marginBottom: 20 }}>
                <Button
                  size={"large"}
                  type={"secondary"}
                  onPress={() => {
                    this.props.navigation.navigate("details");
                  }}
                >
                  Edit Profile
                </Button>
              </View>
              <View style={{ height: 32, width: 200 }}>
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
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("following");
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#007aff" }}
              >
                Following
              </Text>
            </TouchableOpacity>
          </View>
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
