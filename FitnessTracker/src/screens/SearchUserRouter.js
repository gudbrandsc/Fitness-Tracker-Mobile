import React, { Component } from "react";
import { createStackNavigator,HeaderBackButton } from "react-navigation";
import VisitProfilePage from "./VisitProfilePage";
import SearchUserPage from "./SearchUserPage"


const RootStack = createStackNavigator(
  {
    mainProfile: { screen: SearchUserPage,},
    visitProfilePage: { screen: VisitProfilePage },

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
        fontFamily: "HelveticaNeue",
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
