import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import ProfilePage from "./ProfilePage";
import ProfileDetails from "./ProfileDetails";
import FollowingPage from "./FollowingPage";
import FollowersPage from "./FollowersPage";
import TopAuthPageRouter from "./TopAuthPageRouter";
import SearchUserPage from "./SearchUserPage";
import Journal from "./Journal";

const RootStack = createStackNavigator(
  {
    mainProfile: { screen: ProfilePage },
    details: { screen: ProfileDetails },
    following: { screen: FollowingPage },
    followers: { screen: FollowersPage },
    
    topAuthPage: { screen: TopAuthPageRouter },
    search: { screen: SearchUserPage },
    journal: { screen: Journal }
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
