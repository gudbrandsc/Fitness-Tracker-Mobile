import React, { Component } from "react";
import {
  AsyncStorage,
  View,
  ActivityIndicator,
  ImageBackground,
  Dimensions
} from "react-native";
import AuthPageRouter from "./screens/AuthPageRouter";
import HomePageRouter from "./screens/HomePageRouter";

/**
 * Script called when the app starts, it gets the credentials from the AsyncStorage to check if
 * user is previously logged in or not. If the user is previously logged in, it loads the
 * AuthPageRouter, otherwise it loads the HomePageRouter
 */
class App extends Component {
  state = { loggedIn: -1, startApp: 0 };

  componentDidMount() {
    console.disableYellowBox = true; // disable yellow box when running in debug mode
    setTimeout(() => {
      this.startApplication();
    }, 2000); // wait for 2 seconds before starting the application
    this.retrieveData();
  }

  /**
   * A function that updates startApp variable
   */
  startApplication() {
    const startApp = 1;
    this.setState({ startApp });
  }

  /**
   * A function that gets all variables stored in the Async storage. If all of them exist, then
   * it changes the loggedIn variable to true otherwise to false.
   */
  retrieveData = async () => {
    try {
      const userToken = await AsyncStorage.getItem("Usertoken");
      const pw = await AsyncStorage.getItem("pass");
      var loggedIn = 0;
      if (userToken !== null && pw !== null) loggedIn = 1;
      this.setState({ loggedIn });
    } catch (error) {
      const loggedIn = 0;
      this.setState({ loggedIn });
    }
  };

  /**
   * A function that renders the logo page with the loading spinner
   */
  renderLogoPage() {
    const styles = {
      spinnerStyle: {
        flex: 1,
        marginTop: Dimensions.get("window").height * 0.6
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
   * A function that renders the page depending on the loggedIn value, if logged in then load HomePageRouter
   * Otherwise load AuthPageRouter
   */
  checkLoginState() {
    if (this.state.loggedIn === 1) return <HomePageRouter />;
    else return <AuthPageRouter />;
  }

  /**
   * A function that renders the page depending on startApp and loggedIn. As long as startApp is not 1 then app
   * will render the logo with the spinner, otherwise it will call checkLoginState
   */
  renderContent() {
    if (this.state.startApp === 1 && this.state.loggedIn > -1)
      return this.checkLoginState();
    else return this.renderLogoPage(); // I will keep showing the startup image until I change the startApp value
  }

  /**
   * Main render built in function
   */
  render() {
    return this.renderContent();
  }
}

export default App;
