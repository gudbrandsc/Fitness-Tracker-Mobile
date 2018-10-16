import React, { Component } from "react";
import { createStackNavigator, Text } from "react-navigation";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";

const RootStack = createStackNavigator(
  {
    Login: { screen: LoginPage },
    Register: { screen: RegisterPage },
    Home: { screen: HomePage }
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

class AuthPage extends Component {
  componentWillMount() {
    console.log(RootStack);
  }

  render() {
    return <RootStack />;
  }
}

export default AuthPage;
