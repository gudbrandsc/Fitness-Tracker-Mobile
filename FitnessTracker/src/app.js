import React, { Component } from "react";
import { View, ActivityIndicator, ImageBackground } from "react-native";
import { Button, Spinner } from "./components/common";
import AuthPage from "./components/AuthPage";

class App extends Component {
  state = { loggedIn: null, startApp: null };

  componentDidMount() {
    setTimeout(() => {
      this.startApplication();
    }, 2000);
    this.retrieveData();
  }

  /**
   * A function that updates startApp variable
   */
  startApplication() {
    console.log("updating startApp");
    const startApp = true;
    this.setState({ startApp });
  }

  /**
   * A function that gets all 3 variables stored in the isolated storage. If all of them exist, then
   * it changes the loggedIn variable to true otherwise to false.
   */
  retrieveData = async () => {
    try {
      //const userToken = await AsyncStorage.getItem("Usertoken");
      //const pw = await AsyncStorage.getItem("pass");
      var loggedIn = false;
      //if(userToken !== null && pw !== null)
      // loggedIn = true;
      console.log("retrieving data");
      this.setState({ loggedIn });
    } catch (error) {
      const loggedIn = false;
      this.setState({ loggedIn });
    }
  };

  renderLogoPage() {
    const styles = {
      spinnerStyle: {
        flex: 1,
        alignItems: "center",
        marginTop: "110%"
      }
    };
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("./components/UIdesign/logoPage.jpg")}
      >
        <View style={styles.spinnerStyle}>
          <ActivityIndicator color="#3695d0" size="large" />
        </View>
      </ImageBackground>
    );
  }

  /**
   * A function that renders the page depending on the loggedIn value
   */
  checkLoginState() {
    switch (this.state.loggedIn) {
      case true:
        return (
          // <Button onPress={() => firebase.auth().signOut()}>Log Out</Button>
          <Button>Log out</Button>
        );
      case false:
        return <AuthPage />;
      default:
        return <Spinner size="large" />;
    }
  }

  renderContent() {
    switch (this.state.startApp) {
      case true:
        console.log("Here");
        return this.checkLoginState();
      default:
        return this.renderLogoPage(); // I will keep showing the startup image until I change the startApp value
    }
  }

  render() {
    return this.renderContent();
  }
}

export default App;
