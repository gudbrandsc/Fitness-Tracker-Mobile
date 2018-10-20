import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import HomePageRouter from "./HomePageRouter";

const RootStack = createStackNavigator(
  {
    Login: { screen: LoginPage },
    Register: { screen: RegisterPage },
    Home: { screen: HomePageRouter }
  },
  {
    initialRouteName: "Login",
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

class AuthPageRouter extends Component {
  render() {
    return <RootStack />;
  }
}

export default AuthPageRouter;
