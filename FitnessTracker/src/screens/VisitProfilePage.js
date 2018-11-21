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
  Alert
} from "react-native";
import { Button, Spinner, Header } from "../components/common";
import VisitFollowersButton from "./visitProfile/VisitFollowersButton";
import VisitFollowingButton from "./visitProfile/VisitFollowingButton";
import { Avatar } from "react-native-elements";
import axios from "axios";

class VisitProfilePage extends Component {
  static navigationOptions = {
    headerTitle: "Profile",
    headerStyle: {
      backgroundColor: '#00e6d3',
      height: 60,

    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: "600",
      color: "#fff",
      fontSize: 22,
      fontFamily: "arial"
    },
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
    loadFollowing: false,
    imFollowing: false,
    badgeList: [],

  };

  componentDidMount() {
    const { navigation } = this.props;
    const follows = navigation.getParam('follows', 'false');
    const userid = navigation.getParam('otherUserId');

    this.setState({imFollowing: follows, userid: userid})
    this.getUserData(userid);
  }

  getUserData(userid){
    try {
      fetch("http://localhost:8000/api/user_details/" + userid, {
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
    if (this.state.loading === false && this.state.userid !== "") {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("visitFollowersPage", {
              userid: this.state.userid,
              updateFollowState: this.updateFollowState
            });
          }}
        >
          <VisitFollowersButton userid={this.state.userid} />
        </TouchableOpacity>
      );
    } else {
      return <Spinner />;
    }
  }

  renderFollowingButton() {
    console.log("hello")
    if (this.state.loading === false && this.state.userid !== "") {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("visitFollowingPage", {
              userid: this.state.userid,
              updateFollowState: this.updateFollowState

            });
          }}
        >
          <VisitFollowingButton userid={this.state.userid} />
        </TouchableOpacity>
      );
    } else {
      return <Spinner />;
    }
  }

  renderFollowUnfollowButton(){
    if(this.state.imFollowing === true){
      return <Button  
      onPress={this.onUnfollowPress}
      type={"danger"}
      size={"large"}
      children={"Unfollow"} />
    }
    return <Button  
    onPress={this.onFollowPress}
    type={"primary"}
    size={"large"}
    children={"Follow"} />
  }

  onFollowPress = () => {
    const { navigation } = this.props;
    const myUserId = navigation.getParam('myUserId');
    const otherUserId = navigation.getParam('otherUserId');

    const requestUrl =
      "http://localhost:8000/api/createfollower/" +
      myUserId +
      "/" +
      otherUserId;
    axios.get(requestUrl).then(
      function(response) {
        if (response.status === 200) {
          this.setState({
            imFollowing: true,
            loading: false
          });
          navigation.state.params.updateFollow(true)
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
    const myUserId = navigation.getParam('myUserId');
    const otherUserId = navigation.getParam('otherUserId');

    const requestUrl =
      "http://localhost:8000/api/removefollower/" +
      myUserId +
      "/" +
      otherUserId
    axios.get(requestUrl).then(
      function(response) {
        if (response.status === 200) {
          this.setState({
            imFollowing: false,
            loading: false
          });
          
          navigation.state.params.updateFollow(false)

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
              console.log(res.data);
              const badgeList = res.data;
              this.setState({ badgeList });
            } else {
              this.onFailure("Could not retrieve badges for this user.");
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
      <View style={{ flex: 1, backgroundColor: '#f7f6ef' }}>
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
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ width: "100%" }}>
                    {this.renderFollowingButton()}
                  </View>
                  <View style={{ width: "100%", marginLeft: 15 }}>
                    {this.renderFollowersButton()}
                  </View>
                </View>
              </View>

            <View style={{flex:1, flexDirection:'row'}}>
              <View style={{ width:'190%', paddingTop:10}}>
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
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {this.state.name}
            </Text>
            <ScrollView horizontal={true}>
                {this.renderBadges()}
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
