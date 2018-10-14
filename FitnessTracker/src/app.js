import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import { Button, Spinner } from "./components/common";
import AuthPage from "./components/AuthPage";

class App extends Component {
  state = { loggedIn: null };

  componentWillMount() {
    this.retrieveData();
  }

  /* check if stored in mobile's storage */
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("login");
      var loggedIn = false;
      //if (value !== null) loggedIn = true;
      console.log(value);
      this.setState({ loggedIn });
    } catch (error) {
      const loggedIn = false;
      this.setState({ loggedIn });
    }
  };

  renderContent() {
    console.log("Here");
    switch (this.state.loggedIn) {
      case true:
        return (
          // <Button onPress={() => firebase.auth().signOut()}>Log Out</Button>
          <Button>Log out</Button>
        );
      case false:
        console.log("inside AuthPage");
        return <AuthPage />;
      default:
        return <Spinner size="large" />;
    }
  }

  render() {
    return this.renderContent();
  }
}

export default App;
