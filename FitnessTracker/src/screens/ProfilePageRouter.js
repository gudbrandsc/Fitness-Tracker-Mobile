import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import ProfilePage from "./ProfilePage";
import ProfileDetails from "./ProfileDetails";
import FollowingUsers from "./FollowingUsers";
import TopAuthPageRouter from "./TopAuthPageRouter";
import SearchUserPage from "./SearchUserPage";

const RootStack = createStackNavigator(
  {
    mainProfile: { screen: ProfilePage },
    details: { screen: ProfileDetails },
    following: { screen: FollowingUsers },
    topAuthPage: { screen: TopAuthPageRouter },
    search: { screen: SearchUserPage }
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
        color: "#646464",
        fontFamily: "HelveticaNeue"
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
