import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import ProfilePage from "./ProfilePage";
import ProfileDetails from "./ProfileDetails";
import FollowingUsers from "./FollowingUsers";
import LoginPage from "./LoginPage";

const RootStack = createStackNavigator(
  {
    mainProfile: { screen: ProfilePage },
    details: { screen: ProfileDetails },
    following: { screen: FollowingUsers },
    login: { screen: LoginPage }
  },
  {
    initialRouteName: "mainProfile",
    navigationOptions: {
      headerTitleStyle: {
        flex: 1,
        fontSize: 22,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#646464"
      }
    }
  }
);

class ProfilePageRouter extends Component {
  render() {
    return <RootStack />;
  }
}

export default ProfilePageRouter;
