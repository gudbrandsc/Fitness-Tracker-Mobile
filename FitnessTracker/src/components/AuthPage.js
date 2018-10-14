import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";

const RootStack = createStackNavigator(
  {
    Login: { screen: LoginPage },
    Register: { screen: RegisterPage }
  },
  {
    initialRouteName: "Login"
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
