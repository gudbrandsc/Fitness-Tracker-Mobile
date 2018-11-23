import React, { Component } from "react";
import { createStackNavigator, HeaderBackButton } from "react-navigation";
import VisitProfilePage from "./VisitProfilePage";
import SearchUserPage from "./SearchUserPage";
import VisitFollowersPage from "./visitProfile/VisitFollowersPage";
import VisitFollowingPage from "./visitProfile/VisitFollowingPage";

const RootStack = createStackNavigator(
  {
    mainSearch: { screen: SearchUserPage },
    visitProfilePage: { screen: VisitProfilePage },
    visitFollowingPage: { screen: VisitFollowingPage },
    visitFollowersPage: { screen: VisitFollowersPage }
  },
  {
    initialRouteName: "mainSearch",
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

class SearchUserRouter extends Component {
  render() {
    return <RootStack />;
  }
}

export default SearchUserRouter;
